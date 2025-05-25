import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mR } from '../../../../shared/src/map/getters/map-queries.ts';
import { ControlType, Side } from '../../../../shared/src/map/state/map-types.ts';
import { actions } from '../../data/reducer.ts';
import { AppDispatch, RootState } from '../../data/store.ts';
import { adjustIcon } from '../../utils/utils.ts';

export const LinkNodeConnectorOut: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const linkHelpersVisible = useSelector((state: RootState) => state.slice.linkHelpersVisible);
  const dispatch = useDispatch<AppDispatch>();
  return (
    linkHelpersVisible &&
    mR(m)
      .filter(ri =>
        [
          ControlType.FILE,
          ControlType.INGESTION,
          ControlType.TEXT_INPUT,
          ControlType.EXTRACTION,
          ControlType.VECTOR_DATABASE,
        ].includes(ri.controlType)
      )
      .map(ri => (
        <circle
          key={`${ri.nodeId}_${Side.R}_rc`}
          viewBox="0 0 24 24"
          width="24"
          height="24"
          r={8}
          fill={'#666666'}
          transform={`translate(${adjustIcon(ri.nodeStartX + ri.selfW)}, ${adjustIcon(ri.nodeStartY + ri.selfH / 2)})`}
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
                fromNodeId: ri.nodeId,
                fromNodeSide: Side.R,
              })
            );
          }}
        />
      ))
  );
};
