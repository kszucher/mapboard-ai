import { FC } from 'react';
import { useSelector } from 'react-redux';
import { controlColors } from '../../../../shared/src/api/api-types-map-node.ts';
import { getNodeLeft, getNodeSelfW, getNodeTop } from '../../../../shared/src/map/map-getters.ts';
import { RootState } from '../../data/store.ts';
import { radixColorMap } from './UtilsSvg.ts';

export const LinkConnectorFrom: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);

  return m.n.map(ni => {
    const isConnected = m.l.some(li => li.fromNodeId === ni.id);
    return (
      <circle
        key={`${ni.id}_from`}
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
  });
};
