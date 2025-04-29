import { Badge, Box, Button, DropdownMenu, Flex, IconButton, Spinner, Text } from '@radix-ui/themes';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInputNode } from '../../../../../shared/src/map/getters/map-queries.ts';
import { R } from '../../../../../shared/src/map/state/map-types.ts';
import Dots from '../../../../assets/dots.svg?react';
import { api, useGetMapInfoQuery } from '../../../data/api.ts';
import { actions } from '../../../data/reducer.ts';
import { AppDispatch, RootState } from '../../../data/store.ts';

export const Ingestion = ({ ri }: { ri: R }) => {
  const mapId = useGetMapInfoQuery().data?.mapInfo.id;
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const inputNode = getInputNode(m, ri.nodeId);
  const [executeIngestion, { isError, reset }] = api.useExecuteIngestionMutation();
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
          <Text size="2">{`Inputs: ${inputNode?.path.join('').toUpperCase()}`}</Text>

          {inputNode && inputNode.fileHash && !ri.isProcessing && !ri.ingestionHash && (
            <Button
              size="1"
              radius="full"
              color="gray"
              onClick={() => {
                dispatch(actions.setRAttributes({ nodeId: ri.nodeId, attributes: { isProcessing: true } }));
                mapId &&
                  executeIngestion({
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
