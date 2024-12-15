import { FC } from 'react';
import { useSelector } from 'react-redux';
import colors from 'tailwindcss/colors';
import { userInfoDefaultState } from '../apiState/ApiState.ts';
import { mSelector } from '../editorQueries/EditorQueries.ts';
import { mR } from '../mapQueries/MapQueries.ts';
import { api, RootState } from '../rootComponent/RootComponent.tsx';

export const MapSvgRBackground: FC = () => {
  const m = useSelector((state: RootState) => mSelector(state));
  const { colorMode } = api.useGetUserInfoQuery().data || userInfoDefaultState;
  return mR(m).map(ri => (
    <rect
      key={`${ri.nodeId}_rb`}
      x={ri.nodeStartX + 0.5}
      y={ri.nodeStartY + 0.5}
      width={ri.selfW}
      height={ri.selfH}
      rx={16}
      ry={16}
      fill={colorMode === 'DARK' ? colors.zinc[800] : colors.zinc[50]}
      style={{
        transition: '0.3s ease-out',
      }}
      stroke={ri.selected ? '#bbbbbb' : 'none'}
      strokeWidth={1}
    />
  ));
};
