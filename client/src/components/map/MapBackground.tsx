import { FC } from 'react';
import { useSelector } from 'react-redux';
import colors from 'tailwindcss/colors';
import { defaultMapConfig } from '../../../../shared/src/api/api-types-map-config.ts';
import { getNodeHeight, getNodeLeft, getNodeTop, getNodeWidth } from '../../../../shared/src/map/map-getters.ts';
import { useGetMapConfigInfoQuery, useGetUserInfoQuery } from '../../data/api.ts';
import { RootState } from '../../data/store.ts';

export const MapBackground: FC = () => {
  const { mapNodeConfigs } = useGetMapConfigInfoQuery().data || defaultMapConfig;
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const colorMode = useGetUserInfoQuery().data?.userInfo.colorMode;

  return m.n.map(ni => (
    <rect
      key={`${ni.id}_background`}
      x={getNodeLeft(ni.offsetX) + 0.5}
      y={getNodeTop(ni.offsetY) + 0.5}
      width={getNodeWidth(mapNodeConfigs, ni.MapNodeConfig.type)}
      height={getNodeHeight(mapNodeConfigs, ni.MapNodeConfig.type)}
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
