import { FC } from 'react';
import { useSelector } from 'react-redux';
import colors from 'tailwindcss/colors';
import { mR } from '../../../../shared/src/map/getters/map-queries.ts';
import { useGetUserInfoQuery } from '../../data/api.ts';
import { RootState } from '../../data/store.ts';

export const RootNodeBackground: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const colorMode = useGetUserInfoQuery().data?.userInfo.colorMode;
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
