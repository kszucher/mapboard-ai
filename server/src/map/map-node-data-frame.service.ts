import * as pl from 'nodejs-polars';
import { LlmOutputSchema } from '../../../shared/src/map/state/map-consts-and-types';
import { PrismaClient } from '../generated/client';
import { DataFrameQuerySchemaType } from './map-node-data-frame.types';
import { MapNodeFileService } from './map-node-file.service';
import { MapNodeService } from './map-node.service';

export class MapNodeDataFrameService {
  constructor(
    private prisma: PrismaClient,
    private getMapNodeService: () => MapNodeService,
    private getMapNodeFileService: () => MapNodeFileService
  ) {}

  get mapNodeService(): MapNodeService {
    return this.getMapNodeService();
  }

  get mapNodeFileService(): MapNodeFileService {
    return this.getMapNodeFileService();
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

    if (!inputFileNode || !inputFileNode.fileHash) {
      throw new Error('no input file hash');
    }

    const buffer = await this.mapNodeFileService.download(inputFileNode.fileHash);

    if (!buffer) {
      throw new Error('Failed to download file');
    }

    const df = pl.readCSV(buffer, {
      hasHeader: true,
      sep: ',',
    });

    const dataFrameInputJson = inputLlmNode.llmOutputJson;

    const result = this.buildPolarsQuery(df, dataFrameInputJson as DataFrameQuerySchemaType);

    const dataFrameOutputText = result.toString();

    await this.prisma.mapNode.update({
      where: { id: nodeId },
      data: {
        dataFrameOutputText,
      },
    });
  }

  private buildPolarsQuery(df: pl.DataFrame, schema: DataFrameQuerySchemaType): pl.DataFrame {
    let q = df;

    // Columns are required, so no need to check optional
    q = q.select(...schema.columns.map(c => pl.col(c)));

    // Apply filters if defined
    if (schema.filters?.length) {
      schema.filters.forEach(f => {
        let expr: pl.Expr;
        switch (f.operator) {
          case '=':
            expr = pl.col(f.column).eq(f.value);
            break;
          case '!=':
            expr = pl.col(f.column).neq(f.value);
            break;
          case '>':
            expr = pl.col(f.column).gt(f.value);
            break;
          case '<':
            expr = pl.col(f.column).lt(f.value);
            break;
          case '>=':
            expr = pl.col(f.column).gtEq(f.value);
            break;
          case '<=':
            expr = pl.col(f.column).ltEq(f.value);
            break;
          case 'contains':
            expr = pl.col(f.column).str.contains(f.value);
            break;
          case 'in':
            expr = pl.col(f.column).isIn(f.value);
            break;
          default:
            throw new Error(`Unsupported operator: ${f.operator}`);
        }
        q = q.filter(expr);
      });
    }

    // Group and aggregate if both defined
    if (schema.groupBy?.length && schema.aggregations?.length) {
      const aggExprs = schema.aggregations.map(a => {
        const col = pl.col(a.column);
        switch (a.operation) {
          case 'sum':
            return col.sum();
          case 'mean':
            return col.mean();
          case 'count':
            return col.count();
          case 'min':
            return col.min();
          case 'max':
            return col.max();
          default:
            throw new Error(`Unsupported aggregation: ${a.operation}`);
        }
      });
      q = q.groupBy(schema.groupBy).agg(...aggExprs);
    }

    // Sort if defined
    if (schema.sort) {
      q = q.sort(schema.sort.column, schema.sort.direction === 'desc');
    }

    // Limit if defined
    if (schema.limit != null) {
      q = q.head(schema.limit);
    }

    return q;
  }
}
