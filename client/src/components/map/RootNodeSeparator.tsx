import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import { adjust } from '../../utils/utils.ts';
import { getLinearLinePath, pathCommonProps } from './UtilsSvg.ts';

export const RootNodeSeparator: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  return Object.entries(m.r).map(([nodeId, ri]) => (
    <path
      key={`${nodeId}_separator`}
      d={getLinearLinePath({
        x1: adjust(ri.nodeStartX),
        x2: adjust(ri.nodeStartX + ri.selfW),
        y1: adjust(ri.nodeStartY + 40),
        y2: adjust(ri.nodeStartY + 40),
      })}
      stroke={'#444'}
      {...pathCommonProps}
    />
  ));
};
