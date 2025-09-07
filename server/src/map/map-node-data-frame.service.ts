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

    const result = this.buildPolarsQuerySimple(df, dataFrameInputJson as DataFrameQuerySchemaType);

    const dataFrameOutputText = JSON.stringify(result.toObject());

    await this.prisma.mapNode.update({
      where: { id: nodeId },
      data: {
        dataFrameOutputText,
      },
    });
  }

  private buildPolarsQuerySimple(df: pl.DataFrame, schema: DataFrameQuerySchemaType): pl.DataFrame {
    let q = df;

    // columns required
    q = q.select(...schema.columns.map((c: string) => pl.col(c)));

    // filter
    if (schema.filterColumn && schema.filterOperator && schema.filterValue !== undefined) {
      let expr: pl.Expr;
      switch (schema.filterOperator) {
        case '=':
          expr = pl.col(schema.filterColumn).eq(schema.filterValue);
          break;
        case '!=':
          expr = pl.col(schema.filterColumn).neq(schema.filterValue);
          break;
        case '>':
          expr = pl.col(schema.filterColumn).gt(schema.filterValue);
          break;
        case '<':
          expr = pl.col(schema.filterColumn).lt(schema.filterValue);
          break;
        case '>=':
          expr = pl.col(schema.filterColumn).gtEq(schema.filterValue);
          break;
        case '<=':
          expr = pl.col(schema.filterColumn).ltEq(schema.filterValue);
          break;
        case 'contains':
          expr = pl.col(schema.filterColumn).str.contains(schema.filterValue);
          break;
        case 'in':
          expr = pl.col(schema.filterColumn).isIn(schema.filterValue);
          break;
        default:
          throw new Error('Unsupported operator');
      }
      q = q.filter(expr);
    }

    // group + aggregate
    if (schema.groupBy?.length && schema.aggregationColumn && schema.aggregationOperation) {
      const col = pl.col(schema.aggregationColumn);
      let aggExpr: pl.Expr;
      switch (schema.aggregationOperation) {
        case 'sum':
          aggExpr = col.sum();
          break;
        case 'mean':
          aggExpr = col.mean();
          break;
        case 'count':
          aggExpr = col.count();
          break;
        case 'min':
          aggExpr = col.min();
          break;
        case 'max':
          aggExpr = col.max();
          break;
        default:
          throw new Error('Unsupported aggregation');
      }
      q = q.groupBy(schema.groupBy).agg(aggExpr);
    }

    // sort
    if (schema.sortColumn) {
      q = q.sort(schema.sortColumn, schema.sortDirection === 'desc');
    }

    // limit
    if (schema.limit != null) {
      q = q.head(schema.limit);
    }

    return q;
  }
}
