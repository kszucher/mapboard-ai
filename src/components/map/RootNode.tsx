import { Box, DropdownMenu, IconButton } from '@radix-ui/themes';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import colors from 'tailwindcss/colors';
import Dots from '../../../assets/dots.svg?react';
import GripVertical from '../../../assets/grip-vertical.svg?react';
import { api } from '../../data/serverSide/Api.ts';
import { userInfoDefaultState } from '../../data/serverSide/ApiState.ts';
import { actions } from '../../data/clientSide/Reducer.ts';
import { mR } from '../../data/clientSide/mapGetters/MapQueries.ts';
import { ControlType } from '../../data/clientSide/mapState/MapStateTypesEnums.ts';
import { AppDispatch, RootState } from '../../data/store.ts';
import { RootNodeExtraction } from './RootNodeExtraction.tsx';
import { RootNodeFileUpload } from './RootNodeFileUpload.tsx';
import { RootNodeIngestion } from './RootNodeIngestion.tsx';

export const RootNode: FC = () => {
  const m = useSelector((state: RootState) => state.editor.commitList[state.editor.commitIndex]);
  const { colorMode } = api.useGetUserInfoQuery().data || userInfoDefaultState;

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
        pointerEvents: 'none',
        backgroundColor: colorMode === 'DARK' ? colors.zinc[800] : colors.zinc[50],
        borderRadius: 16,
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
      {ri.controlType === ControlType.FILE && <RootNodeFileUpload ri={ri} />}
      {ri.controlType === ControlType.INGESTION && <RootNodeIngestion ri={ri} />}
      {ri.controlType === ControlType.EXTRACTION && <RootNodeExtraction ri={ri} />}
    </div>
  ));
};
