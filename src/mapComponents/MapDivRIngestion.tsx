import { Badge, Button, Flex, IconButton, Spinner } from '@radix-ui/themes';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../editorMutations/EditorMutations.ts';
import { mSelector } from '../editorQueries/EditorQueries.ts';
import { R_PADDING } from '../mapConsts/MapConsts.ts';
import { getInputNode } from '../mapQueries/MapQueries.ts';
import { R } from '../mapState/MapStateTypes.ts';
import { api, AppDispatch, RootState } from '../rootComponent/RootComponent.tsx';

export const MapDivRIngestion = ({ ri }: { ri: R }) => {
  const mapId = useSelector((state: RootState) => state.editor.mapId);
  const m = useSelector((state: RootState) => mSelector(state));
  const inputNode = getInputNode(m, ri.nodeId);
  const [ingestion, { isError, reset }] = api.useIngestionMutation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isError) {
      reset();
      dispatch(actions.setIsProcessing({ nodeId: ri.nodeId, value: false }));
    }
  }, [isError]);

  return (
    <React.Fragment>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          paddingTop: 8,
          paddingLeft: 10,
        }}
      >
        <Flex direction="row" gap="2" align="start" content="center">
          <Badge color="gray" size="2">
            {ri.path.join('').toUpperCase()}
          </Badge>
          <Badge color="cyan" size="2">
            Ingestion
          </Badge>
        </Flex>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          paddingTop: 8,
          paddingRight: 10,
        }}
      >
        <IconButton variant="solid" size="1" color="gray"></IconButton>
      </div>
      <div
        style={{
          position: 'absolute',
          top: R_PADDING,
          marginLeft: 10,
          marginTop: 10,
          paddingTop: 10,
          paddingLeft: 10,
          background: '#333333',
          width: ri.selfW - 30,
          height: ri.selfH - R_PADDING - 30,
          borderRadius: 8,
          pointerEvents: 'auto',
        }}
      >
        <Flex direction="column" gap="2" align="start" content="center">
          {inputNode && inputNode.fileHash && !ri.isProcessing && !ri.ingestionHash && (
            <Button
              size="1"
              radius="full"
              color="gray"
              onClick={() => {
                dispatch(actions.setIsProcessing({ nodeId: ri.nodeId, value: true }));
                ingestion({
                  mapId,
                  nodeId: ri.nodeId,
                  fileHash: inputNode?.fileHash || '',
                });
              }}
            >
              {'Ingest File'}
            </Button>
          )}

          {ri.isProcessing && !ri.ingestionHash && <Spinner size="3" />}

          {ri.ingestionHash && (
            <Button
              size="1"
              radius="full"
              color="gray"
              onClick={() => {
                console.log('Show Ingestion');
              }}
            >
              {'Show Ingestion'}
            </Button>
          )}
        </Flex>
      </div>
    </React.Fragment>
  );
};
