import {setIsTesting} from "../core/Utils"
import {mapReducerAtomic} from "../core/MapReducer"
import {M} from "../state/MapPropTypes"

const insertSD_test = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 3]},
] as M

const insertSD_result = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 't', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 3]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 4]},
] as M

const insertSU_test = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 3]},
] as M

const insertSU_result = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 't', path: ['r', 0, 'd', 0, 's', 0, 's', 3]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 4]},
] as M

const insertSOR_test = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
] as M

const insertSOR_result = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 't', path: ['r', 0, 'd', 0, 's', 1]},
] as M

const insertSO_test = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
] as M

const insertSO_result = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 't', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
] as M

const insertCRD_test = [
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

const insertCRD_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 1, selection: 's', nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1, 's', 0]},
] as M

const insertCRU_test = [
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

const insertCRU_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 1, selection: 's', nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1, 's', 0]},
] as M

const insertCCR_test = [
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

const insertCCR_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2, 's', 0]},
] as M

const insertCCL_test = [
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

const insertCCL_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2, 's', 0]},
] as M

const insertSCRD_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 1, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
] as M

const insertSCRD_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 1, selection: 's', nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0]},
  {selected: 1, selection: 's', nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1]},
] as M

const insertSCRU_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 1, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
] as M

const insertSCRU_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 1, selection: 's', nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1]},
] as M

const insertSCCR_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 1, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
] as M

const insertSCCR_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 1, selection: 's', nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 1, selection: 's', nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2]},
] as M

const insertSCCL_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 1, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
] as M

const insertSCCL_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2]},
  {selected: 1, selection: 's', nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2]},
] as M

const insertSORTable_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 1, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
] as M

const insertSORTable_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 't', path: ['r', 0, 'd', 0, 's', 1]},
  {selected: 0, selection: 's', nodeId: 'u', path: ['r', 0, 'd', 0, 's', 1, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'v', path: ['r', 0, 'd', 0, 's', 1, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'w', path: ['r', 0, 'd', 0, 's', 1, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'x', path: ['r', 0, 'd', 0, 's', 1, 'c', 1, 1]},
] as M

describe("InsertTests", () => {
  beforeEach(() => setIsTesting())
  test('insertSD', () => {mapReducerAtomic(insertSD_test, 'insertSD', {}); expect(insertSD_test).toEqual(insertSD_result)})
  test('insertSU', () => {mapReducerAtomic(insertSU_test, 'insertSU', {}); expect(insertSU_test).toEqual(insertSU_result)})
  test('insertSOR', () => {mapReducerAtomic(insertSOR_test, 'insertSOR', {}); expect(insertSOR_test).toEqual(insertSOR_result)})
  test('insertSO', () => {mapReducerAtomic(insertSO_test, 'insertSO', {}); expect(insertSO_test).toEqual(insertSO_result)})
  test('insertCRD', () => {mapReducerAtomic(insertCRD_test, 'insertCRD', {}); expect(insertCRD_test).toEqual(insertCRD_result)})
  test('insertCRU', () => {mapReducerAtomic(insertCRU_test, 'insertCRU', {}); expect(insertCRU_test).toEqual(insertCRU_result)})
  test('insertCCR', () => {mapReducerAtomic(insertCCR_test, 'insertCCR', {}); expect(insertCCR_test).toEqual(insertCCR_result)})
  test('insertCCL', () => {mapReducerAtomic(insertCCL_test, 'insertCCL', {}); expect(insertCCL_test).toEqual(insertCCL_result)})
  test('insertSCRD', () => {mapReducerAtomic(insertSCRD_test, 'insertSCRD', {}); expect(insertSCRD_test).toEqual(insertSCRD_result)})
  test('insertSCRU', () => {mapReducerAtomic(insertSCRU_test, 'insertSCRU', {}); expect(insertSCRU_test).toEqual(insertSCRU_result)})
  test('insertSCCR', () => {mapReducerAtomic(insertSCCR_test, 'insertSCCR', {}); expect(insertSCCR_test).toEqual(insertSCCR_result)})
  test('insertSCCL', () => {mapReducerAtomic(insertSCCL_test, 'insertSCCL', {}); expect(insertSCCL_test).toEqual(insertSCCL_result)})
  test('insertSORTable', () => {mapReducerAtomic(insertSORTable_test, 'insertSORTable', {rowLen: 2, colLen: 2}); expect(insertSORTable_test).toEqual(insertSORTable_result)})
})
