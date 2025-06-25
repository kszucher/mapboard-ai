import axios from 'axios';
import jwt from 'jsonwebtoken';

export class AiService {
  private readonly nodePySecret: string;
  private readonly pythonUrl: string;

  constructor(
    nodePySecret: string,
    pythonUrl: string,
  ) {
    this.nodePySecret = nodePySecret;
    this.pythonUrl = pythonUrl;
  }

  private generateToken(): string {
    const payload = {
      service: 'mapboard',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60, // token valid for 60s
    };

    return jwt.sign(payload, this.nodePySecret, { algorithm: 'HS256' });
  }

  async ingestion(fileHash: string): Promise<JSON | undefined> {
    const token = this.generateToken();

    try {
      const response = await axios.post(
        this.pythonUrl + '/ingestion',
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

  async vectorDatabase(ingestionList: any[], contextList: string[], question: string) {
    const token = this.generateToken();

    try {
      const response = await axios.post(
        this.pythonUrl + '/vector-database',
        { ingestionList, contextList, question },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (err: any) {
      console.error('Vector Database failed:', err.response?.data || err.message);
    }
  }

  async llm() {

  }
}
