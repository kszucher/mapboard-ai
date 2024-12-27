import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getG } from '../mapQueries/MapQueries.ts';
import { RootState } from '../rootComponent/RootComponent.tsx';
import { MapSvgGBackground } from './MapSvgGBackground.tsx';
import { MapSvgL } from './MapSvgL.tsx';
import { MapSvgRConnectorsFrom } from './MapSvgRConnectorsFrom.tsx';
import { MapSvgRConnectorTo } from './MapSvgRConnectorTo.tsx';
import { MapSvgRMove } from './MapSvgRMove.tsx';
import { MapSvgRSeparators } from './MapSvgRSeparators.tsx';

export const MapSvg: FC = () => {
  const m = useSelector((state: RootState) => state.editor.commitList[state.editor.commitIndex]);
  const g = getG(m);
  return (
    <svg
      key={g.nodeId}
      width={g.selfW}
      height={g.selfH}
      style={{ transition: '0.3s ease-out', zIndex: 10, pointerEvents: 'none' }}
    >
      <MapSvgGBackground />
      <MapSvgL />
      {/*<MapSvgRBackground />*/}
      <MapSvgRSeparators />
      <MapSvgRMove />
      <MapSvgRConnectorsFrom />
      <MapSvgRConnectorTo />
    </svg>
  );
};
