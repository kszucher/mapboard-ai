import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getNodeColor, getNodeRight, getNodeTop } from '../../../../shared/src/map/map-getters.ts';
import { useGetNodeTypeInfoQuery } from '../../data/api.ts';
import { RootState } from '../../data/store.ts';
import { radixColorMap } from './UtilsSvg.ts';

export const EdgeConnectorFrom: FC = () => {
  const nodeTypes = useGetNodeTypeInfoQuery().data || [];
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);

  return m.n.map(ni => {
    const isConnected = m.e.some(ei => ei.fromNodeId === ni.id);
    return (
      <circle
        key={`${ni.id}_from`}
        r={3}
        fill={isConnected ? radixColorMap[getNodeColor(nodeTypes, ni)] : 'none'}
        stroke={radixColorMap[getNodeColor(nodeTypes, ni)]}
        strokeWidth={1.5}
        transform={`translate(${getNodeRight(nodeTypes, ni)}, ${getNodeTop(ni) + 60})`}
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
