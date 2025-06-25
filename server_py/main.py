import os
import tempfile
import uuid

import jwt
import openai
import pinecone
import requests
from docling.document_converter import DocumentConverter
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Dict, Any

load_dotenv()

app = FastAPI()
JWT_SECRET = os.getenv("NODE_PY_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENV = os.getenv("PINECONE_ENV")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")

bearer_scheme = HTTPBearer()

openai.api_key = OPENAI_API_KEY
pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_ENV)
pinecone_index = pinecone.Index(PINECONE_INDEX_NAME)


class IngestionRequest(BaseModel):
    fileHash: str


class VectorDatabaseRequest(BaseModel):
    ingestionList: List[Dict[str, Any]]
    contextList: List[str]
    question: str


def verify_jwt(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=403, detail="Invalid or expired JWT")


def get_embedding(text: str) -> List[float]:
    response = openai.Embedding.create(
        input=[text],
        model="text-embedding-ada-002"
    )
    return response['data'][0]['embedding']


def upsert_to_pinecone(items: List[Dict[str, Any]]):
    # Chunked upsert to Pinecone
    BATCH_SIZE = 100
    for i in range(0, len(items), BATCH_SIZE):
        batch = items[i:i + BATCH_SIZE]
        pinecone_index.upsert(batch)


@app.post("/ingestion")
async def ingest_doc(request: IngestionRequest, token_payload: dict = Depends(verify_jwt)):
    file_url = f"https://gateway.pinata.cloud/ipfs/{request.fileHash}"

    try:
        response = requests.get(file_url)
        response.raise_for_status()

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            tmp_file.write(response.content)
            tmp_file_path = tmp_file.name

        converter = DocumentConverter()
        result = converter.convert(tmp_file_path)

        return result.document.export_to_dict()

    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Download failed: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion failed: {e}")


@app.post("/vector-database")
async def vector_database(request: VectorDatabaseRequest, token_payload: dict = Depends(verify_jwt)):
    try:
        upsert_items = []

        # Embed each section in ingestionList
        for doc in request.ingestionList:
            text = doc.get("text", "")
            if text.strip():
                vector = get_embedding(text)
                vector_id = str(uuid.uuid4())
                metadata = {"type": "document", "source": doc.get("source", "unknown")}
                upsert_items.append((vector_id, vector, metadata))

        # Embed each item in contextList
        for context in request.contextList:
            if context.strip():
                vector = get_embedding(context)
                vector_id = str(uuid.uuid4())
                metadata = {"type": "context"}
                upsert_items.append((vector_id, vector, metadata))

        # Upsert all vectors to Pinecone
        upsert_to_pinecone(upsert_items)

        # Embed the question and query Pinecone
        question_embedding = get_embedding(request.question)
        query_result = pinecone_index.query(
            vector=question_embedding,
            top_k=5,
            include_metadata=True
        )

        print("Pinecone Query Results:", query_result)

        return {"matches": query_result["matches"]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vector DB process failed: {e}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
