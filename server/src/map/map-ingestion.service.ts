import axios from 'axios';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.NODE_PY_SECRET as string;
const JWT_ALGORITHM = 'HS256';
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000/ingestion';

export class MapIngestionService {
  constructor() {
  }

  private generateToken(): string {
    const payload = {
      service: 'mapboard',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60, // token valid for 60s
    };

    return jwt.sign(payload, JWT_SECRET, { algorithm: JWT_ALGORITHM });
  }

  async ingest(fileHash: string): Promise<JSON | undefined> {
    const token = this.generateToken();

    try {
      const response = await axios.post(
        PYTHON_SERVICE_URL,
        { fileHash },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (err: any) {
      console.error('Ingestion failed:', err.response?.data || err.message);
    }
  }
}
