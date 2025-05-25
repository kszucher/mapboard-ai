import { FC } from 'react';
import { useSelector } from 'react-redux';
import { L } from '../../../../shared/src/map/state/map-types.ts';
import { RootState } from '../../data/store.ts';
import { getBezierLinePath, getRootLinePath, pathCommonProps } from './UtilsSvg.ts';

export const LinkNodeBezier: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  return Object.entries(m.l).map(([nodeId, l]) => (
    <path
      key={`${nodeId}_l`}
      d={getBezierLinePath('M', getRootLinePath(m, l as L))}
      strokeWidth={1}
      stroke={'#ffffff'}
      fill={'none'}
      {...pathCommonProps}
    />
  ));
};
