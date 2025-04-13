import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../data/clientSide/Reducer.ts';
import { isExistingLink, mR } from '../../data/clientSide/mapGetters/MapQueries.ts';
import { ControlType, L, Side } from '../../data/clientSide/mapState/MapStateTypes.ts';
import { AppDispatch, RootState } from '../../data/store.ts';
import { adjustIcon } from '../../utils/Utils.ts';

export const LinkNodeConnectorIn: FC = () => {
  const m = useSelector((state: RootState) => state.editor.commitList[state.editor.commitIndex]);
  const linkHelpersVisible = useSelector((state: RootState) => state.editor.linkHelpersVisible);
  const connectionStart = useSelector((state: RootState) => state.editor.connectionStart);
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
