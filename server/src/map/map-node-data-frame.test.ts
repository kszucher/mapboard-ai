import * as pl from 'nodejs-polars';
import { PrismaClient } from '../generated/client';
import { MapNodeDataFrameService } from './map-node-data-frame.service';
import { DataFrameQuerySchemaType } from './map-node-data-frame.types';

const prisma = {} as unknown as PrismaClient;
const getMapNodeService = jest.fn();
const getMapNodeFileService = jest.fn();

const service = new MapNodeDataFrameService(prisma, getMapNodeService, getMapNodeFileService);

const buildPolarsQuerySimple = service['buildPolarsQuerySimple'].bind(service);

describe('buildPolarsQuerySimple', () => {
  let df: pl.DataFrame;

  beforeEach(() => {
    df = pl.DataFrame({
      id: [1, 2, 3, 4],
      category: ['A', 'A', 'B', 'B'],
      value: [10, 20, 30, 40],
    });
  });

  it('selects only specified columns', () => {
    const schema: DataFrameQuerySchemaType = {
      columns: ['id'],
    } as any;

    const result = buildPolarsQuerySimple(df, schema);
    expect(result.columns).toEqual(['id']);
  });

  it('filters rows with operator =', () => {
    const schema: DataFrameQuerySchemaType = {
      columns: ['id', 'value'],
      filterColumn: 'id',
      filterOperator: '=',
      filterValue: 2,
    } as any;

    const result = buildPolarsQuerySimple(df, schema);
    expect(result.shape.height).toBe(1);
    expect(result.getColumn('id').toArray()).toEqual([2]);
  });

  it('applies groupBy with sum aggregation', () => {
    const schema: DataFrameQuerySchemaType = {
      columns: ['category', 'value'],
      groupBy: ['category'],
      aggregationColumn: 'value',
      aggregationOperation: 'sum',
    } as any;

    const result = buildPolarsQuerySimple(df, schema);
    const obj = result.sort('category').toObject();
    expect(obj.category).toEqual(['A', 'B']);
    expect(obj.value).toEqual([30, 70]);
  });

  it('sorts rows by column desc', () => {
    const schema: DataFrameQuerySchemaType = {
      columns: ['id', 'value'],
      sortColumn: 'value',
      sortDirection: 'desc',
    } as any;

    const result = buildPolarsQuerySimple(df, schema);
    expect(result.getColumn('value').toArray()).toEqual([40, 30, 20, 10]);
  });

  it('limits rows', () => {
    const schema: DataFrameQuerySchemaType = {
      columns: ['id'],
      limit: 2,
    } as any;

    const result = buildPolarsQuerySimple(df, schema);
    expect(result.shape.height).toBe(2);
  });

  it('throws on unsupported filter operator', () => {
    const schema: DataFrameQuerySchemaType = {
      columns: ['id'],
      filterColumn: 'id',
      filterOperator: 'unsupported',
      filterValue: 1,
    } as any;

    expect(() => buildPolarsQuerySimple(df, schema)).toThrow('Unsupported operator');
  });

  it('throws on unsupported aggregation', () => {
    const schema: DataFrameQuerySchemaType = {
      columns: ['id'],
      groupBy: ['id'],
      aggregationColumn: 'value',
      aggregationOperation: 'median',
    } as any;

    expect(() => buildPolarsQuerySimple(df, schema)).toThrow('Unsupported aggregation');
  });

  it('selects full_name where goals_overall = 22 and limits to 5', () => {
    const schema: DataFrameQuerySchemaType = {
      limit: 5,
      columns: ['full_name'],
      groupBy: null,
      sortColumn: null,
      filterValue: '22',
      filterColumn: 'goals_overall',
      sortDirection: null,
      filterOperator: '=',
      aggregationColumn: null,
      aggregationOperation: null,
    } as any;

    // input data
    const df = pl.DataFrame({
      full_name: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'],
      goals_overall: [10, 22, 22, 5, 22, 22],
    });

    const result = buildPolarsQuerySimple(df, schema);
    const obj = result.toObject();

    // Should return only rows where goals_overall == 22
    expect(obj.full_name).toEqual(['Bob', 'Charlie', 'Eve', 'Frank'].slice(0, 5));
    expect(obj.full_name.length).toBeLessThanOrEqual(5);
  });
});
