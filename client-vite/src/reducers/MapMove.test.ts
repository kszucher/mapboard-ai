import {testFlow} from "../utils/Utils"
import {setIsTesting} from "../utils/Utils"
import {MPartial} from "../state/MapStateTypes"

const moveSD_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 1], selected: 1},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 1, 's', 0]},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 2], selected: 2},
  {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 2, 's', 0]},
  {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 3]},
  {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 3, 's', 0]},
  {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 4]},
  {nodeId: 'm', path: ['r', 0, 'd', 0, 's', 4, 's', 0]},
] as MPartial

const moveSD_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 1]},
  {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 1, 's', 0]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 2], selected: 1},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 2, 's', 0]},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 3], selected: 2},
  {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 3, 's', 0]},
  {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 4]},
  {nodeId: 'm', path: ['r', 0, 'd', 0, 's', 4, 's', 0]},
] as MPartial

const moveST_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 1]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 2]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 3], selected: 1},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 4], selected: 2},
] as MPartial

const moveST_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 1], selected: 2},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 2]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 3]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 4]},
] as MPartial

const moveSU_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 1]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 2], selected: 1},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 3], selected: 2},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 4]},
] as MPartial

const moveSU_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 1], selected: 1},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 2], selected: 2},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 3]},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 4]},
] as MPartial

const moveSB_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 1], selected: 2},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 2]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 3]},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 4]},
] as MPartial

const moveSB_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 1]},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 2]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 3], selected: 1},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 4], selected: 2},
] as MPartial

const moveSO_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 1], selected: 1},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 1, 's', 0]},
  {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 1, 's', 1]},
  {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 2], selected: 2},
  {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 2, 's', 0]},
  {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 2, 's', 1]},
] as MPartial

const moveSO_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2], selected: 1},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 2, 's', 0]},
  {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 's', 2, 's', 1]},
  {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 's', 3], selected: 2},
  {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 's', 3, 's', 0]},
  {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 's', 3, 's', 1]},
] as MPartial

const moveSI_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2], selected: 1},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 3], selected: 2},
  {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 's', 3, 's', 0]},
  {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 1]},
  {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 1, 's', 0]},
] as MPartial

const moveSI_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 1], selected: 1},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 2], selected: 2},
  {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 2, 's', 0]},
  {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 3]},
  {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 3, 's', 0]},
] as MPartial

const moveSIR_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 1], selected: 1},
  {nodeId: 'f', path: ['r', 0, 'd', 1]},
  {nodeId: 'g', path: ['r', 0, 'd', 1, 's', 0]},
] as MPartial

const moveSIR_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'f', path: ['r', 0, 'd', 1]},
  {nodeId: 'g', path: ['r', 0, 'd', 1, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 1, 's', 1], selected: 1},
] as MPartial

const moveSIL_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 1]},
  {nodeId: 'f', path: ['r', 0, 'd', 1, 's', 0]},
  {nodeId: 'g', path: ['r', 0, 'd', 1, 's', 1], selected: 1},
] as MPartial

const moveSIL_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 1], selected: 1},
  {nodeId: 'e', path: ['r', 0, 'd', 1]},
  {nodeId: 'f', path: ['r', 0, 'd', 1, 's', 0]},
] as MPartial

const moveCRD_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0], selected: 1},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1], selected: 2},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
] as MPartial

const moveCRD_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0], selected: 1},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1], selected: 2},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
] as MPartial

const moveCRU_test = [
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
  {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1], selected: 2},
  {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
] as MPartial

const moveCRU_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0], selected: 1},
  {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1], selected: 2},
  {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
] as MPartial

const moveCCR_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0], selected: 1},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0], selected: 2},
  {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
] as MPartial

const moveCCR_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1], selected: 1},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1], selected: 2},
  {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
] as MPartial

const moveCCL_test = [
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
  {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1], selected: 2},
  {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
] as MPartial

const moveCCL_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0], selected: 1},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0], selected: 2},
  {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
] as MPartial

const moveS2TOR_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0], selected: 1},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 1]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 2]},
] as MPartial

const moveS2TOR_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 't', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
  {nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {nodeId: 'w', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0, 's', 0]},
] as MPartial

const moveS2TO_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1, selection: 'f'},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
] as MPartial

const moveS2TO_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 't', path: ['r', 0, 'd', 0, 's', 0, 's', 0], selected: 1},
  {nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 'c', 0, 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 'c', 1, 0]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {nodeId: 'w', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 'c', 2, 0]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 'c', 2, 0, 's', 0]},
] as MPartial

const transpose_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2]},
  {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2, 's', 0]},
  {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {nodeId: 'm', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {nodeId: 'n', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
  {nodeId: 'o', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2]},
  {nodeId: 'p', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2, 's', 0]},
] as MPartial

const transpose_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {nodeId: 'm', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {nodeId: 'n', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
  {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0]},
  {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0, 's', 0]},
  {nodeId: 'o', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1]},
  {nodeId: 'p', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1, 's', 0]},
] as MPartial

describe("Move_tests", () => {
  // @ts-ignore
  beforeEach(() => setIsTesting())
  test('moveSD', () => testFlow(moveSD_test, moveSD_result, 'moveSD', {}))
  test('moveST', () => testFlow(moveST_test, moveST_result,'moveST', {}))
  test('moveSU', () => testFlow(moveSU_test, moveSU_result,'moveSU', {}))
  test('moveSB', () => testFlow(moveSB_test, moveSB_result,'moveSB', {}))
  test('moveSO', () => testFlow(moveSO_test, moveSO_result,'moveSO', {}))
  test('moveSI', () => testFlow(moveSI_test, moveSI_result,'moveSI', {}))
  test('moveSIR', () => testFlow(moveSIR_test, moveSIR_result, 'moveSIR', {}))
  test('moveSIL', () => testFlow(moveSIL_test, moveSIL_result, 'moveSIL', {}))
  test('moveCRD', () => testFlow(moveCRD_test, moveCRD_result, 'moveCRD', {}))
  test('moveCRU', () => testFlow(moveCRU_test, moveCRU_result, 'moveCRU', {}))
  test('moveCCR', () => testFlow(moveCCR_test, moveCCR_result, 'moveCCR', {}))
  test('moveCCL', () => testFlow(moveCCL_test, moveCCL_result, 'moveCCL', {}));
  test('moveS2TOR', () => testFlow(moveS2TOR_test, moveS2TOR_result, 'moveS2TOR', {}))
  test('moveS2TO', () => testFlow(moveS2TO_test, moveS2TO_result, 'moveS2TO', {}))
  test('transpose', () => testFlow(transpose_test, transpose_result, 'transpose', {}))
})
