import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRootLeftX, getRootTopY } from '../../../../shared/src/map/getters/map-queries.ts';
import { ControlType, Side } from '../../../../shared/src/map/state/map-types.ts';
import { actions } from '../../data/reducer.ts';
import { AppDispatch, RootState } from '../../data/store.ts';

export const LinkNodeConnectorFrom: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const dispatch = useDispatch<AppDispatch>();
  return Object.entries(m.r)
    .filter(([, ri]) =>
      [
        ControlType.FILE,
        ControlType.INGESTION,
        ControlType.CONTEXT,
        ControlType.QUESTION,
        ControlType.VECTOR_DATABASE,
      ].includes(ri.controlType)
    )
    .map(([nodeId, ri]) => (
      <circle
        key={`${nodeId}_${Side.R}_rc`}
        viewBox="0 0 24 24"
        width="24"
        height="24"
        r={4}
        fill={'#666666'}
        transform={`translate(${getRootLeftX(ri) + ri.selfW - 8}, ${getRootTopY(ri) + 60})`}
        {...{ vectorEffect: 'non-scaling-stroke' }}
        style={{
          transition: 'all 0.3s',
          transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
          transitionProperty: 'all',
        }}
        onMouseDown={e => {
          e.preventDefault();
          e.stopPropagation();
          dispatch(
            actions.setConnectionStart({
              fromNodeId: nodeId,
              fromNodeSide: Side.R,
            })
          );
        }}
      />
    ));
};
