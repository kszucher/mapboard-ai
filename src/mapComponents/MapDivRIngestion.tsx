import { Badge, Button, Flex, IconButton, Spinner } from '@radix-ui/themes';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../editorMutations/EditorMutations.ts';
import { mSelector } from '../editorQueries/EditorQueries.ts';
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
      <div className="absolute top-0 left-0 pt-2 pl-2.5">
        <Flex direction="row" gap="2" align="start" content="center">
          <Badge color="gray" size="2">
            {ri.path.join('').toUpperCase()}
          </Badge>
          <Badge color="cyan" size="2">
            Ingestion
          </Badge>
        </Flex>
      </div>
      <div className="absolute top-0 right-0 pt-2 pr-2.5">
        <IconButton variant="solid" size="1" color="gray"></IconButton>
      </div>
      <div className="absolute top-10 mt-2 ml-2 pt-2 pl-2 bg-[var(--gray-a2)] w-[calc(100%-24px)] h-[calc(100%-64px)] rounded-md pointer-events-auto">
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
