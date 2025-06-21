import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNodeStartX, getNodeStartY, isExistingLink } from '../../../../shared/src/map/getters/map-queries.ts';
import { ControlType, L, Side } from '../../../../shared/src/map/state/map-types.ts';
import { actions } from '../../data/reducer.ts';
import { AppDispatch, RootState } from '../../data/store.ts';
import { adjustIcon } from '../../utils/utils.ts';

export const LinkNodeConnectorTo: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const connectionStart = useSelector((state: RootState) => state.slice.connectionStart);
  const dispatch = useDispatch<AppDispatch>();

  return Object.entries(m.r)
    .filter(([, ri]) =>
      [ControlType.INGESTION, ControlType.EXTRACTION, ControlType.VECTOR_DATABASE].includes(ri.controlType)
    )
    .flatMap(([nodeId, ri]) => {
      const baseX = adjustIcon(getNodeStartX(ri));
      const baseY = adjustIcon(getNodeStartY(ri) + ri.selfH / 2);

      const makeCircle = (offsetY: number, index: number) => (
        <circle
          key={`${nodeId}_${Side.L}_rc_${index}`}
          viewBox="0 0 24 24"
          width="24"
          height="24"
          r={8}
          fill={'#666666'}
          transform={`translate(${baseX}, ${baseY + offsetY})`}
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
              toNodeId: nodeId,
              toNodeSide: Side.L,
              toNodeSideIndex: index,
            };
            if (
              connectionStart.fromNodeId !== '' &&
              connectionStart.fromNodeId !== nodeId &&
              !isExistingLink(m, newLink)
            ) {
              dispatch(actions.insertL({ lPartial: newLink }));
            }
          }}
        />
      );

      if (ri.controlType === ControlType.VECTOR_DATABASE) {
        return [0, 20, 40].map((offset, idx) => makeCircle(offset, idx));
      } else if (ri.controlType === ControlType.EXTRACTION) {
        return [0, 20].map((offset, idx) => makeCircle(offset, idx));
      }

      return [makeCircle(0, 0)];
    });
};
