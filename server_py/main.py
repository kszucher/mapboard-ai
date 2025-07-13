import os
import tempfile
from typing import List, Dict, Any

import jwt
import requests
from docling.document_converter import DocumentConverter
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

load_dotenv()

JWT_SECRET = os.getenv("NODE_PY_SECRET")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

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
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=403, detail="Invalid or expired JWT")


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
        pass


    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vector DB process failed: {e}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
