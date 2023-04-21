import {M} from "../state/MapPropTypes"

const xm = [
  {selected: 0, nodeId: 'a', path: ['g']},
  {selected: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, nodeId: 'd', path: ['r', 0, 'd', 0]},
  {selected: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 's', 0]},
  {selected: 0, nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 's', 1]},
  {selected: 0, nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 's', 2]},
  {selected: 2, nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {selected: 0, nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 's', 1, 's', 0]},
  {selected: 0, nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 's', 1, 's', 1]},
  {selected: 0, nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 's', 1, 's', 2]},
  {selected: 0, nodeId: 'm', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {selected: 3, nodeId: 'n', path: ['r', 0, 'd', 0, 's', 0, 's', 2, 's', 0]},
  {selected: 4, nodeId: 'o', path: ['r', 0, 'd', 0, 's', 0, 's', 2, 's', 1]},
  {selected: 0, nodeId: 'p', path: ['r', 0, 'd', 0, 's', 0, 's', 2, 's', 2]},
] as M

const xmexpected = [
  {selected: 0, nodeId: 'a', path: ['g']},
  {selected: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 1, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, nodeId: 'm', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, nodeId: 'p', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 's', 0]},
] as M
