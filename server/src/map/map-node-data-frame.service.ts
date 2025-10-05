import * as pl from 'nodejs-polars';
import { injectable } from 'tsyringe';
import { LlmOutputSchema } from '../../../shared/src/api/api-types-map-node';
import { PrismaClient } from '../generated/client';
import { DataFrameQuerySchemaType } from './map-node-data-frame.types';
import { MapNodeFileService } from './map-node-file.service';
import { MapNodeRepository } from './map-node.repository';

@injectable()
export class MapNodeDataFrameService {
  constructor(
    private prisma: PrismaClient,
    private mapNodeService: MapNodeRepository,
    private mapNodeFileService: MapNodeFileService
  ) {}

  async execute({ workspaceId, mapId, nodeId }: { workspaceId: number; mapId: number; nodeId: number }) {
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

    const dataFrameOutputJson = {
      query: (inputLlmNode.llmOutputJson as { text: string }).text,
      result: JSON.parse(JSON.stringify(result.toObject(), (_, v) => (typeof v === 'bigint' ? v.toString() : v))),
    };

    await this.prisma.mapNode.update({
      where: { id: nodeId },
      data: { workspaceId, dataFrameOutputJson },
    });
  }

  private buildPolarsQuerySimple(df: pl.DataFrame, schema: DataFrameQuerySchemaType): pl.DataFrame {
    let q = df;

    // filter FIRST (before selecting columns)
    if (schema.filterColumn && schema.filterOperator && schema.filterValue !== undefined) {
      // Convert filterValue to appropriate type if it's a string number
      let filterValue = schema.filterValue;
      if (typeof filterValue === 'string' && !isNaN(Number(filterValue)) && schema.filterOperator !== 'contains') {
        filterValue = Number(filterValue);
      }

      let expr: pl.Expr;
      switch (schema.filterOperator) {
        case '=':
          expr = pl.col(schema.filterColumn).eq(filterValue);
          break;
        case '!=':
          expr = pl.col(schema.filterColumn).neq(filterValue);
          break;
        case '>':
          expr = pl.col(schema.filterColumn).gt(filterValue);
          break;
        case '<':
          expr = pl.col(schema.filterColumn).lt(filterValue);
          break;
        case '>=':
          expr = pl.col(schema.filterColumn).gtEq(filterValue);
          break;
        case '<=':
          expr = pl.col(schema.filterColumn).ltEq(filterValue);
          break;
        case 'contains':
          expr = pl.col(schema.filterColumn).str.contains(schema.filterValue);
          break;
        case 'in':
          expr = pl.col(schema.filterColumn).isIn(filterValue);
          break;
        default:
          throw new Error('Unsupported operator');
      }
      q = q.filter(expr);
    }

    // group + aggregate (before column selection if needed)
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

    // sort (before column selection if sort column isn't in selected columns)
    if (schema.sortColumn) {
      q = q.sort(schema.sortColumn, schema.sortDirection === 'desc');
    }

    // columns required (do this AFTER filtering, grouping, and sorting)
    // Include sort column temporarily if it's not in the selected columns
    let columnsToSelect = [...schema.columns];
    const needsSortColumn = schema.sortColumn && !schema.columns.includes(schema.sortColumn);
    if (needsSortColumn && schema.sortColumn) {
      columnsToSelect.push(schema.sortColumn);
    }

    q = q.select(...columnsToSelect.map((c: string) => pl.col(c)));

    // Remove the temporarily added sort column after sorting
    if (needsSortColumn) {
      q = q.select(...schema.columns.map((c: string) => pl.col(c)));
    }

    // limit
    if (schema.limit != null) {
      q = q.head(schema.limit);
    }

    return q;
  }
}
