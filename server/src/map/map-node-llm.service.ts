import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { SSE_EVENT_TYPE } from '../../../shared/src/api/api-types-distribution';
import { LlmOutputSchema } from '../../../shared/src/api/api-types-map-node';
import { DistributionService } from '../distribution/distribution.service';
import { PrismaClient } from '../generated/client';
import { WorkspaceRepository } from '../workspace/workspace.repository';
import { DataFrameQuerySchema } from './map-node-data-frame.types';
import { MapNodeRepository } from './map-node.repository';

@injectable()
export class MapNodeLlmService {
  constructor(
    @inject('PrismaClient') private prisma: PrismaClient,
    private mapNodeService: MapNodeRepository,
    private workspaceRepository: WorkspaceRepository,
    private distributionService: DistributionService
  ) {}

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
      [LlmOutputSchema.TEXT]: z.object({ text: z.string() }),
      [LlmOutputSchema.VECTOR_DATABASE_QUERY]: z.object({ text: z.string() }),
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

    const isText = node.llmOutputSchema === LlmOutputSchema.TEXT;

    const result = await agent.generateVNext(
      prompt,
      isText
        ? undefined
        : {
            structuredOutput: {
              schema,
              model: openai('gpt-4o'),
            },
          }
    );

    const llmOutputJson = isText ? { text: result.text } : result.object;

    const mapNode = await this.prisma.mapNode.update({
      where: { id: nodeId },
      data: { llmOutputJson },
      select: { id: true, llmOutputJson: true },
    });

    const workspaceIdsOfMap = await this.workspaceRepository.getWorkspaceIdsOfMap({ mapId });
    await this.distributionService.publish(workspaceIdsOfMap, {
      type: SSE_EVENT_TYPE.UPDATE_NODE,
      payload: { node: mapNode },
    });
  }
}
