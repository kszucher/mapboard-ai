import {mapDeInit} from "../reducers/MapDeInit"
import {mapInit} from "../reducers/MapInit"
import {MPartial} from "../state/MapStateTypes"
import {sortNode} from "./MapQueries.ts"
import {lToCb, rToCb} from "../reducers/MapMove.ts"

describe("MapQueriesTests", () => {
  test('lToCb', () => {
    const test  = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'la', path: ['l', 0], fromNodeId: 'ta', toNodeId: 'tb'},
      {nodeId: 'lb', path: ['l', 1], fromNodeId: 'ta', toNodeId: 'tc'},
      {nodeId: 'lc', path: ['l', 2], fromNodeId: 'ta', toNodeId: 'td'},
      {nodeId: 'ld', path: ['l', 3], fromNodeId: 'tc', toNodeId: 'td'},
      {nodeId: 'le', path: ['l', 4], fromNodeId: 'tc', toNodeId: 'te'},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 1]},
      {nodeId: 'tc', path: ['r', 2], selected: 1},
      {nodeId: 'td', path: ['r', 3], selected: 2},
      {nodeId: 'te', path: ['r', 4], selected: 3},
    ] as MPartial
    const result = [
      {nodeId: 'ld', path: ['l', 0], fromNodeId: 'tc', toNodeId: 'td'},
      {nodeId: 'le', path: ['l', 1], fromNodeId: 'tc', toNodeId: 'te'},
    ] as MPartial
    expect(mapDeInit(lToCb(mapInit(test))).sort(sortNode)).toEqual((result).sort(sortNode))
  })
  test('rToCb', () => {
      const test = [
        {nodeId: 'ga', path: ['g']},
        {nodeId: 'ta', path: ['r', 0]},
        {nodeId: 'tb', path: ['r', 0, 's', 0]},
        {nodeId: 'tc', path: ['r', 1]},
        {nodeId: 'td', path: ['r', 1, 's', 0]},
        {nodeId: 'te', path: ['r', 2], selected: 1},
        {nodeId: 'tf', path: ['r', 2, 's', 0]},
        {nodeId: 'tg', path: ['r', 3]},
        {nodeId: 'th', path: ['r', 3, 's', 0]},
        {nodeId: 'ti', path: ['r', 4], selected: 2},
        {nodeId: 'tj', path: ['r', 4, 's', 0]},
        {nodeId: 'tk', path: ['r', 5]},
        {nodeId: 'tl', path: ['r', 5, 's', 0]},
      ] as MPartial
      const result = [
        {nodeId: 'te', path: ['r', 0], selected: 1},
        {nodeId: 'tf', path: ['r', 0, 's', 0]},
        {nodeId: 'ti', path: ['r', 1], selected: 2},
        {nodeId: 'tj', path: ['r', 1, 's', 0]},
      ] as MPartial
      expect(mapDeInit(rToCb(mapInit(test))).sort(sortNode)).toEqual((result).sort(sortNode))
    }
  )
})
