import { FC } from 'react';
import { useSelector } from 'react-redux';
import colors from 'tailwindcss/colors';
import { getNodeLeft, getNodeTop } from '../../../../shared/src/map/getters/map-queries.ts';
import { useGetUserInfoQuery } from '../../data/api.ts';
import { RootState } from '../../data/store.ts';

export const MapBackground: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const colorMode = useGetUserInfoQuery().data?.userInfo.colorMode;
  return Object.entries(m.n).map(([nodeId, ni]) => (
    <rect
      key={`${nodeId}_rb`}
      x={getNodeLeft(ni) + 0.5}
      y={getNodeTop(ni) + 0.5}
      width={ni.selfW}
      height={ni.selfH}
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
