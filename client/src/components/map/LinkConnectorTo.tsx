import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getNodeLeft, getNodeTop } from '../../../../shared/src/map/getters/map-queries.ts';
import { allowedSourceControls, controlColors } from '../../../../shared/src/map/state/map-consts-and-types.ts';
import { RootState } from '../../data/store.ts';
import { radixColorMap } from './UtilsSvg.ts';

export const LinkConnectorTo: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);

  return Object.entries(m.n).flatMap(([nodeId, ni]) =>
    allowedSourceControls[ni.controlType].map((sourceControlType, idx) => {
      const isConnected = Object.values(m.l).some(
        l => l.toNodeId === Number(nodeId) && m.n[l.fromNodeId] && m.n[l.fromNodeId].controlType === sourceControlType
      );

      return (
        <circle
          key={`${nodeId}_to_${idx}`}
          r={3}
          fill={isConnected ? radixColorMap[controlColors[sourceControlType]] : 'none'}
          stroke={radixColorMap[controlColors[sourceControlType]]}
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
