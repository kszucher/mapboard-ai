import { Box, IconButton } from '@radix-ui/themes';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GripVertical from '../../../assets/grip-vertical.svg?react';
import { mR } from '../../data/clientSide/mapGetters/MapQueries.ts';
import { ControlType } from '../../data/clientSide/mapState/MapStateTypes.ts';
import { actions } from '../../data/clientSide/Reducer.ts';
import { AppDispatch, RootState } from '../../data/store.ts';
import { Extraction } from './rootNodeType/Extraction.tsx';
import { FileUpload } from './rootNodeType/FileUpload.tsx';
import { Ingestion } from './rootNodeType/Ingestion.tsx';
import { TextInput } from './rootNodeType/TextInput.tsx';
import { TextOutput } from './rootNodeType/TextOutput.tsx';

export const RootNode: FC = () => {
  const m = useSelector((state: RootState) => state.editor.commitList[state.editor.commitIndex]);
  const dispatch = useDispatch<AppDispatch>();
  return mR(m).map(ri => (
    <div
      key={ri.nodeId}
      id={ri.nodeId}
      ref={ref => ref && ref.focus()}
      style={{
        position: 'absolute',
        left: ri.nodeStartX,
        top: ri.nodeStartY,
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
                  dispatch(actions.offsetLR({ nodeId: ri.nodeId }));
                }
              },
              { signal }
            );
          }}
        >
          <GripVertical />
        </IconButton>
      </Box>
      {ri.controlType === ControlType.FILE && <FileUpload ri={ri} />}
      {ri.controlType === ControlType.INGESTION && <Ingestion ri={ri} />}
      {ri.controlType === ControlType.EXTRACTION && <Extraction ri={ri} />}
      {ri.controlType === ControlType.TEXT_INPUT && <TextInput ri={ri} />}
      {ri.controlType === ControlType.TEXT_OUTPUT && <TextOutput ri={ri} />}
    </div>
  ));
};
