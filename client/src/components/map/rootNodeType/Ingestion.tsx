import { Badge, Box, DropdownMenu, Flex, IconButton, Spinner, Text } from '@radix-ui/themes';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInputR } from '../../../../../shared/src/map/getters/map-queries.ts';
import { R } from '../../../../../shared/src/map/state/map-types.ts';
import Dots from '../../../../assets/dots.svg?react';
import { actions } from '../../../data/reducer.ts';
import { AppDispatch, RootState } from '../../../data/store.ts';

export const Ingestion = ({ nodeId, ri }: { nodeId: string; ri: R }) => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const inputNode = Object.values(getInputR(m, nodeId))[0];
  const dispatch = useDispatch<AppDispatch>();

  return (
    <React.Fragment>
      <Box position="absolute" top="0" left="0" pt="2" pl="2">
        <Flex direction="row" gap="2" align="start" content="center">
          <Badge color="gray" size="2">
            {'R' + ri.iid}
          </Badge>
          <Badge color="cyan" size="2">
            {'Ingestion'}
          </Badge>
          {ri.isProcessing && <Spinner m="1" />}
        </Flex>
      </Box>

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
                dispatch(actions.deleteLR({ nodeId }));
              }}
            >
              {'Delete'}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Box>

      <Box position="absolute" top="7" mt="2" ml="2" pt="2" pl="2" className="pointer-events-auto">
        <Flex direction="column" gap="2" align="start" content="center">
          <Text size="2">{`Input: ${'R' + inputNode?.iid}`}</Text>
        </Flex>
      </Box>
    </React.Fragment>
  );
};
