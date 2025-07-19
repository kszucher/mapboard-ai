import { FC } from 'react';
import { useSelector } from 'react-redux';
import { N_PADDING } from '../../../../shared/src/map/state/map-consts.ts';
import { RootState } from '../../data/store.ts';

export const NodeMovePreview: FC = () => {
  const rOffsetCoords = useSelector((state: RootState) => state.slice.rOffsetCoords);
  return (
    rOffsetCoords.length && (
      <rect
        x={rOffsetCoords[0] + N_PADDING}
        y={rOffsetCoords[1] + N_PADDING}
        width={rOffsetCoords[2]}
        height={rOffsetCoords[3]}
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
