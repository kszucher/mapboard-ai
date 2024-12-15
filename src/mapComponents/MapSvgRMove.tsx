import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../rootComponent/RootComponent.tsx';

export const MapSvgRMove: FC = () => {
  const rOffsetCoords = useSelector((state: RootState) => state.editor.rOffsetCoords);
  return (
    rOffsetCoords.length && (
      <rect
        x={rOffsetCoords[0]}
        y={rOffsetCoords[1]}
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
