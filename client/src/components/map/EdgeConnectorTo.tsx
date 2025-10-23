import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getNodeLeft, getNodeTop } from '../../../../shared/src/map/map-getters.ts';
import { RootState } from '../../data/store.ts';
import { radixColorMap } from './UtilsSvg.ts';

export const EdgeConnectorTo: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);

  return m.n.flatMap(ni =>
    ni.NodeType.OutEdgeTypes.map((eci, idx) => {
      const isConnected = m.e.some(ei => ei.ToNode.id === ni.id && ei.FromNode.NodeType.id === eci.FromNodeType.id);
      return (
        <circle
          key={`${ni.id}_${idx}`}
          r={3}
          fill={isConnected ? radixColorMap[eci.FromNodeType.color] : 'none'}
          stroke={radixColorMap[eci.FromNodeType.color]}
          strokeWidth={1.5}
          transform={`translate(${getNodeLeft(ni)}, ${getNodeTop(ni) + 60 + idx * 20})`}
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
