import { Badge, Box, Button, DropdownMenu, Flex, IconButton, Spinner, Text, TextArea } from '@radix-ui/themes';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInputNode } from '../../../../../shared/src/map/getters/map-queries.ts';
import { R } from '../../../../../shared/src/map/state/map-types.ts';
import Dots from '../../../../assets/dots.svg?react';
import { api, useGetMapInfoQuery } from '../../../data/api.ts';
import { actions } from '../../../data/reducer.ts';
import { AppDispatch, RootState } from '../../../data/store.ts';

export const TextOutput = ({ ri }: { ri: R }) => {
  const mapId = useGetMapInfoQuery().data?.mapInfo.id;
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const inputNode = getInputNode(m, ri.nodeId);
  const [executeTextOutput, { isError, reset }] = api.useExecuteTextOutputMutation();
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
          <Badge color="lime" size="2">
            {'Text Output'}
          </Badge>
        </Flex>
      </Box>
      <Box position="absolute" top="7" mt="2" ml="2" pt="2" pl="2" className="pointer-events-auto">
        <Flex direction="column" gap="4" align="start" content="center">
          <Text size="2">{`Input: ${inputNode?.path.join('').toUpperCase()}`}</Text>

          <Button
            disabled={!inputNode?.extractionHash || ri.textOutput !== ''}
            size="1"
            color="gray"
            onClick={() => {
              dispatch(actions.setRAttributes({ nodeId: ri.nodeId, attributes: { isProcessing: true } }));
              mapId && executeTextOutput({ mapId, nodeId: ri.nodeId });
            }}
          >
            {'Show'}
          </Button>

          {ri.isProcessing && !ri.textOutput && <Spinner size="3" />}

          <TextArea
            disabled={true}
            color="gray"
            variant="soft"
            style={{
              width: ri.selfW - 32,
              minHeight: 360,
              outline: 'none',
              pointerEvents: 'auto',
            }}
            value={ri.textOutput}
          />
        </Flex>
      </Box>
    </React.Fragment>
  );
};
