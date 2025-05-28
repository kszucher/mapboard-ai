import { FC } from 'react';
import { useSelector } from 'react-redux';
import colors from 'tailwindcss/colors';
import { getNodeStartX, getNodeStartY } from '../../../../shared/src/map/getters/map-queries.ts';
import { useGetUserInfoQuery } from '../../data/api.ts';
import { RootState } from '../../data/store.ts';

export const RootNodeBackground: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const colorMode = useGetUserInfoQuery().data?.userInfo.colorMode;
  return Object.entries(m.r).map(([nodeId, ri]) => (
    <rect
      key={`${nodeId}_rb`}
      x={getNodeStartX(ri) + 0.5}
      y={getNodeStartY(ri) + 0.5}
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
