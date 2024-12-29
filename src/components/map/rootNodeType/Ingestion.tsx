import { Badge, Box, Button, DropdownMenu, Flex, IconButton, Spinner, Text } from '@radix-ui/themes';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../../data/clientSide/Reducer.ts';
import { getInputNode, getInputNodes } from '../../../data/clientSide/mapGetters/MapQueries.ts';
import { R } from '../../../data/clientSide/mapState/MapStateTypes.ts';
import { api } from '../../../data/serverSide/Api.ts';
import { AppDispatch, RootState } from '../../../data/store.ts';
import Dots from '../../../../assets/dots.svg?react';

export const Ingestion = ({ ri }: { ri: R }) => {
  const mapId = useSelector((state: RootState) => state.editor.mapId);
  const m = useSelector((state: RootState) => state.editor.commitList[state.editor.commitIndex]);
  const inputNode = getInputNode(m, ri.nodeId);
  const [ingestion, { isError, reset }] = api.useExecuteIngestionMutation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isError) {
      reset();
      dispatch(actions.setRAttributes({ nodeId: ri.nodeId, attributes: { isProcessing: false } }));
    }
  }, [isError]);

  return (
    <React.Fragment>
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
      <Box position="absolute" top="0" left="0" pt="2" pl="2">
        <Flex direction="row" gap="2" align="start" content="center">
          <Badge color="gray" size="2">
            {ri.path.join('').toUpperCase()}
          </Badge>
          <Badge color="cyan" size="2">
            Ingestion
          </Badge>
        </Flex>
      </Box>
      <Box position="absolute" top="7" mt="2" ml="2" pt="2" pl="2" className="pointer-events-auto">
        <Flex direction="column" gap="2" align="start" content="center">
          <Text size="2">{`Inputs: ${getInputNodes(m, ri.nodeId)?.map(ri => ri.path.join('').toUpperCase())}`}</Text>

          {inputNode && inputNode.fileHash && !ri.isProcessing && !ri.ingestionHash && (
            <Button
              size="1"
              radius="full"
              color="gray"
              onClick={() => {
                dispatch(actions.setRAttributes({ nodeId: ri.nodeId, attributes: { isProcessing: true } }));
                ingestion({
                  mapId,
                  nodeId: ri.nodeId,
                });
              }}
            >
              {'Ingest File'}
            </Button>
          )}

          {ri.isProcessing && !ri.ingestionHash && <Spinner size="3" />}
        </Flex>
      </Box>
    </React.Fragment>
  );
};
