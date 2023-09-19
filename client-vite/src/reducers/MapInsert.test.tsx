import {sortNode} from "../selectors/MapSelector"
import {setIsTesting} from "../utils/Utils"
import {M, MPartial} from "../state/MapStateTypes"
import {mapDeInit} from "./MapDeInit"
import {mapInit} from "./MapInit"
import {mapReducerAtomic} from "./MapReducer"

const testFlow = (test: MPartial, result: MPartial, type: string, payload: object) => {
  mapInit(test)
  mapReducerAtomic(test as M, type, payload)
  return expect(mapDeInit(test as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
}

describe("InsertTests", () => {
  // @ts-ignore
  beforeEach(() => setIsTesting())

  test('insertSD', () => testFlow([
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
    {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0], selected: 1},
    {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
    {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
    {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 3]},
  ] as MPartial, [
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
    {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
    {nodeId: 't', path: ['r', 0, 'd', 0, 's', 0, 's', 1], selected: 1},
    {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
    {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 3]},
    {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 4]},
  ] as MPartial, 'insertSD', {}))

  test('insertSU', () => testFlow([
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
    {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
    {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
    {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
    {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 3], selected: 1},
  ] as MPartial, [
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
    {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
    {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
    {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
    {nodeId: 't', path: ['r', 0, 'd', 0, 's', 0, 's', 3], selected: 1},
    {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 4]},
  ] as MPartial, 'insertSU', {}))

  test('insertSOR', () => testFlow([
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0], selected: 1},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  ] as MPartial, [
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
    {nodeId: 't', path: ['r', 0, 'd', 0, 's', 1], selected: 1},
  ] as MPartial, 'insertSOR', {}))

  test('insertSO', () => testFlow([
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
    {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  ] as MPartial, [
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
    {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
    {nodeId: 't', path: ['r', 0, 'd', 0, 's', 0, 's', 1], selected: 1},
  ] as MPartial, 'insertSO', {}))

  test('insertCRD', () => testFlow([
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
    {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0], selected: 1},
    {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
    {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1], selected: 1},
    {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
    {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
    {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
    {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
    {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
  ] as MPartial, [
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
    {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0], selected: 1},
    {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
    {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1], selected: 1},
    {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
    {nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
    {nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
    {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0]},
    {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0, 's', 0]},
    {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1]},
    {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1, 's', 0]},
  ] as MPartial, 'insertCRD', {}))

  test('insertCRU', () => testFlow([
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
    {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
    {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
    {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
    {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
    {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0], selected: 1},
    {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
    {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1], selected: 1},
    {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
  ] as MPartial, [
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
    {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
    {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
    {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
    {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
    {nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
    {nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
    {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0], selected: 1},
    {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0, 's', 0]},
    {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1], selected: 1},
    {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1, 's', 0]},
  ] as MPartial, 'insertCRU', {}))

  test('insertCCR', () => testFlow([
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
    {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0], selected: 1},
    {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
    {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
    {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
    {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0], selected: 1},
    {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
    {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
    {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
  ] as MPartial, [
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
    {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0], selected: 1},
    {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
    {nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
    {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2]},
    {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2, 's', 0]},
    {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0], selected: 1},
    {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
    {nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
    {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2]},
    {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2, 's', 0]},
  ] as MPartial, 'insertCCR', {}))

  test('insertCCL', () => testFlow([
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
    {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
    {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
    {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1], selected: 1},
    {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
    {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
    {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
    {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1], selected: 1},
    {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
  ] as MPartial, [
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
    {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
    {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
    {nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
    {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2], selected: 1},
    {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2, 's', 0]},
    {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
    {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
    {nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
    {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2], selected: 1},
    {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2, 's', 0]},
  ] as MPartial, 'insertCCL', {}))

  test('insertSCRD', () => testFlow([
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
    {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
    {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
    {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
    {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  ] as MPartial, [
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
    {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
    {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
    {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
    {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
    {nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0]},
    {nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1]},
  ] as MPartial, 'insertSCRD', {}))

  test('insertSCRU', () => testFlow([
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
    {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
    {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
    {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
    {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  ] as MPartial, [
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
    {nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
    {nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
    {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
    {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
    {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0]},
    {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1]},
  ] as MPartial, 'insertSCRU', {}))

  test('insertSCCR', () => testFlow([
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
    {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
    {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
    {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
    {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  ] as MPartial, [
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
    {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
    {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
    {nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2]},
    {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
    {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
    {nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2]},
  ] as MPartial, 'insertSCCR', {}))

  test('insertSCCL', () => testFlow([
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
    ] as MPartial, [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
      {nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2]},
      {nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2]},
    ] as MPartial , 'insertSCCL', {}))

  test('insertSORTable', () => testFlow([
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0], selected: 1},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  ] as MPartial, [
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
    {nodeId: 't', path: ['r', 0, 'd', 0, 's', 1], selected: 1},
    {nodeId: 'u', path: ['r', 0, 'd', 0, 's', 1, 'c', 0, 0]},
    {nodeId: 'v', path: ['r', 0, 'd', 0, 's', 1, 'c', 0, 1]},
    {nodeId: 'w', path: ['r', 0, 'd', 0, 's', 1, 'c', 1, 0]},
    {nodeId: 'x', path: ['r', 0, 'd', 0, 's', 1, 'c', 1, 1]},
  ] as MPartial, 'insertSORTable', {rowLen: 2, colLen: 2}))
})
