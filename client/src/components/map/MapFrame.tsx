import { FC } from 'react';
import { useSelector } from 'react-redux';
import { defaultMapConfig } from '../../../../shared/src/api/api-types-map-config.ts';
import { getMapHeight, getMapWidth } from '../../../../shared/src/map/map-getters.ts';
import { useGetMapConfigInfoQuery } from '../../data/api.ts';
import { RootState } from '../../data/store.ts';

export const MapFrame: FC = () => {
  const { mapNodeConfigs } = useGetMapConfigInfoQuery().data || defaultMapConfig;
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const mapFrameVisible = useSelector((state: RootState) => state.slice.mapFrameVisible);

  return (
    mapFrameVisible && (
      <rect
        key={'svg_map_background'}
        x={0}
        y={0}
        width={getMapWidth(mapNodeConfigs, m)}
        height={getMapHeight(mapNodeConfigs, m)}
        rx={0}
        ry={0}
        fill={'none'}
        stroke={'#aaaaaa'}
        strokeWidth={0.5}
      />
    )
  );
};
