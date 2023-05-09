import {setIsTesting} from "../core/Utils"
import {mapReducerAtomic} from "../map/MapReducer"
import {M} from "../state/MapPropTypes"

const insertSDTest = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 3]},
] as M

const insertSDResult = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 'z', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 3]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 4]},
] as M

const insertSUTest = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 3]},
] as M

const insertSUResult = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 'z', path: ['r', 0, 'd', 0, 's', 0, 's', 3]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 4]},
] as M

const insertSORTest = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
] as M

const insertSORResult = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 'z', path: ['r', 0, 'd', 0, 's', 1]},
] as M

const insertSOTest = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
] as M

const insertSOResult = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 'z', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
] as M

const insertCRDTest = [
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

const insertCRDResult = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'zc0', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'zcs0', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'zc1', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'zcs1', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1, 's', 0]},
] as M

const insertCRUTest = [
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

const insertCRUResult = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'zc0', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'zcs0', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'zc1', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'zcs1', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1, 's', 0]},
] as M

const insertCCRTest = [
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

const insertCCRResult = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'zc0', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'zcs0', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'zc1', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'zcs1', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2, 's', 0]},
] as M

const insertCCLTest = [
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

const insertCCLResult = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'zc0', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'zcs0', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'zc1', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'zcs1', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2, 's', 0]},
] as M

const insertSORTableTest = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 1, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
] as M

const insertSORTableResult = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'z', path: ['r', 0, 'd', 0, 's', 1]},
  {selected: 0, selection: 's', nodeId: 'zc0', path: ['r', 0, 'd', 0, 's', 1, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'zcs0', path: ['r', 0, 'd', 0, 's', 1, 'c', 0, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'zc1', path: ['r', 0, 'd', 0, 's', 1, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'zcs1', path: ['r', 0, 'd', 0, 's', 1, 'c', 0, 1, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'zc2', path: ['r', 0, 'd', 0, 's', 1, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'zcs2', path: ['r', 0, 'd', 0, 's', 1, 'c', 1, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'zc3', path: ['r', 0, 'd', 0, 's', 1, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'zcs3', path: ['r', 0, 'd', 0, 's', 1, 'c', 1, 1, 's', 0]},
] as M

describe("InsertTests", () => {
  beforeEach(() => setIsTesting())
  test('insertSD', () => {mapReducerAtomic(insertSDTest, 'insertSD', {}); expect(insertSDTest).toEqual(insertSDResult)})
  test('insertSU', () => {mapReducerAtomic(insertSUTest, 'insertSU', {}); expect(insertSUTest).toEqual(insertSUResult)})
  test('insertSOR', () => {mapReducerAtomic(insertSORTest, 'insertSOR', {}); expect(insertSORTest).toEqual(insertSORResult)})
  test('insertSO', () => {mapReducerAtomic(insertSOTest, 'insertSO', {}); expect(insertSOTest).toEqual(insertSOResult)})
  test('insertCRD', () => {mapReducerAtomic(insertCRDTest, 'insertCRD', {}); expect(insertCRDTest).toEqual(insertCRDResult)})
  test('insertCRU', () => {mapReducerAtomic(insertCRUTest, 'insertCRU', {}); expect(insertCRUTest).toEqual(insertCRUResult)})
  test('insertCCR', () => {mapReducerAtomic(insertCCRTest, 'insertCCR', {}); expect(insertCCRTest).toEqual(insertCCRResult)})
  test('insertCCL', () => {mapReducerAtomic(insertCCLTest, 'insertCCL', {}); expect(insertCCLTest).toEqual(insertCCLResult)})
  test('insertSORTable', () => {mapReducerAtomic(insertSORTableTest, 'insertSORTable', {rowLen: 2, colLen: 2}); expect(insertSORTableTest).toEqual(insertSORTableResult)})

})
