import { FC } from 'react';
import { useSelector } from 'react-redux';
import { mR } from '../../../../shared/src/map/getters/map-queries.ts';
import { RootState } from '../../data/store.ts';
import { adjust } from '../../utils/utils.ts';
import { getLinearLinePath, pathCommonProps } from './UtilsSvg.ts';

export const RootNodeSeparator: FC = () => {
  const m = useSelector((state: RootState) => state.editor.commitList[state.editor.commitIndex]);
  return mR(m).map(ri => (
    <path
      key={`${ri.nodeId}_separator`}
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
