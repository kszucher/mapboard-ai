import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getNodeLeft, getNodeTop } from '../../../../shared/src/map/getters/map-queries.ts';
import {
  allowedSourceControls,
  controlColors,
  ControlType,
} from '../../../../shared/src/map/state/map-consts-and-types.ts';
import { RootState } from '../../data/store.ts';
import { radixColorMap } from './UtilsSvg.ts';

export const LinkConnectorTo: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const allowedControlTypes: ControlType[] = [ControlType.INGESTION, ControlType.LLM, ControlType.VECTOR_DATABASE];

  return Object.entries(m.n)
    .filter(([, ni]) => allowedControlTypes.includes(ni.controlType))
    .flatMap(([nodeId, ni]) =>
      allowedSourceControls[ni.controlType].map((_, idx) => (
        <circle
          key={`${nodeId}_to_${idx}`}
          viewBox="0 0 24 24"
          width="24"
          height="24"
          r={3}
          fill={radixColorMap[controlColors[allowedSourceControls[ni.controlType][idx]]]}
          transform={`translate(${getNodeLeft(ni) + 10}, ${getNodeTop(ni) + 60 + idx * 20})`}
          vectorEffect="non-scaling-stroke"
          style={{
            transition: 'all 0.3s',
            transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
            transitionProperty: 'all',
          }}
        />
      ))
    );
};
