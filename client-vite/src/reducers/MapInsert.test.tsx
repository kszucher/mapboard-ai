import {setIsTesting, testFlow} from "../utils/Utils"
import {M} from "../state/MapStateTypes"

const insertSD_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0], selected: 1},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 3]},
] as M

const insertSD_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {nodeId: 't', path: ['r', 0, 'd', 0, 's', 0, 's', 1], selected: 1},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 3]},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 4]},
] as M

const insertSU_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 3], selected: 1},
] as M

const insertSU_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {nodeId: 't', path: ['r', 0, 'd', 0, 's', 0, 's', 3], selected: 1},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 4]},
] as M

const insertSOR_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0], selected: 1},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
] as M

const insertSOR_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 't', path: ['r', 0, 'd', 0, 's', 1], selected: 1},
] as M

const insertSO_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
] as M

const insertSO_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {nodeId: 't', path: ['r', 0, 'd', 0, 's', 0, 's', 1], selected: 1},
] as M

const insertCRD_test = [
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
] as M

const insertCRD_result = [
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
] as M

const insertCRU_test = [
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
] as M

const insertCRU_result = [
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
] as M

const insertCCR_test = [
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
] as M

const insertCCR_result = [
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
] as M

const insertCCL_test = [
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
] as M

const insertCCL_result = [
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
] as M

const insertSCRD_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
] as M

const insertSCRD_result = [
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
] as M

const insertSCRU_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
] as M

const insertSCRU_result = [
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
] as M

const insertSCCR_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
] as M

const insertSCCR_result = [
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
] as M

const insertSCCL_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
] as M

const insertSCCL_result = [
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
] as M

const insertSORTable_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0], selected: 1},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
] as M

const insertSORTable_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 't', path: ['r', 0, 'd', 0, 's', 1], selected: 1},
  {nodeId: 'u', path: ['r', 0, 'd', 0, 's', 1, 'c', 0, 0]},
  {nodeId: 'v', path: ['r', 0, 'd', 0, 's', 1, 'c', 0, 1]},
  {nodeId: 'w', path: ['r', 0, 'd', 0, 's', 1, 'c', 1, 0]},
  {nodeId: 'x', path: ['r', 0, 'd', 0, 's', 1, 'c', 1, 1]},
] as M

describe("InsertTests", () => {
  // @ts-ignore
  beforeEach(() => setIsTesting())
  test('insertSD', () => testFlow(insertSD_test, insertSD_result, 'insertSD', {}))
  test('insertSU', () => testFlow(insertSU_test, insertSU_result, 'insertSU', {}))
  test('insertSOR', () => testFlow(insertSOR_test, insertSOR_result, 'insertSOR', {}))
  test('insertSO', () => testFlow(insertSO_test, insertSO_result, 'insertSO', {}))
  test('insertCRD', () => testFlow(insertCRD_test, insertCRD_result, 'insertCRD', {}))
  test('insertCRU', () => testFlow(insertCRU_test, insertCRU_result, 'insertCRU', {}))
  test('insertCCR', () => testFlow(insertCCR_test, insertCCR_result, 'insertCCR', {}))
  test('insertCCL', () => testFlow(insertCCL_test, insertCCL_result, 'insertCCL', {}))
  test('insertSCRD', () => testFlow(insertSCRD_test, insertSCRD_result, 'insertSCRD', {}))
  test('insertSCRU', () => testFlow(insertSCRU_test, insertSCRU_result, 'insertSCRU', {}))
  test('insertSCCR', () => testFlow(insertSCCR_test, insertSCCR_result, 'insertSCCR', {}))
  test('insertSCCL', () => testFlow(insertSCCL_test, insertSCCL_result, 'insertSCCL', {}))
  test('insertSORTable', () => testFlow(insertSORTable_test, insertSORTable_result, 'insertSORTable', {rowLen: 2, colLen: 2}))
})
