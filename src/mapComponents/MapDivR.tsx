import { Box, DropdownMenu, IconButton } from '@radix-ui/themes';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dots from '../../assets/dots.svg?react';
import GripVertical from '../../assets/grip-vertical.svg?react';
import { actions } from '../editorMutations/EditorMutations.ts';
import { getROffsetCoords, mSelector } from '../editorQueries/EditorQueries.ts';
import { LeftMouseMode, NodeMode } from '../editorState/EditorStateTypesEnums.ts';
import { getAXR, getNodeMode, isAXR, mR } from '../mapQueries/MapQueries.ts';
import { ControlType } from '../mapState/MapStateTypesEnums.ts';
import { AppDispatch, RootState } from '../rootComponent/RootComponent.tsx';
import { MapDivRExtraction } from './MapDivRExtraction.tsx';
import { MapDivRFile } from './MapDivRFile.tsx';
import { MapDivRIngestion } from './MapDivRIngestion.tsx';

export const MapDivR: FC = () => {
  const leftMouseMode = useSelector((state: RootState) => state.editor.leftMouseMode);
  const m = useSelector((state: RootState) => mSelector(state));
  const nodeMode = getNodeMode(m);
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
        zIndex: ri.path.length,
        margin: 0,
        pointerEvents:
          leftMouseMode === LeftMouseMode.CLICK_SELECT && nodeMode === NodeMode.EDIT_ROOT ? 'auto' : 'none',
      }}
      onMouseDown={e => {
        let didMove = false;
        e.stopPropagation();
        if (e.buttons === 1) {
          if (leftMouseMode === LeftMouseMode.CLICK_SELECT && nodeMode === NodeMode.EDIT_ROOT && !e.ctrlKey) {
            if (!e.shiftKey) dispatch(actions.selectR(ri.path));
            if (e.shiftKey && isAXR(m) && !ri.selected) dispatch(actions.selectRAdd(ri.path));
            if (e.shiftKey && ri.selected && getAXR(m).length > 1) dispatch(actions.unselectR(ri.path));
          } else if (leftMouseMode === LeftMouseMode.CLICK_SELECT && nodeMode === NodeMode.EDIT_ROOT && e.ctrlKey) {
            if (!e.shiftKey) dispatch(actions.selectR(ri.path));
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
                  dispatch(actions.offsetRByDrag({ nodeId: ri.nodeId, rOffsetCoords: getROffsetCoords() }));
                  dispatch(actions.offsetRByDragPreviewClear());
                }
              },
              { signal }
            );
          }
        } else if (e.buttons === 4) {
          e.preventDefault();
        }
      }}
    >
      <Box position="absolute" top="0" right="0" pt="2" pr="7">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton variant="soft" size="1" color="gray" style={{ pointerEvents: 'auto', background: 'none' }}>
              <Dots />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content onCloseAutoFocus={e => e.preventDefault()}>
            <DropdownMenu.Item
              onClick={() => {
                dispatch(actions.deleteLR({ nodeId: ri.nodeId }));
              }}
            >
              {'Delete'}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Box>
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
                  dispatch(actions.offsetRByDrag({ nodeId: ri.nodeId, rOffsetCoords: getROffsetCoords() }));
                  dispatch(actions.offsetRByDragPreviewClear());
                }
              },
              { signal }
            );
          }}
        >
          <GripVertical />
        </IconButton>
      </Box>
      {ri.controlType === ControlType.FILE && <MapDivRFile ri={ri} />}
      {ri.controlType === ControlType.INGESTION && <MapDivRIngestion ri={ri} />}
      {ri.controlType === ControlType.EXTRACTION && <MapDivRExtraction ri={ri} />}
    </div>
  ));
};
