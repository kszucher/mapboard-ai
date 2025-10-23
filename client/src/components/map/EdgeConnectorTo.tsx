import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Color } from '../../../../shared/src/api/api-types-node-type.ts';
import { getNodeLeft, getNodeTop } from '../../../../shared/src/map/map-getters.ts';
import { useGetEdgeTypeInfoQuery, useGetNodeTypeInfoQuery } from '../../data/api.ts';
import { RootState } from '../../data/store.ts';
import { radixColorMap } from './UtilsSvg.ts';

export const EdgeConnectorTo: FC = () => {
  const nodeTypes = useGetNodeTypeInfoQuery().data || [];
  const edgeTypes = useGetEdgeTypeInfoQuery().data || [];
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);

  return m.n.flatMap(ni =>
    edgeTypes
      .filter(eti => eti.toNodeTypeId === ni.NodeType.id)
      .map((eci, idx) => {
        const isConnected = m.e.some(ei => ei.ToNode.id === ni.id && ei.FromNode.NodeType.id === eci.fromNodeTypeId);
        const color = nodeTypes.find(el => el.id == eci.fromNodeTypeId)?.color || Color.gray;
        return (
          <circle
            key={`${ni.id}_${idx}`}
            r={3}
            fill={isConnected ? radixColorMap[color] : 'none'}
            stroke={radixColorMap[color]}
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
