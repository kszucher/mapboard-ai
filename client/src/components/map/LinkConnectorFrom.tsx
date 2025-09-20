import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getNodeLeft, getNodeSelfW, getNodeTop } from '../../../../shared/src/map/map-getters.ts';
import { allowedTargetControls, controlColors } from '../../../../shared/src/api/api-types-map-node.ts';
import { RootState } from '../../data/store.ts';
import { radixColorMap } from './UtilsSvg.ts';

export const LinkConnectorFrom: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);

  return Object.entries(m.n).flatMap(([nodeId, ni]) =>
    allowedTargetControls[ni.controlType].map((targetControlType, idx) => {
      const isConnected = Object.values(m.l).some(
        l => l.fromNodeId === Number(nodeId) && m.n[l.toNodeId] && m.n[l.toNodeId].controlType === targetControlType
      );

      return (
        <circle
          key={`${nodeId}_from_${idx}`}
          r={3}
          fill={isConnected ? radixColorMap[controlColors[ni.controlType]] : 'none'}
          stroke={radixColorMap[controlColors[ni.controlType]]}
          strokeWidth={1.5}
          transform={`translate(${getNodeLeft(ni) + getNodeSelfW(ni)}, ${getNodeTop(ni) + 60})`}
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
