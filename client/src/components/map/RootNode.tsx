import { Badge, Box, DropdownMenu, Flex, IconButton, Spinner } from '@radix-ui/themes';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRootLeftX, getRootTopY, isExistingLink } from '../../../../shared/src/map/getters/map-queries.ts';
import {
  allowedSourceControls,
  allowedTargetControls,
  controlColors,
  controlTexts,
} from '../../../../shared/src/map/state/map-consts.ts';
import { ControlColor, ControlType } from '../../../../shared/src/map/state/map-types.ts';
import Dots from '../../../assets/dots.svg?react';
import GripVertical from '../../../assets/grip-vertical.svg?react';
import { actions } from '../../data/reducer.ts';
import { AppDispatch, RootState } from '../../data/store.ts';
import { RootNodeTypeContext } from './RootNodeTypeContext.tsx';
import { RootNodeTypeFileUpload } from './RootNodeTypeFileUpload.tsx';
import { RootNodeTypeIngestion } from './RootNodeTypeIngestion.tsx';
import { RootNodeTypeLlm } from './RootNodeTypeLlm.tsx';
import { RootNodeTypeQuestion } from './RootNodeTypeQuestion.tsx';
import { RootNodeTypeVectorDatabase } from './RootNodeTypeVectorDatabase.tsx';

export const RootNode: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const dispatch = useDispatch<AppDispatch>();

  const resolveBadgeColor = (controlType: ControlType): ControlColor => {
    return controlColors[controlType];
  };

  const resolveBadgeText = (controlType: ControlType): string => {
    return controlTexts[controlType];
  };

  const getAllowedTargets = (controlType: ControlType): readonly ControlType[] => {
    return allowedTargetControls[controlType];
  };

  const getAllowedSources = (controlType: ControlType): readonly ControlType[] => {
    return allowedSourceControls[controlType];
  };

  const insertL = (fromNodeId: string, fromNodeSideIndex: number, toNodeId: string, toNodeSideIndex: number) => {
    if (!isExistingLink(m, fromNodeId, toNodeId)) {
      dispatch(
        actions.insertL({
          lPartial: {
            fromNodeId,
            fromNodeSideIndex,
            toNodeId,
            toNodeSideIndex,
          },
        })
      );
    }
  };

  return Object.entries(m.r).map(([nodeId, ri]) => (
    <div
      key={nodeId}
      id={nodeId}
      ref={ref => ref && ref.focus()}
      style={{
        position: 'absolute',
        left: getRootLeftX(ri),
        top: getRootTopY(ri),
        transition: 'left 0.3s, top 0.3s',
        transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
        minWidth: ri.selfW,
        minHeight: ri.selfH,
        margin: 0,
        pointerEvents: 'none',
      }}
    >
      {/* IID, CONTROL_TYPE, IS_PROCESSING */}
      <Box position="absolute" top="0" left="0" pt="2" pl="2">
        <Flex direction="row" gap="2" align="start" content="center">
          <Badge color="gray" size="2">
            {'R' + ri.iid}
          </Badge>
          <Badge color={resolveBadgeColor(ri.controlType)} size="2">
            {resolveBadgeText(ri.controlType)}
          </Badge>
          {ri.isProcessing && <Spinner m="1" />}
        </Flex>
      </Box>

      {/* GRIP */}
      <Box position="absolute" top="0" right="0" pt="2" pr="7">
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

      {/* DOTS */}
      <Box position="absolute" top="0" right="0" pt="2" pr="2">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton variant="soft" size="1" color="gray" style={{ pointerEvents: 'auto', background: 'none' }}>
              <Dots />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content onCloseAutoFocus={e => e.preventDefault()}>
            <DropdownMenu.Item
              onClick={() => {
                dispatch(actions.deleteLR({ nodeId }));
              }}
            >
              {'Delete'}
            </DropdownMenu.Item>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger className="DropdownMenuSubTrigger">{'Connect To...'}</DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                {Object.entries(m.r)
                  .filter(
                    ([toNodeId, toRi]) =>
                      getAllowedTargets(ri.controlType).includes(toRi.controlType) &&
                      !isExistingLink(m, nodeId, toNodeId)
                  )
                  .map(([toNodeId, toRi]) => (
                    <DropdownMenu.Item
                      key={toNodeId}
                      onClick={() => {
                        insertL(
                          nodeId,
                          0,
                          toNodeId,
                          getAllowedSources(toRi.controlType).findIndex(ct => ct === ri.controlType)
                        );
                      }}
                    >
                      {toRi.controlType + ' R' + toRi.iid}
                    </DropdownMenu.Item>
                  ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Box>

      {ri.controlType === ControlType.FILE && <RootNodeTypeFileUpload ri={ri} nodeId={nodeId} />}
      {ri.controlType === ControlType.INGESTION && <RootNodeTypeIngestion ri={ri} nodeId={nodeId} />}
      {ri.controlType === ControlType.CONTEXT && <RootNodeTypeContext ri={ri} nodeId={nodeId} />}
      {ri.controlType === ControlType.QUESTION && <RootNodeTypeQuestion ri={ri} nodeId={nodeId} />}
      {ri.controlType === ControlType.VECTOR_DATABASE && <RootNodeTypeVectorDatabase ri={ri} nodeId={nodeId} />}
      {ri.controlType === ControlType.LLM && <RootNodeTypeLlm ri={ri} nodeId={nodeId} />}
    </div>
  ));
};
