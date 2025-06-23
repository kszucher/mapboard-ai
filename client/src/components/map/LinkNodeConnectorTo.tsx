import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getRootLeftX, getRootTopY } from '../../../../shared/src/map/getters/map-queries.ts';
import { allowedSourceControls, controlColors } from '../../../../shared/src/map/state/map-consts.ts';
import { ControlType } from '../../../../shared/src/map/state/map-types.ts';
import { RootState } from '../../data/store.ts';
import { radixColorMap } from './UtilsSvg.ts';

export const LinkNodeConnectorTo: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);

  return Object.entries(m.r)
    .filter(([, ri]) => [ControlType.INGESTION, ControlType.LLM, ControlType.VECTOR_DATABASE].includes(ri.controlType))
    .flatMap(([nodeId, ri]) =>
      allowedSourceControls[ri.controlType].map((_, idx) => (
        <circle
          key={`${nodeId}_to_${idx}`}
          viewBox="0 0 24 24"
          width="24"
          height="24"
          r={3}
          fill={radixColorMap[controlColors[allowedSourceControls[ri.controlType][idx]]]}
          transform={`translate(${getRootLeftX(ri) + 10}, ${getRootTopY(ri) + 60 + idx * 20})`}
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
