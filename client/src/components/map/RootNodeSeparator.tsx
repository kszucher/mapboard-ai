import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getNodeStartX, getNodeStartY } from '../../../../shared/src/map/getters/map-queries.ts';
import { RootState } from '../../data/store.ts';
import { adjust } from '../../utils/utils.ts';
import { getLinearLinePath, pathCommonProps } from './UtilsSvg.ts';

export const RootNodeSeparator: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  return Object.entries(m.r).map(([nodeId, ri]) => (
    <path
      key={`${nodeId}_separator`}
      d={getLinearLinePath({
        x1: adjust(getNodeStartX(ri)),
        x2: adjust(getNodeStartX(ri) + ri.selfW),
        y1: adjust(getNodeStartY(ri) + 40),
        y2: adjust(getNodeStartY(ri) + 40),
      })}
      stroke={'#444'}
      {...pathCommonProps}
    />
  ));
};
