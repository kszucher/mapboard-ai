import {mapDeInit} from "../reducers/MapDeInit"
import {mapInit} from "../reducers/MapInit"
import {M, MPartial} from "../state/MapStateTypes"
import {rToCb, sortNode} from "./MapSelector"

const testFlow = (fun: Function, test: MPartial, result: MPartial) => {
  mapInit(test)
  return expect(mapDeInit(fun(test) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
}

describe("Selector_tests", () => {
  test('rToCb', () => testFlow(rToCb, [
    {nodeId: 'a', path: ['g']},
    {nodeId: 'b', path: ['r', 0]},
    {nodeId: 'c', path: ['r', 0, 'd', 0]},
    {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
    {nodeId: 'e', path: ['r', 1]},
    {nodeId: 'f', path: ['r', 1, 'd', 0]},
    {nodeId: 'g', path: ['r', 1, 'd', 0, 's', 0]},
    {nodeId: 'h', path: ['r', 2], selected: 1},
    {nodeId: 'i', path: ['r', 2, 'd', 0]},
    {nodeId: 'j', path: ['r', 2, 'd', 0, 's', 0]},
    {nodeId: 'k', path: ['r', 3]},
    {nodeId: 'l', path: ['r', 3, 'd', 0]},
    {nodeId: 'm', path: ['r', 3, 'd', 0, 's', 0]},
    {nodeId: 'n', path: ['r', 4], selected: 2},
    {nodeId: 'o', path: ['r', 4, 'd', 0]},
    {nodeId: 'p', path: ['r', 4, 'd', 0, 's', 0]},
    {nodeId: 'q', path: ['r', 5]},
    {nodeId: 'r', path: ['r', 5, 'd', 0]},
    {nodeId: 's', path: ['r', 5, 'd', 0, 's', 0]},
  ] as MPartial, [
    {nodeId: 'h', path: ['r', 0], selected: 1},
    {nodeId: 'i', path: ['r', 0, 'd', 0]},
    {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0]},
    {nodeId: 'n', path: ['r', 1], selected: 2},
    {nodeId: 'o', path: ['r', 1, 'd', 0]},
    {nodeId: 'p', path: ['r', 1, 'd', 0, 's', 0]},
  ] as MPartial))
})
