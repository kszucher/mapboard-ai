import { injectable } from 'tsyringe';
import { $Enums, PrismaClient } from '../generated/client';
import Color = $Enums.Color;

const MapNodeType = {
  FILE: 'FILE',
  INGESTION: 'INGESTION',
  CONTEXT: 'CONTEXT',
  QUESTION: 'QUESTION',
  VECTOR_DATABASE: 'VECTOR_DATABASE',
  DATA_FRAME: 'DATA_FRAME',
  LLM: 'LLM',
  VISUALIZER: 'VISUALIZER',
} as const;

const { FILE, INGESTION, CONTEXT, QUESTION, VECTOR_DATABASE, DATA_FRAME, LLM, VISUALIZER } = MapNodeType;

@injectable()
export class MapNodeTypeService {
  constructor(private prisma: PrismaClient) {}

  async seed() {
    const nodes = [
      {
        type: FILE,
        w: 160,
        h: 90,
        color: Color.yellow,
        label: 'File Upload',
        targets: [INGESTION, DATA_FRAME],
        sources: [],
      },
      {
        type: INGESTION,
        w: 160,
        h: 90,
        color: Color.cyan,
        label: 'Ingestion',
        targets: [VECTOR_DATABASE],
        sources: [FILE],
      },
      {
        type: CONTEXT,
        w: 200,
        h: 160,
        color: Color.violet,
        label: 'Context',
        targets: [VECTOR_DATABASE, LLM],
        sources: [],
      },
      {
        type: QUESTION,
        w: 200,
        h: 200,
        color: Color.lime,
        label: 'Question',
        targets: [VECTOR_DATABASE, LLM],
        sources: [],
      },
      {
        type: VECTOR_DATABASE,
        w: 180,
        h: 60,
        color: Color.brown,
        label: 'Vector Database',
        targets: [LLM],
        sources: [INGESTION, CONTEXT, LLM],
      },
      {
        type: DATA_FRAME,
        w: 200,
        h: 100,
        color: Color.crimson,
        label: 'Data Frame',
        targets: [LLM, VISUALIZER],
        sources: [FILE, LLM],
      },
      {
        type: LLM,
        w: 200,
        h: 200,
        color: Color.jade,
        label: 'LLM',
        targets: [LLM, VECTOR_DATABASE, DATA_FRAME, VISUALIZER],
        sources: [LLM, VECTOR_DATABASE, DATA_FRAME, CONTEXT, QUESTION],
      },
      {
        type: VISUALIZER,
        w: 200,
        h: 160,
        color: Color.lime,
        label: 'Visualizer',
        targets: [],
        sources: [LLM, DATA_FRAME],
      },
    ];

    await Promise.all(
      nodes.map(node =>
        this.prisma.mapNodeType.upsert({
          where: { type: node.type },
          update: { w: node.w, h: node.h, color: node.color, label: node.label },
          create: { type: node.type, w: node.w, h: node.h, color: node.color, label: node.label },
        })
      )
    );

    await Promise.all(
      nodes.map(node =>
        this.prisma.mapNodeType.update({
          where: { type: node.type },
          data: {
            allowedTargetNodeTypes: { connect: node.targets.map(t => ({ type: t })) },
            allowedSourceNodeTypes: { connect: node.sources.map(s => ({ type: s })) },
          },
        })
      )
    );
  }
}
