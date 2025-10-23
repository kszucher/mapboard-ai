import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getNodeRight, getNodeTop } from '../../../../shared/src/map/map-getters.ts';
import { RootState } from '../../data/store.ts';
import { radixColorMap } from './UtilsSvg.ts';

export const EdgeConnectorFrom: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);

  return m.n.map(ni => {
    const isConnected = m.e.some(ei => ei.fromNodeId === ni.id);
    return (
      <circle
        key={`${ni.id}_from`}
        r={3}
        fill={isConnected ? radixColorMap[ni.NodeType.color] : 'none'}
        stroke={radixColorMap[ni.NodeType.color]}
        strokeWidth={1.5}
        transform={`translate(${getNodeRight(ni)}, ${getNodeTop(ni) + 60})`}
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
