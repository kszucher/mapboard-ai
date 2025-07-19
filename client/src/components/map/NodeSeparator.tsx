import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getNodeLeftX, getNodeTopY } from '../../../../shared/src/map/getters/map-queries.ts';
import { RootState } from '../../data/store.ts';
import { adjust } from '../../utils/utils.ts';
import { getLinearLinePath, pathCommonProps } from './UtilsSvg.ts';

export const NodeSeparator: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  return Object.entries(m.n).map(([nodeId, ni]) => (
    <path
      key={`${nodeId}_separator`}
      d={getLinearLinePath({
        x1: adjust(getNodeLeftX(ni)),
        x2: adjust(getNodeLeftX(ni) + ni.selfW),
        y1: adjust(getNodeTopY(ni) + 40),
        y2: adjust(getNodeTopY(ni) + 40),
      })}
      stroke={'#444'}
      {...pathCommonProps}
    />
  ));
};
