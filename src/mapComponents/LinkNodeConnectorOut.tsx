import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../editorMutations/EditorMutations.ts';
import { mR } from '../mapQueries/MapQueries.ts';
import { ControlType, Side } from '../mapState/MapStateTypesEnums.ts';
import { AppDispatch, RootState } from '../rootComponent/RootComponent.tsx';
import { adjustIcon } from '../utils/Utils.ts';

export const LinkNodeConnectorOut: FC = () => {
  const m = useSelector((state: RootState) => state.editor.commitList[state.editor.commitIndex]);
  const connectionHelpersVisible = useSelector((state: RootState) => state.editor.connectionHelpersVisible);
  const dispatch = useDispatch<AppDispatch>();
  return (
    connectionHelpersVisible &&
    mR(m)
      .filter(ri => [ControlType.FILE, ControlType.INGESTION].includes(ri.controlType))
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
