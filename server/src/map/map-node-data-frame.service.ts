import { LlmOutputSchema } from '../../../shared/src/map/state/map-consts-and-types';
import { PrismaClient } from '../generated/client';
import { MapNodeService } from './map-node.service';

export class MapNodeDataFrameService {
  constructor(
    private prisma: PrismaClient,
    private getMapNodeService: () => MapNodeService
  ) {}

  get mapNodeService(): MapNodeService {
    return this.getMapNodeService();
  }

  async execute({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    const [inputFileNode, inputLlmNode, node] = await Promise.all([
      this.mapNodeService.getInputFileNode({ mapId, nodeId }),
      this.mapNodeService.getInputLlmNode({ mapId, nodeId }),
      this.mapNodeService.getNode({ mapId, nodeId }),
    ]);

    if (!inputLlmNode) {
      throw new Error('no input llm node');
    }

    if (!inputLlmNode.llmOutputJson) {
      throw new Error('no input llm output json');
    }

    if (!inputLlmNode.llmOutputSchema) {
      throw new Error('no input llm output schema');
    }

    if (inputLlmNode.llmOutputSchema !== LlmOutputSchema.DATA_FRAME_QUERY) {
      throw new Error('input llm output schema is not data frame query');
    }

    const dataFrameInputJson = inputLlmNode.llmOutputJson;

    // TODO
    // 1 read csv into polars dataframe
    // 2 query against json

    const dataFrameOutputText = ''; // TODO

    await this.prisma.mapNode.update({
      where: { id: nodeId },
      data: {
        dataFrameOutputText,
      },
    });
  }
}
