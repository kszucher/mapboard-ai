import { FC } from 'react';
import { useSelector } from 'react-redux';
import { defaultMapConfig } from '../../../../shared/src/api/api-types-map-config.ts';
import { getNodeRight, getNodeTop } from '../../../../shared/src/map/map-getters.ts';
import { useGetMapConfigInfoQuery } from '../../data/api.ts';
import { RootState } from '../../data/store.ts';
import { radixColorMap } from './UtilsSvg.ts';

export const EdgeConnectorFrom: FC = () => {
  const { mapNodeConfigs } = useGetMapConfigInfoQuery().data || defaultMapConfig;
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);

  return m.n.map(ni => {
    const isConnected = m.e.some(ei => ei.fromNodeId === ni.id);
    const color = mapNodeConfigs?.find(el => el.type === ni.controlType)?.color || 'gray';
    return (
      <circle
        key={`${ni.id}_from`}
        r={3}
        fill={isConnected ? radixColorMap[color] : 'none'}
        stroke={radixColorMap[color]}
        strokeWidth={1.5}
        transform={`translate(${getNodeRight(mapNodeConfigs, ni.offsetX, ni.controlType)}, ${getNodeTop(ni.offsetY) + 60})`}
        vectorEffect="non-scaling-stroke"
        style={{
          transition: 'all 0.3s',
          transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
          transitionProperty: 'all',
        }}
      />
    );
  });
};
