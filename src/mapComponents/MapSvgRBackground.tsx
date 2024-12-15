import { FC } from 'react';
import { useSelector } from 'react-redux';
import colors from 'tailwindcss/colors';
import { defaultUseOpenWorkspaceQueryState } from '../apiState/ApiState.ts';
import { mSelector } from '../editorQueries/EditorQueries.ts';
import { mR } from '../mapQueries/MapQueries.ts';
import { RootState, useOpenWorkspaceQuery } from '../rootComponent/RootComponent.tsx';

export const MapSvgRBackground: FC = () => {
  const m = useSelector((state: RootState) => mSelector(state));
  const { data } = useOpenWorkspaceQuery();
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState;
  return mR(m).map(ri => (
    <rect
      key={`${ri.nodeId}_rb`}
      x={ri.nodeStartX + 0.5}
      y={ri.nodeStartY + 0.5}
      width={ri.selfW}
      height={ri.selfH}
      rx={16}
      ry={16}
      fill={colorMode === 'dark' ? colors.zinc[800] : colors.zinc[50]}
      style={{
        transition: '0.3s ease-out',
      }}
      stroke={ri.selected ? '#bbbbbb' : 'none'}
      strokeWidth={1}
    />
  ));
};
