import { Box, IconButton } from '@radix-ui/themes';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNodeStartX, getNodeStartY } from '../../../../shared/src/map/getters/map-queries.ts';
import { ControlType } from '../../../../shared/src/map/state/map-types.ts';
import GripVertical from '../../../assets/grip-vertical.svg?react';
import { actions } from '../../data/reducer.ts';
import { AppDispatch, RootState } from '../../data/store.ts';
import { Extraction } from './rootNodeType/Extraction.tsx';
import { FileUpload } from './rootNodeType/FileUpload.tsx';
import { Ingestion } from './rootNodeType/Ingestion.tsx';
import { Context } from './rootNodeType/Context.tsx';
import { Question } from './rootNodeType/Question.tsx';
import { VectorDatabase } from './rootNodeType/VectorDatabase.tsx';

export const RootNode: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const dispatch = useDispatch<AppDispatch>();
  return Object.entries(m.r).map(([nodeId, ri]) => (
    <div
      key={nodeId}
      id={nodeId}
      ref={ref => ref && ref.focus()}
      style={{
        position: 'absolute',
        left: getNodeStartX(ri),
        top: getNodeStartY(ri),
        transition: 'left 0.3s, top 0.3s',
        transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
        minWidth: ri.selfW,
        minHeight: ri.selfH,
        margin: 0,
        pointerEvents: 'none',
      }}
    >
      <Box position="absolute" top="0" right="0" pt="2" pr="2">
        <IconButton
          variant="soft"
          size="1"
          color="gray"
          style={{ cursor: 'pointer', pointerEvents: 'auto', background: 'none' }}
          onMouseDown={e => {
            let didMove = false;
            e.stopPropagation();
            dispatch(actions.saveFromCoordinates({ e }));
            const abortController = new AbortController();
            const { signal } = abortController;
            window.addEventListener(
              'mousemove',
              e => {
                e.preventDefault();
                didMove = true;
                dispatch(actions.offsetRByDragPreview({ r: ri, e }));
              },
              { signal }
            );
            window.addEventListener(
              'mouseup',
              e => {
                abortController.abort();
                e.preventDefault();
                if (didMove) {
                  dispatch(actions.offsetLR({ nodeId }));
                }
              },
              { signal }
            );
          }}
        >
          <GripVertical />
        </IconButton>
      </Box>
      {ri.controlType === ControlType.FILE && <FileUpload ri={ri} nodeId={nodeId} />}
      {ri.controlType === ControlType.INGESTION && <Ingestion ri={ri} nodeId={nodeId} />}
      {ri.controlType === ControlType.CONTEXT && <Context ri={ri} nodeId={nodeId} />}
      {ri.controlType === ControlType.QUESTION && <Question ri={ri} nodeId={nodeId} />}
      {ri.controlType === ControlType.VECTOR_DATABASE && <VectorDatabase ri={ri} nodeId={nodeId} />}
      {ri.controlType === ControlType.EXTRACTION && <Extraction ri={ri} nodeId={nodeId} />}
    </div>
  ));
};
