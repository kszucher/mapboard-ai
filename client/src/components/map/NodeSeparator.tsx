import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getNodeLeft, getNodeSelfW, getNodeTop } from '../../../../shared/src/map/map-getters.ts';
import { RootState } from '../../data/store.ts';
import { adjust } from '../../utils/utils.ts';
import { getLinearLinePath, pathCommonProps } from './UtilsSvg.ts';

export const NodeSeparator: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  return Object.entries(m.n).map(([nodeId, ni]) => (
    <path
      key={`${nodeId}_separator`}
      d={getLinearLinePath({
        x1: adjust(getNodeLeft(ni)),
        x2: adjust(getNodeLeft(ni) + getNodeSelfW(ni)),
        y1: adjust(getNodeTop(ni) + 40),
        y2: adjust(getNodeTop(ni) + 40),
      })}
      stroke={'#444'}
      {...pathCommonProps}
    />
  ));
};
