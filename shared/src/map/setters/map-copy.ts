import { isL } from '../getters/path-queries';
import { L, M } from '../state/map-types';

export const copyArrayWithReplacedIds = (originalArray: M, generateNodeId: Function): M => {
  const newArray: M = [];

  const idMapping: { [oldId: string]: string } = {};

  originalArray.forEach(node => {
    const oldId = node.nodeId;
    const newId = generateNodeId();
    idMapping[oldId] = newId;
    const newNode = { ...node, nodeId: newId };
    newArray.push(newNode);
  });

  newArray.forEach(node => {
    if (isL(node.path)) {
      const lNode = node as L;
      if (lNode.toNodeId) {
        lNode.toNodeId = idMapping[lNode.toNodeId];
      }
      if (lNode.fromNodeId) {
        lNode.fromNodeId = idMapping[lNode.fromNodeId];
      }
    }
  });

  return newArray;
};
