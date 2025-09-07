import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { z } from 'zod';
import { LlmOutputSchema } from '../../../shared/src/map/state/map-consts-and-types';
import { PrismaClient } from '../generated/client';
import { DataFrameQuerySchema, DataFrameQuerySchemaType } from './map-node-data-frame.types';
import { MapNodeService } from './map-node.service';

export class MapNodeLlmService {
  constructor(
    private prisma: PrismaClient,
    private getMapNodeService: () => MapNodeService
  ) {}

  get mapNodeService(): MapNodeService {
    return this.getMapNodeService();
  }

  async execute({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    const [inputLlmNode, inputVectorDatabaseNode, inputDataFrameNode, inputContextNode, inputQuestionNode, node] =
      await Promise.all([
        this.mapNodeService.getInputLlmNode({ mapId, nodeId }),
        this.mapNodeService.getInputVectorDatabaseNode({ mapId, nodeId }),
        this.mapNodeService.getInputDataFrameNode({ mapId, nodeId }),
        this.mapNodeService.getInputContextNode({ mapId, nodeId }),
        this.mapNodeService.getInputQuestionNode({ mapId, nodeId }),
        this.mapNodeService.getNode({ mapId, nodeId }),
      ]);

    if (!node.llmInstructions) {
      throw new Error('no llm instructions or input json');
    }

    if (!node.llmOutputSchema) {
      throw new Error('no llm output schema set');
    }

    const schema = {
      [LlmOutputSchema.TEXT]: z.object({
        text: z.string(),
      }),
      [LlmOutputSchema.VECTOR_DATABASE_QUERY]: z.object({
        text: z.string(),
      }),
      [LlmOutputSchema.DATA_FRAME_QUERY]: DataFrameQuerySchema,
    }[node.llmOutputSchema];

    const llmInputJson = {
      inputLlmNode,
      inputVectorDatabaseNode,
      inputDataFrameNode,
      inputContextNode,
      inputQuestionNode,
    };

    const prompt = `
      You are an agent that have the following inputs:
      ${JSON.stringify(llmInputJson)}
      Follow user instructions:
      ${node.llmInstructions}
    `;

    console.log(prompt);

    const agent = new Agent({
      name: 'agent',
      instructions: node.llmInstructions,
      model: openai('gpt-4o'),
    });

    const result = await agent.generateVNext(prompt, {
      structuredOutput: {
        schema,
        model: openai('gpt-4o'),
      },
    });

    const llmOutputJson = result.object;

    await this.prisma.mapNode.update({
      where: { id: nodeId },
      data: { llmOutputJson },
    });
  }
}
