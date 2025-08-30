export class AiService {
  constructor() {}

  async ingestion(fileHash: string): Promise<JSON | undefined> {
    return undefined;
  }

  async vectorDatabase(ingestionList: any[], contextList: string[], question: string) {}

  async llm() {}
}
