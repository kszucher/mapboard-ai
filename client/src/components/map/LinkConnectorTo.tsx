import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getNodeLeft, getNodeTop } from '../../../../shared/src/map/map-getters.ts';
import { allowedSourceControls, controlColors } from '../../../../shared/src/api/api-types-map-node.ts';
import { RootState } from '../../data/store.ts';
import { radixColorMap } from './UtilsSvg.ts';

export const LinkConnectorTo: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);

  return m.n.flatMap(ni =>
    allowedSourceControls[ni.controlType].map((sourceControlType, idx) => {
      const isConnected = m.l.some(
        li => li.toNodeId === ni.id && m.n.find(nj => nj.id === li.fromNodeId)?.controlType === sourceControlType
      );
      return (
        <circle
          key={`${ni.id}_controlType_${sourceControlType}`}
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
