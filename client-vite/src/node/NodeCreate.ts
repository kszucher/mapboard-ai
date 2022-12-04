import {getDefaultNode} from "../core/DefaultProps";
import { getMapData } from '../core/MapFlow'
import {Dir} from "../core/Types";

export const structCreate = (m: any, n: any, direction: Dir, payload: object ) => {
  let parentRef;
  if (direction === Dir.U) {
    parentRef = getMapData(m, n.parentPath);
    parentRef.s.splice(n.index, 0, getDefaultNode({
      selected: 1,
      taskStatus: parentRef.taskStatus > - 1 ?  0 : -1,
    }))
  } else if (direction === Dir.D) {
    parentRef = getMapData(m, n.parentPath);
    parentRef.s.splice(n.index + 1, 0, getDefaultNode({
      selected: 1,
      taskStatus: parentRef.taskStatus > - 1 ? 0 : -1,
    }));
  } else if (direction === Dir.O) {
    parentRef = n.isRoot? n.d[0] : n;
    parentRef.s.splice(parentRef.s.length, 0, getDefaultNode({
      selected: 1,
      taskStatus: parentRef.taskStatus,
      ...payload
    }))
  }
}
