import {M} from "../state/MapPropTypes"
import {moveSO, moveSI, moveSIR, moveSIL, moveSD, moveST, moveSU, moveSB} from "./MapMove"

const moveSO_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {selected: 1, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 1]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 1, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 1, 's', 1]},
  {selected: 1, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 2]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 2, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 2, 's', 1]},
] as M

const moveSO_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {selected: 1, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 2, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 's', 2, 's', 1]},
  {selected: 1, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 's', 3]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 's', 3, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 's', 3, 's', 1]},
] as M

const moveSI_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {selected: 1, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {selected: 2, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 3]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 's', 3, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 1]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 1, 's', 0]},
] as M

const moveSI_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {selected: 1, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 1]},
  {selected: 2, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 2]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 2, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 3]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 3, 's', 0]},
] as M

const moveSIR_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 1]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 1]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 1, 's', 0]},
] as M

const moveSIR_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 1]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 1, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 1, 's', 1]},
] as M

const moveSIL_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 1]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 1, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 1, 's', 1]},
] as M

const moveSIL_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 1]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 1]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 1, 's', 0]},
] as M

const moveSD_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 1]},
  {selected: 1, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 2]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 3]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 4]},
] as M

const moveSD_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 1]},
  {selected: 1, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 2]},
  {selected: 1, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 3]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 4]},
] as M

const moveST_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 1]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 2]},
  {selected: 1, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 3]},
  {selected: 1, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 4]},
] as M

const moveST_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 1, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 1]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 2]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 3]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 4]},
] as M

const moveSU_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 1]},
  {selected: 1, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 2]},
  {selected: 1, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 3]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 4]},
] as M

const moveSU_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 1]},
  {selected: 1, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 2]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 3]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 4]},
] as M

const moveSB_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 1, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 1]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 2]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 3]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 4]},
] as M

const moveSB_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 1]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 2]},
  {selected: 1, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 3]},
  {selected: 1, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 4]},
] as M


describe("Move_tests", () => {
  test('moveSO', () => {moveSO(moveSO_test); expect(moveSO_test).toEqual(moveSO_result)})
  test('moveSI', () => {moveSI(moveSI_test); expect(moveSI_test).toEqual(moveSI_result)})
  test('moveSIR', () => {moveSIR(moveSIR_test); expect(moveSIR_test).toEqual(moveSIR_result)})
  test('moveSIL', () => {moveSIL(moveSIL_test); expect(moveSIL_test).toEqual(moveSIL_result)})
  test('moveSD', () => {moveSD(moveSD_test); expect(moveSD_test).toEqual(moveSD_result)})
  test('moveST', () => {moveST(moveST_test); expect(moveST_test).toEqual(moveST_result)})
  test('moveSU', () => {moveSU(moveSU_test); expect(moveSU_test).toEqual(moveSU_result)})
  test('moveSN', () => {moveSB(moveSB_test); expect(moveSB_test).toEqual(moveSB_result)})
})
