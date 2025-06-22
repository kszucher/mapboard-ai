import { Badge, Box, DropdownMenu, Flex, IconButton, Spinner, TextArea } from '@radix-ui/themes';
import React from 'react';
import { useDispatch } from 'react-redux';
import { R } from '../../../../../shared/src/map/state/map-types.ts';
import Dots from '../../../../assets/dots.svg?react';
import { actions } from '../../../data/reducer.ts';
import { AppDispatch } from '../../../data/store.ts';

export const Question = ({ nodeId, ri }: { nodeId: string; ri: R }) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <React.Fragment>
      <Box position="absolute" top="0" left="0" pt="2" pl="2">
        <Flex direction="row" gap="2" align="start" content="center">
          <Badge color="gray" size="2">
            {'R' + ri.iid}
          </Badge>
          <Badge color="lime" size="2">
            {'Question'}
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
        <Flex direction="column" gap="4" align="start" content="center">
          <TextArea
            disabled={false}
            color="gray"
            variant="soft"
            style={{
              width: ri.selfW - 32,
              minHeight: 210,
              outline: 'none',
              pointerEvents: 'auto',
            }}
            value={'test question'}
            onChange={() => {}}
          />
        </Flex>
      </Box>
    </React.Fragment>
  );
};
