import {mapReducerAtomic} from "../core/MapReducer"
import {sortNode} from "../core/MapUtils"
import {setIsTesting} from "../core/Utils"
import {M} from "../state/MapStateTypes"

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

const moveCRD_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
] as M

const moveCRD_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
] as M

const moveCRU_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
] as M

const moveCRU_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
] as M

const moveCCR_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
] as M

const moveCCR_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
] as M

const moveCCL_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
] as M

const moveCCL_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
] as M

const moveS2TOR_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 1, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 1]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 2]},
] as M

const moveS2TOR_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 1, selection: 's', nodeId: 't', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'w', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0, 's', 0]},
] as M

const moveS2TO_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 1, selection: 'f', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
] as M

const moveS2TO_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 't', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'w', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 'c', 2, 0]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 'c', 2, 0, 's', 0]},
] as M

const transpose_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 1, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'm', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'n', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'o', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2]},
  {selected: 0, selection: 's', nodeId: 'p', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2, 's', 0]},
] as M

const transpose_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 1, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'm', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'n', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'o', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1]},
  {selected: 0, selection: 's', nodeId: 'p', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1, 's', 0]},
] as M

describe("Move_tests", () => {
  beforeEach(() => setIsTesting())
  test('moveSD', () => {mapReducerAtomic(moveSD_test, 'moveSD', {}); expect(moveSD_test).toEqual(moveSD_result)})
  test('moveST', () => {mapReducerAtomic(moveST_test, 'moveST', {}); expect(moveST_test).toEqual(moveST_result)})
  test('moveSU', () => {mapReducerAtomic(moveSU_test, 'moveSU', {}); expect(moveSU_test).toEqual(moveSU_result)})
  test('moveSB', () => {mapReducerAtomic(moveSB_test, 'moveSB', {}); expect(moveSB_test).toEqual(moveSB_result)})
  test('moveSO', () => {mapReducerAtomic(moveSO_test, 'moveSO', {}); expect(moveSO_test).toEqual(moveSO_result)})
  test('moveSI', () => {mapReducerAtomic(moveSI_test, 'moveSI', {}); expect(moveSI_test).toEqual(moveSI_result)})
  test('moveSIR', () => {mapReducerAtomic(moveSIR_test, 'moveSIR', {}); expect(moveSIR_test).toEqual(moveSIR_result)})
  test('moveSIL', () => {mapReducerAtomic(moveSIL_test, 'moveSIL', {}); expect(moveSIL_test).toEqual(moveSIL_result)})
  test('moveCRD', () => {mapReducerAtomic(moveCRD_test, 'moveCRD', {}); expect(moveCRD_test).toEqual(moveCRD_result)})
  test('moveCRU', () => {mapReducerAtomic(moveCRU_test, 'moveCRU', {}); expect(moveCRU_test).toEqual(moveCRU_result)})
  test('moveCCR', () => {mapReducerAtomic(moveCCR_test, 'moveCCR', {}); expect(moveCCR_test).toEqual(moveCCR_result)})
  test('moveCCL', () => {mapReducerAtomic(moveCCL_test, 'moveCCL', {}); expect(moveCCL_test).toEqual(moveCCL_result)})
  test('moveS2TOR', () => {mapReducerAtomic(moveS2TOR_test, 'moveS2TOR', {}); expect(moveS2TOR_test).toEqual(moveS2TOR_result)})
  test('moveS2TO', () => {mapReducerAtomic(moveS2TO_test, 'moveS2TO', {}); expect(moveS2TO_test).toEqual(moveS2TO_result)})
  test('transpose', () => {mapReducerAtomic(transpose_test, 'transpose', {}); expect(transpose_test.sort(sortNode)).toEqual(transpose_result.sort(sortNode))})
})
