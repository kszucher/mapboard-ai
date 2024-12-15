import { idToL, mL, mR } from '../mapQueries/MapQueries.ts';
import { M, T } from '../mapState/MapStateTypes.ts';

const deleteTL = (m: M, tl: T[]) =>
  tl
    .map(x => m.findIndex(ti => ti === x))
    .sort((a, b) => b - a)
    .forEach(index => index !== -1 && m.splice(index, 1));

export const mapDelete = {
  L: (m: M, lNodeId: string) => {
    deleteTL(m, [idToL(m, lNodeId)]);
  },

  LR: (m: M) => {
    const selectedRL = mR(m).filter(ri => ri.selected);
    const nonSelectedRL = mR(m).filter(ri => !ri.selected);
    const selectedL = mL(m).filter(li =>
      selectedRL.map(ri => ri.nodeId).some(id => li.fromNodeId === id || li.toNodeId === id)
    );
    const nonSelectedL = mL(m).filter(li =>
      selectedRL.map(ri => ri.nodeId).every(id => li.fromNodeId !== id && li.toNodeId !== id)
    );
    const rMap = new Map(nonSelectedRL.map((ri, i) => [ri.path.at(1), i]));
    nonSelectedRL.map(ti => (ti.path[1] = <number>rMap.get(ti.path[1])));
    const nonSelectedMinOffsetW = Math.min(...nonSelectedRL.map(ri => ri.offsetW));
    const nonSelectedMinOffsetH = Math.min(...nonSelectedRL.map(ri => ri.offsetH));
    nonSelectedRL.map(ri => {
      ri.offsetW -= nonSelectedMinOffsetW;
      ri.offsetH -= nonSelectedMinOffsetH;
    });
    nonSelectedL.map((li, i) => (li.path[1] = i));
    deleteTL(m, selectedRL);
    deleteTL(m, selectedL);
  },
};
