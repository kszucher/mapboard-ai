import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getRootLeftX, getRootTopY } from '../../../../shared/src/map/getters/map-queries.ts';
import { RootState } from '../../data/store.ts';
import { adjust } from '../../utils/utils.ts';
import { getLinearLinePath, pathCommonProps } from './UtilsSvg.ts';

export const RootNodeSeparator: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  return Object.entries(m.r).map(([nodeId, ri]) => (
    <path
      key={`${nodeId}_separator`}
      d={getLinearLinePath({
        x1: adjust(getRootLeftX(ri)),
        x2: adjust(getRootLeftX(ri) + ri.selfW),
        y1: adjust(getRootTopY(ri) + 40),
        y2: adjust(getRootTopY(ri) + 40),
      })}
      stroke={'#444'}
      {...pathCommonProps}
    />
  ));
};
