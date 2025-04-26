import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import { R_PADDING } from '../../../../shared/src/map/state/map-consts.ts';

export const RootNodeMovePreview: FC = () => {
  const rOffsetCoords = useSelector((state: RootState) => state.slice.rOffsetCoords);
  return (
    rOffsetCoords.length && (
      <rect
        x={rOffsetCoords[0] + R_PADDING}
        y={rOffsetCoords[1] + R_PADDING}
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
