import { FC } from 'react';
import { useSelector } from 'react-redux';
import { mSelector } from '../editorQueries/EditorQueries.ts';
import { getG } from '../mapQueries/MapQueries.ts';
import { RootState } from '../rootComponent/RootComponent.tsx';
import { MapSvgGBackground } from './MapSvgGBackground.tsx';
import { MapSvgL } from './MapSvgL.tsx';
import { MapSvgRBackground } from './MapSvgRBackground.tsx';
import { MapSvgRConnectorTo } from './MapSvgRConnectorTo.tsx';
import { MapSvgRConnectorsFrom } from './MapSvgRConnectorsFrom.tsx';
import { MapSvgRMove } from './MapSvgRMove.tsx';
import { MapSvgRSeparators } from './MapSvgRSeparators.tsx';

export const MapSvg: FC = () => {
  const m = useSelector((state: RootState) => mSelector(state));
  const g = getG(m);
  return (
    <svg key={g.nodeId} width={g.selfW} height={g.selfH} style={{ transition: '0.3s ease-out' }}>
      <MapSvgGBackground />
      <MapSvgL />
      <MapSvgRBackground />
      <MapSvgRSeparators />
      <MapSvgRMove />
      <MapSvgRConnectorsFrom />
      <MapSvgRConnectorTo />
    </svg>
  );
};
