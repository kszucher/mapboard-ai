import os
import tempfile

import jwt
import requests
from docling.document_converter import DocumentConverter
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

load_dotenv()

app = FastAPI()
JWT_SECRET = os.getenv("NODE_PY_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
bearer_scheme = HTTPBearer()


class IngestionRequest(BaseModel):
    fileHash: str


def verify_jwt(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
