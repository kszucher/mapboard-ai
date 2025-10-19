import { FC } from 'react';
import { useSelector } from 'react-redux';
import { defaultMapConfig } from '../../../../shared/src/api/api-types-map-config.ts';
import { getAllowedSources, getNodeLeft, getNodeTop } from '../../../../shared/src/map/map-getters.ts';
import { useGetMapConfigInfoQuery } from '../../data/api.ts';
import { RootState } from '../../data/store.ts';
import { radixColorMap } from './UtilsSvg.ts';

export const LinkConnectorTo: FC = () => {
  const { mapNodeConfigs, mapLinkConfigs } = useGetMapConfigInfoQuery().data || defaultMapConfig;
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  
  return m.n.flatMap(ni =>
    getAllowedSources(mapLinkConfigs, ni.controlType).map((sourceType, idx) => {
      const isConnected = m.l.some(
        li => li.toNodeId === ni.id && m.n.find(nj => nj.id === li.fromNodeId)?.controlType === sourceType
      );
      const color = mapNodeConfigs?.find(el => el.type === sourceType)?.color || 'gray';
      return (
        <circle
          key={`${ni.id}_controlType_${sourceType}`}
          r={3}
          fill={isConnected ? radixColorMap[color] : 'none'}
          stroke={radixColorMap[color]}
          strokeWidth={1.5}
          transform={`translate(${getNodeLeft(ni.offsetX)}, ${getNodeTop(ni.offsetY) + 60 + idx * 20})`}
          vectorEffect="non-scaling-stroke"
          style={{
            transition: 'all 0.3s',
            transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
            transitionProperty: 'all',
          }}
        />
      );
    })
  );
};
