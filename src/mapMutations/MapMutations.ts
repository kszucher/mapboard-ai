import {current, PayloadAction} from "@reduxjs/toolkit"
import isEqual from "react-fast-compare"
import {ControlType} from "../consts/Enums"
import {EditorState} from "../editorState/EditorStateTypes.ts"
import {getRD, getRL, getRR, getRU} from "../mapQueries/MapFindNearestR.ts"
import {mapPrune} from "../mapQueries/MapPrune.ts"
import {getXR, idToR, mR, pathToR} from "../mapQueries/MapQueries.ts"
import {L, M, PR, R} from "../mapState/MapStateTypes.ts"
import {mapBuild} from "./MapBuild.ts"
import {deleteL, deleteLR,} from "./MapDelete"
import {insertL, insertR} from "./MapInsert"
import {copyLRSC, duplicateLRSC, pasteLRSC} from "./MapMove"
import {selectAddR, selectR, selectRL, unselectNodes, unselectR} from "./MapSelect"

export const mapMutations = {
  selectR: (m: M, path: PR) => selectR(m, pathToR(m, path)),
  selectRR: (m: M) => selectR(m, getRR(m, getXR(m))!),
  selectRL: (m: M) => selectR(m, getRL(m, getXR(m))!),
  selectRD: (m: M) => selectR(m, getRD(m, getXR(m))!),
  selectRU: (m: M) => selectR(m, getRU(m, getXR(m))!),
  selectFirstR: (m: M) => selectR(m, mR(m).at(0)!),
  selectAddR: (m: M, path: PR) => selectAddR(m, pathToR(m, path)),
  selectRA: (m: M) => selectRL(m, mR(m)),
  unselect: (m: M) => unselectNodes(m),
  unselectR: (m: M, path: PR) => unselectR(pathToR(m, path)),

  insertL: (m: M, l: L) => insertL(m, l),
  insertR: (m: M) => insertR(m),

  deleteL: (m: M, nodeId: string) => deleteL(m, nodeId),
  deleteLRSC: (m: M) => {
    const reselect = mR(m).find(ri => !ri.selected)!.nodeId
    deleteLR(m)
    selectR(m, idToR(m, reselect ))
  },

  cutLRJumpR: (m: M) => {
    const reselect = mR(m).find(ri => !ri.selected)!.nodeId
    copyLRSC(m); deleteLR(m)
    selectR(m, idToR(m, reselect) as R)
  },
  copyLR: (m: M) => copyLRSC(m),
  pasteLR: (m: M, mapAsString: string) => pasteLRSC(m, mapAsString),
  duplicateR: (m: M) => duplicateLRSC(m),

  offsetD: (m: M) => Object.assign(getXR(m), { offsetH: getXR(m).offsetH += 20 }),
  offsetU: (m: M) => Object.assign(getXR(m), { offsetH: getXR(m).offsetH -= 20 }),
  offsetR: (m: M) => Object.assign(getXR(m), { offsetW: getXR(m).offsetW += 20 }),
  offsetL: (m: M) => Object.assign(getXR(m), { offsetW: getXR(m).offsetW -= 20 }),
  offsetRByDrag: (m: M, rOffsetCoords: number[]) => Object.assign(getXR(m), { offsetW: rOffsetCoords[0], offsetH: rOffsetCoords[1] }),
  setControlTypeNone: (m: M) => Object.assign(getXR(m), { controlType: ControlType.NONE }),
  setControlTypeIngestion: (m: M) => Object.assign(getXR(m), { controlType: ControlType.INGESTION }),
  setControlTypeExtraction: (m: M) => Object.assign(getXR(m), { controlType: ControlType.EXTRACTION }),
}

export function wrapFunction<P>(fn: (m: M, payload: P) => void) {
  return function (state: EditorState, action: PayloadAction<P>) {
    console.log(action.type)
    const pm = current(state.commitList[state.commitIndex])
    const m = structuredClone(pm)
    fn(m, action.payload)
    mapBuild(m)
    if (!isEqual(mapPrune(pm), mapPrune(m))) {
      state.commitList = [...state.commitList.slice(0, state.commitIndex + 1), m]
      state.commitIndex = state.commitIndex + 1
    }
    return
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const wrappedFunctions: {
  [K in keyof typeof mapMutations]: (state: EditorState, action: PayloadAction<Parameters<typeof mapMutations[K]>[1]>) => void
} = {} as unknown

for (const fnName of Object.keys(mapMutations) as Array<keyof typeof mapMutations>) {
  const originalFunction = mapMutations[fnName]
  if (originalFunction) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    wrappedFunctions[fnName] = wrapFunction(originalFunction)
  }
}
