import { current, PayloadAction } from '@reduxjs/toolkit';
import isEqual from 'react-fast-compare';
import { EditorState } from '../editorState/EditorStateTypes.ts';
import { getClosestR, getDR, getLR, getRR, getUR } from '../mapQueries/MapFindNearestR.ts';
import { mapPrune } from '../mapQueries/MapPrune.ts';
import { getAXR, getXR, idToR, mR, pathToR } from '../mapQueries/MapQueries.ts';
import { L, M, PR } from '../mapState/MapStateTypes.ts';
import { ControlType } from '../mapState/MapStateTypesEnums.ts';
import { mapBuild } from './MapBuild.ts';
import { mapDelete } from './MapDelete.ts';
import { mapInsert } from './MapInsert';
import { mapSelect, mapUnselect } from './MapSelect';
import { mapTransform } from './MapTransform.ts';

export const mapMutations = {
  selectR: (m: M, path: PR) => mapSelect.R(m, pathToR(m, path)),
  selectRAdd: (m: M, path: PR) => mapSelect.RAdd(m, pathToR(m, path)),
  selectR0: (m: M) => mapSelect.R(m, mR(m).at(0)!),
  selectRA: (m: M) => mapSelect.RL(m, mR(m)),
  selectRDR: (m: M) => mapSelect.R(m, getDR(m, getXR(m))!),
  selectRDRAdd: (m: M) => mapSelect.RAdd(m, getDR(m, getXR(m))!),
  selectRUR: (m: M) => mapSelect.R(m, getUR(m, getXR(m))!),
  selectRURAdd: (m: M) => mapSelect.RAdd(m, getUR(m, getXR(m))!),
  selectRRR: (m: M) => mapSelect.R(m, getRR(m, getXR(m))!),
  selectRRRAdd: (m: M) => mapSelect.RAdd(m, getRR(m, getXR(m))!),
  selectRLR: (m: M) => mapSelect.R(m, getLR(m, getXR(m))!),
  selectRLRAdd: (m: M) => mapSelect.RAdd(m, getLR(m, getXR(m))!),

  unselect: (m: M) => mapUnselect.Nodes(m),
  unselectR: (m: M, path: PR) => mapUnselect.R(pathToR(m, path)),

  insertL: (m: M, partialL: Partial<L>) => mapInsert.L(m, partialL),

  insertRR: (m: M) => mapInsert.RR(m),
  insertRL: (m: M) => mapInsert.RL(m),
  insertRD: (m: M) => mapInsert.RD(m),
  insertRU: (m: M) => mapInsert.RU(m),

  deleteL: (m: M, nodeId: string) => mapDelete.L(m, nodeId),

  deleteLR: (m: M) => {
    const reselect = getClosestR(m, getXR(m))!.nodeId;
    mapDelete.LR(m);
    mapSelect.R(m, idToR(m, reselect));
  },

  cutLRJumpR: (m: M) => {
    const reselect = mR(m).find(ri => !ri.selected)!.nodeId;
    mapTransform.copyLR(m);
    mapDelete.LR(m);
    mapSelect.R(m, idToR(m, reselect));
  },
  copyLR: (m: M) => mapTransform.copyLR(m),
  pasteLR: (m: M, mapAsString: string) => mapTransform.pasteLR(m, mapAsString),
  duplicateLR: (m: M) => mapTransform.duplicateLR(m),

  offsetD: (m: M) => getAXR(m).forEach(ri => (ri.offsetH += 20)),
  offsetU: (m: M) => getAXR(m).forEach(ri => (ri.offsetH -= 20)),
  offsetR: (m: M) => getAXR(m).forEach(ri => (ri.offsetW += 20)),
  offsetL: (m: M) => getAXR(m).forEach(ri => (ri.offsetW -= 20)),
  offsetRByDrag: (m: M, rOffsetCoords: number[]) =>
    Object.assign(getXR(m), {
      offsetW: rOffsetCoords[0],
      offsetH: rOffsetCoords[1],
    }),

  setControlTypeNone: (m: M) => Object.assign(getXR(m), { controlType: ControlType.NONE }),
  setControlTypeFile: (m: M) => Object.assign(getXR(m), { controlType: ControlType.FILE }),
  setControlTypeIngestion: (m: M) => Object.assign(getXR(m), { controlType: ControlType.INGESTION }),
  setControlTypeExtraction: (m: M) => Object.assign(getXR(m), { controlType: ControlType.EXTRACTION }),

  setIsProcessing: (m: M, { nodeId, value }: { nodeId: string; value: boolean }) =>
    (idToR(m, nodeId).isProcessing = value),

  setFileName: (m: M, { nodeId, fileName }: { nodeId: string; fileName: string }) =>
    (idToR(m, nodeId).fileName = fileName),
};

export function wrapFunction<P>(fn: (m: M, payload: P) => void) {
  return function (state: EditorState, action: PayloadAction<P>) {
    console.log(action.type);
    const pm = current(state.commitList[state.commitIndex]);
    const m = structuredClone(pm);
    fn(m, action.payload);
    mapBuild(m);
    if (!isEqual(mapPrune(pm), mapPrune(m))) {
      state.commitList = [...state.commitList.slice(0, state.commitIndex + 1), m];
      state.commitIndex = state.commitIndex + 1;
    }
    return;
  };
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const wrappedFunctions: {
  [K in keyof typeof mapMutations]: (
    state: EditorState,
    action: PayloadAction<Parameters<(typeof mapMutations)[K]>[1]>
  ) => void;
} = {} as unknown;

for (const fnName of Object.keys(mapMutations) as Array<keyof typeof mapMutations>) {
  const originalFunction = mapMutations[fnName];
  if (originalFunction) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    wrappedFunctions[fnName] = wrapFunction(originalFunction);
  }
}
