import { Badge, Box, DropdownMenu, Flex, IconButton, Spinner } from '@radix-ui/themes';
import { FC, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getNodeHeight,
  getNodeLeft,
  getNodeTop,
  getNodeWidth,
  isExistingEdge,
} from '../../../../shared/src/map/map-getters.ts';
import Dots from '../../../assets/dots.svg?react';
import GripVertical from '../../../assets/grip-vertical.svg?react';
import { api, useGetMapInfoQuery, useGetNodeTypeInfoQuery } from '../../data/api.ts';
import { actions } from '../../data/reducer.ts';
import { AppDispatch, RootState } from '../../data/store.ts';
import { NodeTypeContext } from './NodeTypeContext.tsx';
import { NodeTypeDataFrame } from './NodeTypeDataFrame.tsx';
import { NodeTypeFileUpload } from './NodeTypeFileUpload.tsx';
import { NodeTypeIngestion } from './NodeTypeIngestion.tsx';
import { NodeTypeLlm } from './NodeTypeLlm.tsx';
import { NodeTypeQuestion } from './NodeTypeQuestion.tsx';
import { NodeTypeVectorDatabase } from './NodeTypeVectorDatabase.tsx';
import { NodeTypeVisualizer } from './NodeTypeVisualizer.tsx';

export const Node: FC = () => {
  const nodeTypes = useGetNodeTypeInfoQuery().data || [];
  const mapId = useGetMapInfoQuery().data?.id!;
  const nodeOffsetCoords = useSelector((state: RootState) => state.slice.nodeOffsetCoords);
  const nodeOffsetCoordsRef = useRef(nodeOffsetCoords);
  nodeOffsetCoordsRef.current = nodeOffsetCoords;
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);

  const dispatch = useDispatch<AppDispatch>();

  if (!nodeTypes) {
    return;
  }

  return m.n.map(ni => (
    <div
      key={ni.id}
      id={'' + ni.id}
      ref={ref => ref && ref.focus()}
      style={{
        position: 'absolute',
        left: getNodeLeft(ni),
        top: getNodeTop(ni),
        transition: 'left 0.3s, top 0.3s',
        transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
        minWidth: getNodeWidth(ni),
        minHeight: getNodeHeight(ni),
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
          <Badge color={ni.NodeType.color} size="2">
            {nodeTypes.find(el => el.type === ni.NodeType.type)?.label || ''}
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
            dispatch(actions.moveNodePreviewStart({ e }));
            const abortController = new AbortController();
            const { signal } = abortController;
            window.addEventListener(
              'mousemove',
              e => {
                e.preventDefault();
                didMove = true;
                dispatch(actions.moveNodePreviewUpdate({ n: ni, e }));
              },
              { signal }
            );
            window.addEventListener(
              'mouseup',
              e => {
                abortController.abort();
                e.preventDefault();
                if (didMove) {
                  dispatch(
                    actions.moveNodeOptimistic({
                      nodeId: ni.id,
                      offsetX: nodeOffsetCoordsRef.current[0],
                      offsetY: nodeOffsetCoordsRef.current[1],
                    })
                  );
                  dispatch(
                    api.endpoints.moveNode.initiate({
                      mapId,
                      nodeId: ni.id,
                      offsetX: nodeOffsetCoordsRef.current[0],
                      offsetY: nodeOffsetCoordsRef.current[1],
                    })
                  );
                  dispatch(actions.moveNodePreviewEnd());
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
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger className="DropdownMenuSubTrigger">{'Connect To...'}</DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                {m.n
                  .filter(
                    toNi =>
                      ni.id !== toNi.id && // TODO: also does NOT create a loop
                      toNi.NodeType.InEdgeTypes.some(eci => eci.FromNodeType.id === ni.nodeTypeId) &&
                      !isExistingEdge(m, ni.id, toNi.id)
                  )
                  .map(toNi => (
                    <DropdownMenu.Item
                      key={toNi.id}
                      onClick={() => {
                        dispatch(
                          api.endpoints.insertEdge.initiate({
                            mapId,
                            fromNodeId: ni.id,
                            toNodeId: toNi.id,
                          })
                        );
                      }}
                    >
                      {toNi.NodeType.type + ' N' + toNi.iid}
                    </DropdownMenu.Item>
                  ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
            <DropdownMenu.Item
              onClick={() => {
                dispatch(api.endpoints.deleteNode.initiate({ mapId, nodeId: ni.id }));
              }}
            >
              {'Delete'}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Box>

      {ni.NodeType.type === 'FILE' && <NodeTypeFileUpload ni={ni} nodeId={ni.id} />}
      {ni.NodeType.type === 'INGESTION' && <NodeTypeIngestion ni={ni} nodeId={ni.id} />}
      {ni.NodeType.type === 'CONTEXT' && <NodeTypeContext ni={ni} nodeId={ni.id} />}
      {ni.NodeType.type === 'QUESTION' && <NodeTypeQuestion ni={ni} nodeId={ni.id} />}
      {ni.NodeType.type === 'VECTOR_DATABASE' && <NodeTypeVectorDatabase ni={ni} nodeId={ni.id} />}
      {ni.NodeType.type === 'DATA_FRAME' && <NodeTypeDataFrame ni={ni} nodeId={ni.id} />}
      {ni.NodeType.type === 'LLM' && <NodeTypeLlm ni={ni} nodeId={ni.id} />}
      {ni.NodeType.type === 'VISUALIZER' && <NodeTypeVisualizer ni={ni} nodeId={ni.id} />}
    </div>
  ));
};
