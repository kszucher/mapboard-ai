import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { injectable } from 'tsyringe';
import { z } from 'zod';
import { LlmOutputSchema } from '../../../shared/src/api/api-types-node';
import { DataFrameQuerySchema } from './execute-data-frame.types';
import { NodeRepository } from '../map/node.repository';
import { PrismaClient } from '../generated/client';

@injectable()
export class ExecuteLlmService {
  constructor(
    private prisma: PrismaClient,
    private nodeRepository: NodeRepository
  ) {}

  async execute({ workspaceId, mapId, nodeId }: { workspaceId: number; mapId: number; nodeId: number }) {
    const [inputLlmNode, inputVectorDatabaseNode, inputDataFrameNode, inputContextNode, inputQuestionNode, node] =
      await Promise.all([
        this.nodeRepository.getInputLlmNode({ mapId, nodeId }),
        this.nodeRepository.getInputVectorDatabaseNode({ mapId, nodeId }),
        this.nodeRepository.getInputDataFrameNode({ mapId, nodeId }),
        this.nodeRepository.getInputContextNode({ mapId, nodeId }),
        this.nodeRepository.getInputQuestionNode({ mapId, nodeId }),
        this.nodeRepository.getNode({ mapId, nodeId }),
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

    return this.prisma.node.update({
      where: { id: nodeId },
      data: { workspaceId, llmOutputJson },
      select: { id: true, workspaceId: true, llmOutputJson: true, updatedAt: true },
    });
  }
}
