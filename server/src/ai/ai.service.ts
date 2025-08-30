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

    // Format the input data into a prompt
    const { LLM, VECTOR_DATABASE, DATAFRAME, CONTEXT, QUESTION } = llmInputJson;

    const prompt = `You are an agent that may have one or more of the following inputs:
      ${LLM ? `LLM input: ${LLM}` : ''}
      ${VECTOR_DATABASE ? `Vector database result: ${VECTOR_DATABASE}` : ''}
      ${DATAFRAME ? `Dataframe result: ${DATAFRAME}` : ''}
      ${CONTEXT ? `Context: ${CONTEXT}` : ''}
      ${QUESTION ? `Question: ${QUESTION}` : ''}
      Follow user instructions: ${llmInstructions}.
    `;

    console.log(prompt);

    // Use generateVNext with structured output for v2 models like gpt-4o
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
}
