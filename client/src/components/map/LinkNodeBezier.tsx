import { FC } from 'react';
import { useSelector } from 'react-redux';
import { mL } from '../../../../shared/src/map/getters/map-queries.ts';
import { RootState } from '../../data/store.ts';
import { getBezierLinePath, getRootLinePath, pathCommonProps } from './UtilsSvg.ts';

export const LinkNodeBezier: FC = () => {
  const m = useSelector((state: RootState) => state.editor.commitList[state.editor.commitIndex]);
  return mL(m).map(li => (
    <path
      key={`${li.nodeId}_l`}
      d={getBezierLinePath('M', getRootLinePath(m, li))}
      strokeWidth={1}
      stroke={'#ffffff'}
      fill={'none'}
      {...pathCommonProps}
    />
  ));
};
