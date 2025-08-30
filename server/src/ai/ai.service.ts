import { openai } from '@ai-sdk/openai';
import { Mastra } from '@mastra/core';
import { Agent } from '@mastra/core/agent';
import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { ControlType } from '../../../shared/src/map/state/map-consts-and-types';

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

    const step1 = createStep(dynamicAgent);

    const dynamicWorkflow = createWorkflow({
      id: 'agent-step-workflow',
      inputSchema: z.object({
        [ControlType.LLM]: z.array(z.tuple([z.string(), z.any()])), // llm output can be any
        [ControlType.VECTOR_DATABASE]: z.array(z.tuple([z.string(), z.string()])),
        [ControlType.CONTEXT]: z.array(z.tuple([z.string(), z.string()])),
        [ControlType.DATAFRAME]: z.array(z.tuple([z.string(), z.string()])),
        [ControlType.QUESTION]: z.array(z.tuple([z.string(), z.string()])),
      }),
      outputSchema: z.object({}),
    })
      .map(async ({ inputData }) => {
        const { LLM, VECTOR_DATABASE, DATAFRAME, CONTEXT, QUESTION } = inputData;
        return {
          prompt: `You are an agent that has the following inputs:
            ${LLM} - input from another agent
            ${VECTOR_DATABASE} - result of a vector database query
            ${DATAFRAME} - result of a dataframe query
            ${CONTEXT} - user context
            ${QUESTION} - user question
            Follow user instructions: ${llmInstructions}.
          `,
        };
      })
      .then(step1)
      .commit();

    const mastra = new Mastra({
      workflows: { dynamicWorkflow },
      telemetry: {
        serviceName: 'my-app',
        enabled: false,
      },
    });

    const run = await mastra.getWorkflow('dynamicWorkflow').createRunAsync();

    return await run.start({
      inputData: llmInputJson,
    });
  }
}
