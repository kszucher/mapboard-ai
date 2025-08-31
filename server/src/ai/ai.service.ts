import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { z } from 'zod';

export class AiService {
  constructor() {}

  async ingestion(fileHash: string): Promise<JSON | undefined> {
    return undefined;
  }

  async vectorDatabase(ingestionList: any[], contextList: string[], question: string) {}

  async llm({ llmInstructions, llmInputJson }: { llmInstructions: string; llmInputJson: any }): Promise<any> {
    const dynamicAgent = new Agent({
      name: 'dynamicAgent',
      instructions: llmInstructions,
      model: openai('gpt-4o'),
    });

    const prompt = `
      You are an agent that have the following inputs:
      ${llmInputJson}
      Follow user instructions:
      ${llmInstructions}
    `;

    console.log(prompt);

    const result = await dynamicAgent.generateVNext(prompt, {
      structuredOutput: {
        schema: z.object({
          text: z.string(),
        }),
        model: openai('gpt-4o'), // Model is required for structured output
      },
    });

    return result.object; // The structured output is in result.object
  }

  async dataFrame() {
    // TODO query against the dataFrame
  }
}
