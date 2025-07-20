import os
import tempfile
import uuid
from typing import List, Dict, Any
import time
import asyncio
import logging

import jwt
import requests
from docling.document_converter import DocumentConverter
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from pinecone import Pinecone, ServerlessSpec
from openai import OpenAI
import tiktoken
import re

load_dotenv()

# Setup
logging.basicConfig(level=logging.INFO)
JWT_SECRET = os.getenv("NODE_PY_SECRET")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
pc = Pinecone(api_key=PINECONE_API_KEY)
openai_client = OpenAI(api_key=OPENAI_API_KEY)

EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DIMENSION = 1536
CHUNK_SIZE = 800
CHUNK_OVERLAP = 100
INDEX_NAME = "document-embeddings"

app = FastAPI()
bearer_scheme = HTTPBearer()


class IngestionRequest(BaseModel):
    fileHash: str


class VectorDatabaseRequest(BaseModel):
    ingestionList: List[Dict[str, Any]]
    contextList: List[str]
    question: str


def verify_jwt(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    try:
        return jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(status_code=403, detail="Invalid or expired JWT")


def get_encoding(model: str = "gpt-4"):
    try:
        return tiktoken.encoding_for_model(model)
    except KeyError:
        return tiktoken.get_encoding("cl100k_base")


def count_tokens(text: str, encoding) -> int:
    return len(encoding.encode(text))


def clean_text(text: str) -> str:
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s\.,!?;:\-()]', ' ', text)
    return text.strip()


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
    encoding = get_encoding()
    text = clean_text(text)
    if count_tokens(text, encoding) <= chunk_size:
        return [text] if text.strip() else []

    words = text.split()
    chunks, current_chunk = [], []
    current_tokens = 0

    for word in words:
        word_tokens = count_tokens(word + " ", encoding)
        if current_tokens + word_tokens > chunk_size and current_chunk:
            chunks.append(" ".join(current_chunk))
            overlap_words = max(0, overlap // 10)
            current_chunk = current_chunk[-overlap_words:] if overlap_words > 0 else []
            current_tokens = count_tokens(" ".join(current_chunk), encoding)
        current_chunk.append(word)
        current_tokens += word_tokens

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return [chunk for chunk in chunks if chunk.strip()]


async def generate_embedding(text: str, retries=3) -> List[float]:
    for attempt in range(retries):
        try:
            response = openai_client.embeddings.create(input=text, model=EMBEDDING_MODEL)
            return response.data[0].embedding
        except Exception as e:
            if attempt == retries - 1:
                raise HTTPException(status_code=500, detail=f"Embedding generation failed: {e}")
            await asyncio.sleep(2 ** attempt)


def generate_namespace_id() -> str:
    return f"ns-{uuid.uuid4().hex[:16]}"


def create_document_id(namespace: str, doc_index: int, chunk_index: int) -> str:
    return f"{namespace}-doc{doc_index}-chunk{chunk_index}-{uuid.uuid4().hex[:8]}"


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
        namespace_id = generate_namespace_id()
        existing_indexes = [index.name for index in pc.list_indexes()]

        if INDEX_NAME not in existing_indexes:
            pc.create_index(
                name=INDEX_NAME,
                dimension=EMBEDDING_DIMENSION,
                metric='cosine',
                spec=ServerlessSpec(cloud='aws', region='us-east-1')
            )
            for _ in range(10):
                try:
                    pc.describe_index(INDEX_NAME)
                    break
                except Exception:
                    time.sleep(3)

        index = pc.Index(INDEX_NAME)
        vectors_to_upsert = []
        total_chunks = 0
        encoding = get_encoding()

        for doc_index, doc_data in enumerate(request.ingestionList):
            text_content = doc_data.get('text') or doc_data.get('content') or doc_data.get('extracted_text') or " ".join(
                [str(v) for v in doc_data.values() if isinstance(v, str)])
            if not text_content.strip():
                continue

            chunks = chunk_text(text_content)
            for chunk_index, chunk in enumerate(chunks):
                if not chunk.strip():
                    continue

                embedding = await generate_embedding(chunk)
                vector_id = create_document_id(namespace_id, doc_index, chunk_index)

                metadata = {
                    'document_index': doc_index,
                    'chunk_index': chunk_index,
                    'text': chunk[:500],
                    'full_text_length': len(chunk),
                    'namespace': namespace_id,
                    'source_type': 'docling_pdf'
                }

                for key, value in doc_data.items():
                    if key not in ['text', 'content', 'extracted_text'] and isinstance(value, (str, int, float, bool)):
                        metadata[f'source_{key}'] = value

                context_str = ""
                for c in request.contextList[:3]:
                    if count_tokens(context_str + "; " + c, encoding) <= 300:
                        context_str += "; " + c
                metadata['context'] = context_str.strip("; ")

                vectors_to_upsert.append({
                    'id': vector_id,
                    'values': embedding,
                    'metadata': metadata
                })
                total_chunks += 1

        if not vectors_to_upsert:
            raise HTTPException(status_code=400, detail="No valid content found to process")

        for i in range(0, len(vectors_to_upsert), 100):
            batch = vectors_to_upsert[i:i + 100]
            index.upsert(vectors=batch, namespace=namespace_id)

        return {
            "namespace_id": namespace_id,
            "total_documents": len(request.ingestionList),
            "total_chunks": total_chunks,
            "index_name": INDEX_NAME
        }

    except HTTPException:
        raise
    except Exception as e:
        logging.exception("Unexpected error in vector_database")
        raise HTTPException(status_code=500, detail=f"Vector DB process failed: {e}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
