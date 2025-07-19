import { FC } from 'react';
import { useSelector } from 'react-redux';
import { N_PADDING } from '../../../../shared/src/map/state/map-consts.ts';
import { RootState } from '../../data/store.ts';

export const NodeMovePreview: FC = () => {
  const nodeOffsetCoords = useSelector((state: RootState) => state.slice.nodeOffsetCoords);
  return (
    nodeOffsetCoords.length && (
      <rect
        x={nodeOffsetCoords[0] + N_PADDING}
        y={nodeOffsetCoords[1] + N_PADDING}
        width={nodeOffsetCoords[2]}
        height={nodeOffsetCoords[3]}
        rx={8}
        ry={8}
        fill={'none'}
        fillOpacity={1}
        stroke={'#dddddd'}
        strokeWidth={1}
      />
    )
  );
};
