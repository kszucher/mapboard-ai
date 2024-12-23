import { G, L, M, N, R } from '../mapState/MapStateTypes.ts';
import { excludeEntries } from '../utils/Utils';
import { isG, isL, isR } from './PathQueries.ts';

export const mapArrayToObject = (m: M): object =>
  Object.fromEntries(m.map(n => [n.nodeId, excludeEntries(n, ['nodeId'])]));

export const mapObjectToArray = (obj: object): M => Object.entries(obj).map(el => ({ nodeId: el[0], ...el[1] }) as N);

export const mG = (m: M): G[] => <G[]>m.filter(n => isG(n.path));

export const mL = (m: M): L[] => <L[]>m.filter(n => isL(n.path));

export const mR = (m: M): R[] => <R[]>m.filter(n => isR(n.path));

export const idToL = (m: M, nodeId: string) => <L>mL(m).find(li => li.nodeId === nodeId);

export const idToR = (m: M, nodeId: string) => <R>mR(m).find(ri => ri.nodeId === nodeId);

export const getG = (m: M): G => <G>mG(m).at(0);

export const getLastIndexL = (m: M): number => Math.max(-1, ...mL(m).map(li => <number>li.path.at(-1)));

export const getLastIndexR = (m: M): number => Math.max(-1, ...mR(m).map(ri => <number>ri.path.at(-1)));

export const isExistingLink = (m: M, partialL: Partial<L>): boolean =>
  mL(m).some(
    li =>
      partialL.fromNodeId === li.fromNodeId &&
      partialL.toNodeId === li.toNodeId &&
      partialL.fromNodeSide === li.fromNodeSide &&
      partialL.toNodeSide === li.toNodeSide
  );

export const getInputNode = (m: M, nodeId: string) => {
  const inputLink = mL(m).find(li => li.toNodeId === nodeId);
  if (!inputLink) return null;
  const inputNode = mR(m).find(ri => ri.nodeId === inputLink.fromNodeId);
  if (!inputNode) return null;
  return inputNode;
};

export const getInputNodes = (m: M, nodeId: string) => {
  const inputLinks = mL(m).filter(li => li.toNodeId === nodeId);
  if (!inputLinks) return null;
  const inputNodes = mR(m).filter(ri => inputLinks.some(li => li.fromNodeId === ri.nodeId));
  if (!inputNodes) return null;
  return inputNodes;
};
