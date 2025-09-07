import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { z } from 'zod';
import { PrismaClient } from '../generated/client';
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

    const llmInputJson = {
      inputLlmNode,
      inputVectorDatabaseNode,
      inputDataFrameNode,
      inputContextNode,
      inputQuestionNode,
    };

    const dynamicAgent = new Agent({
      name: 'dynamicAgent',
      instructions: node.llmInstructions,
      model: openai('gpt-4o'),
    });

    const prompt = `
      You are an agent that have the following inputs:
      ${JSON.stringify(node.llmInputJson)}
      Follow user instructions:
      ${node.llmInstructions}
    `;

    console.log(prompt);

    const result = await dynamicAgent.generateVNext(prompt, {
      structuredOutput: {
        // TODO: adaptive schema
        schema: z.object({
          text: z.string(),
        }),
        model: openai('gpt-4o'), // Model is required for structured output
      },
    });

    const llmOutputJson = result.object; // The structured output is in result.object

    await this.prisma.mapNode.update({
      where: { id: nodeId },
      data: { llmInputJson, llmOutputJson },
    });
  }
}
