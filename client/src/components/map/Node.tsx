import { Badge, Box, DropdownMenu, Flex, IconButton, Spinner } from '@radix-ui/themes';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNodeLeft, getNodeTop, isExistingLink } from '../../../../shared/src/map/getters/map-queries.ts';
import {
  allowedSourceControls,
  allowedTargetControls,
  controlColors,
  controlTexts,
  ControlType,
} from '../../../../shared/src/map/state/map-consts-and-types.ts';
import Dots from '../../../assets/dots.svg?react';
import GripVertical from '../../../assets/grip-vertical.svg?react';
import { actions } from '../../data/reducer.ts';
import { AppDispatch, RootState } from '../../data/store.ts';
import { NodeTypeContext } from './NodeTypeContext.tsx';
import { NodeTypeFileUpload } from './NodeTypeFileUpload.tsx';
import { NodeTypeIngestion } from './NodeTypeIngestion.tsx';
import { NodeTypeLlm } from './NodeTypeLlm.tsx';
import { NodeTypeQuestion } from './NodeTypeQuestion.tsx';
import { NodeTypeVectorDatabase } from './NodeTypeVectorDatabase.tsx';

export const Node: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const dispatch = useDispatch<AppDispatch>();

  return Object.entries(m.n).map(([nodeId, ni]) => (
    <div
      key={nodeId}
      id={nodeId}
      ref={ref => ref && ref.focus()}
      style={{
        position: 'absolute',
        left: getNodeLeft(ni),
        top: getNodeTop(ni),
        transition: 'left 0.3s, top 0.3s',
        transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
        minWidth: ni.selfW,
        minHeight: ni.selfH,
        margin: 0,
        pointerEvents: 'none',
      }}
    >
      {/* IID, CONTROL_TYPE, IS_PROCESSING */}
      <Box position="absolute" top="0" left="0" pt="2" pl="2">
        <Flex direction="row" gap="2" align="start" content="center">
          <Badge color="gray" size="2">
            {'N' + ni.iid}
          </Badge>
          <Badge color={controlColors[ni.controlType]} size="2">
            {controlTexts[ni.controlType]}
          </Badge>
          {ni.isProcessing && <Spinner m="1" />}
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
                dispatch(actions.offsetNodeByDragPreview({ n: ni, e }));
              },
              { signal }
            );
            window.addEventListener(
              'mouseup',
              e => {
                abortController.abort();
                e.preventDefault();
                if (didMove) {
                  dispatch(actions.offsetNodeLink({ nodeId }));
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
                dispatch(actions.deleteNodeLink({ nodeId }));
              }}
            >
              {'Delete'}
            </DropdownMenu.Item>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger className="DropdownMenuSubTrigger">{'Connect To...'}</DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                {Object.entries(m.n)
                  .filter(
                    ([toNodeId, toRi]) =>
                      allowedTargetControls[ni.controlType].includes(toRi.controlType) &&
                      !isExistingLink(m, nodeId, toNodeId)
                  )
                  .map(([toNodeId, toRi]) => (
                    <DropdownMenu.Item
                      key={toNodeId}
                      onClick={() => {
                        dispatch(
                          actions.insertLink({
                            lPartial: {
                              fromNodeId: nodeId,
                              fromNodeSideIndex: 0,
                              toNodeId,
                              toNodeSideIndex: allowedSourceControls[toRi.controlType].findIndex(
                                controlType => controlType === ni.controlType
                              ),
                            },
                          })
                        );
                      }}
                    >
                      {toRi.controlType + ' N' + toRi.iid}
                    </DropdownMenu.Item>
                  ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Box>

      {ni.controlType === ControlType.FILE && <NodeTypeFileUpload ni={ni} nodeId={nodeId} />}
      {ni.controlType === ControlType.INGESTION && <NodeTypeIngestion ni={ni} nodeId={nodeId} />}
      {ni.controlType === ControlType.CONTEXT && <NodeTypeContext ni={ni} nodeId={nodeId} />}
      {ni.controlType === ControlType.QUESTION && <NodeTypeQuestion ni={ni} nodeId={nodeId} />}
      {ni.controlType === ControlType.VECTOR_DATABASE && <NodeTypeVectorDatabase ni={ni} nodeId={nodeId} />}
      {ni.controlType === ControlType.LLM && <NodeTypeLlm ni={ni} nodeId={nodeId} />}
    </div>
  ));
};
