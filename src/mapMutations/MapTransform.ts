import { lrToClipboard } from '../mapQueries/MapExtract.ts';
import { mapPrune } from '../mapQueries/MapPrune.ts';
import { getG, getLastIndexL, getLastIndexR, mL, mR } from '../mapQueries/MapQueries.ts';
import { rSaveOptional } from '../mapState/MapState.ts';
import { M } from '../mapState/MapStateTypes.ts';
import { genId } from '../utils/Utils';
import { mapUnselect } from './MapSelect';
import { sortPath } from './MapSort.ts';

const formatCb = (m: M) => '[\n' + m.map(e => '  ' + JSON.stringify(e)).join(',\n') + '\n]';

const cbSave = (cb: M) => {
  navigator.permissions.query(<PermissionDescriptor>(<unknown>{ name: 'clipboard-write' })).then(result => {
    if (result.state === 'granted' || result.state === 'prompt') {
      navigator.clipboard
        .writeText(formatCb(cb))
        .then(() => {
          console.log('moved to clipboard');
        })
        .catch(err => {
          console.error('move to clipboard error: ', err);
        });
    }
  });
};

const clipboardToLR = (m: M, cb: M) => {
  const lastIndexL = getLastIndexL(m);
  const lastIndexR = getLastIndexR(m);
  const nodeIdMappingR = new Map<string, string>(mR(cb).map(ri => [ri.nodeId, genId()]));
  const nodeIdMappingRIterator = nodeIdMappingR[Symbol.iterator]();
  mL(cb).forEach(li =>
    Object.assign(li, {
      nodeId: genId(),
      path: ['l', li.path[1] + lastIndexL + 1],
      fromNodeId: nodeIdMappingR.get(li.fromNodeId),
      toNodeId: nodeIdMappingR.get(li.toNodeId),
    })
  );
  mR(cb).forEach(ri =>
    Object.assign(ri, {
      nodeId: nodeIdMappingRIterator.next().value![1],
      path: ['r', ri.path[1] + lastIndexR + 1],
      offsetW: (ri.offsetW ?? rSaveOptional.offsetW) + getG(m).selfW,
      offsetH: (ri.offsetH ?? rSaveOptional.offsetH) + getG(m).selfH,
    })
  );
  return cb;
};

export const mapTransform = {
  copyLR: (m: M) => {
    cbSave(mapPrune(lrToClipboard(m).sort(sortPath)));
  },

  pasteLR: (m: M, payload: string) => {
    const lr = JSON.parse(payload);
    mapUnselect.Nodes(m);
    m.push(...clipboardToLR(m, lr));
  },

  duplicateLR: (m: M) => {
    const lr = lrToClipboard(m);
    mapUnselect.Nodes(m);
    m.push(...clipboardToLR(m, lr));
  },
};
