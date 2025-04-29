import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isExistingLink, mR } from '../../../../shared/src/map/getters/map-queries.ts';
import { ControlType, L, Side } from '../../../../shared/src/map/state/map-types.ts';
import { actions } from '../../data/reducer.ts';
import { AppDispatch, RootState } from '../../data/store.ts';
import { adjustIcon } from '../../utils/utils.ts';

export const LinkNodeConnectorIn: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const linkHelpersVisible = useSelector((state: RootState) => state.slice.linkHelpersVisible);
  const connectionStart = useSelector((state: RootState) => state.slice.connectionStart);
  const dispatch = useDispatch<AppDispatch>();
  return (
    linkHelpersVisible &&
    mR(m)
      .filter(ri => [ControlType.INGESTION, ControlType.EXTRACTION, ControlType.TEXT_OUTPUT].includes(ri.controlType))
      .map(ri => (
        <circle
          key={`${ri.nodeId}_${Side.L}_rc`}
          viewBox="0 0 24 24"
          width="24"
          height="24"
          r={8}
          fill={'#666666'}
          transform={`translate(${adjustIcon(ri.nodeStartX)}, ${adjustIcon(ri.nodeStartY + ri.selfH / 2)})`}
          {...{ vectorEffect: 'non-scaling-stroke' }}
          style={{
            transition: 'all 0.3s',
            transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
            transitionProperty: 'all',
          }}
          onMouseUp={e => {
            e.preventDefault();
            e.stopPropagation();
            const newLink: Partial<L> = {
              ...connectionStart,
              toNodeId: ri.nodeId,
              toNodeSide: Side.L,
            };
            if (
              connectionStart.fromNodeId !== '' &&
              connectionStart.fromNodeId !== ri.nodeId &&
              !isExistingLink(m, newLink)
            ) {
              dispatch(actions.insertL({ lPartial: newLink }));
            }
          }}
        />
      ))
  );
};
