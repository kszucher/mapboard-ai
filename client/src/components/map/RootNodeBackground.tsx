import { FC } from 'react';
import { useSelector } from 'react-redux';
import colors from 'tailwindcss/colors';
import { mR } from '../../data/clientSide/mapGetters/MapQueries.ts';
import { api } from '../../data/serverSide/Api.ts';
import { userInfoDefaultState } from '../../data/serverSide/ApiState.ts';
import { RootState } from '../../data/store.ts';

export const RootNodeBackground: FC = () => {
  const m = useSelector((state: RootState) => state.editor.commitList[state.editor.commitIndex]);
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
      strokeWidth={1}
    />
  ));
};
