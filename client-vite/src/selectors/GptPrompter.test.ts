import {M} from "../state/MapStateTypes"
import {genPromptJsonS, genPromptJsonT} from "./GptPrompter"

const genPromptJsonS_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 1, selection: 'f', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], note: 'n', content: 's0'},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0, 's', 0], note: 'n', content: 's0s0'},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 's', 0], content: 's0s0s0'},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 's', 1], content: 's0s0s1'},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 1], content: 's0s1'},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 2], content: 's0s2'},
] as M

const genPromptJsonS_result = [
  {keywords: ['s0', 's0s0', 's0s0s0'], suggestions: [], insertParentId: 'e'},
  {keywords: ['s0', 's0s0', 's0s0s1'], suggestions: [], insertParentId: 'f'},
  {keywords: ['s0', 's0s1'], suggestions: [], insertParentId: 'g'},
  {keywords: ['s0', 's0s2'], suggestions: [], insertParentId: 'h'}
]

const genPromptJsonT_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 1, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0], content: 'c00s0'},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0], content: 'c01s0'},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2, 's', 0], content: 'c02s0'},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0], content: 'c10s0'},
  {selected: 0, selection: 's', nodeId: 'm', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'n', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2]},
  {selected: 0, selection: 's', nodeId: 'o', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0]},
  {selected: 0, selection: 's', nodeId: 'p', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0, 's', 0], content: 'c20s0'},
  {selected: 0, selection: 's', nodeId: 'q', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1]},
  {selected: 0, selection: 's', nodeId: 'r', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 2]},
] as M

const genPromptJsonT_result = [
  {keywords: ['c00s0', 'c10s0', 'c01s0'], suggestions: [], insertParentId: 'm'},
  {keywords: ['c00s0', 'c10s0', 'c02s0'], suggestions: [], insertParentId: 'n'},
  {keywords: ['c00s0', 'c20s0', 'c01s0'], suggestions: [], insertParentId: 'q'},
  {keywords: ['c00s0', 'c20s0', 'c02s0'], suggestions: [], insertParentId: 'r'},
]

describe("GenPromptJsonTests", () => {
  test('genPromptJsonS_test', () => expect(genPromptJsonS(genPromptJsonS_test)).toEqual(genPromptJsonS_result))
  test('genPromptJsonT_test', () => expect(genPromptJsonT(genPromptJsonT_test)).toEqual(genPromptJsonT_result))
})
