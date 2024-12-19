import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../editorMutations/EditorMutations.ts';
import { mSelector } from '../editorQueries/EditorQueries.ts';
import { isExistingLink, mR } from '../mapQueries/MapQueries.ts';
import { L } from '../mapState/MapStateTypes.ts';
import { ControlType, Side } from '../mapState/MapStateTypesEnums.ts';
import { AppDispatch, RootState } from '../rootComponent/RootComponent.tsx';
import { adjustIcon } from '../utils/Utils.ts';

export const MapSvgRConnectorTo: FC = () => {
  const m = useSelector((state: RootState) => mSelector(state));
  const connectionHelpersVisible = useSelector((state: RootState) => state.editor.connectionHelpersVisible);
  const connectionStart = useSelector((state: RootState) => state.editor.connectionStart);
  const dispatch = useDispatch<AppDispatch>();
  return (
    connectionHelpersVisible &&
    mR(m)
      .filter(ri => [ControlType.INGESTION, ControlType.EXTRACTION].includes(ri.controlType))
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
              dispatch(actions.insertL(newLink));
            }
          }}
        />
      ))
  );
};
