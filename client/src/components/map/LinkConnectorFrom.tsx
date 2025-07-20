import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getNodeLeft, getNodeTop } from '../../../../shared/src/map/getters/map-queries.ts';
import { controlColors, ControlType } from '../../../../shared/src/map/state/map-consts-and-types.ts';
import { RootState } from '../../data/store.ts';
import { radixColorMap } from './UtilsSvg.ts';

export const LinkConnectorFrom: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const allowedControlTypes: ControlType[] = [
    ControlType.FILE,
    ControlType.INGESTION,
    ControlType.CONTEXT,
    ControlType.QUESTION,
    ControlType.VECTOR_DATABASE,
  ];

  return Object.entries(m.n)
    .filter(([, ni]) => allowedControlTypes.includes(ni.controlType))
    .map(([nodeId, ni]) => (
      <circle
        key={`${nodeId}_from`}
        viewBox="0 0 24 24"
        width="24"
        height="24"
        r={3}
        fill={radixColorMap[controlColors[ni.controlType]]}
        transform={`translate(${getNodeLeft(ni) + ni.selfW - 8}, ${getNodeTop(ni) + 60})`}
        {...{ vectorEffect: 'non-scaling-stroke' }}
        style={{
          transition: 'all 0.3s',
          transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
          transitionProperty: 'all',
        }}
      />
    ));
};
