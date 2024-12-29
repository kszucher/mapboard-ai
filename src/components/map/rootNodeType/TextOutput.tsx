import { Badge, Box, DropdownMenu, Flex, IconButton, Text, TextArea } from '@radix-ui/themes';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInputNodes } from '../../../data/clientSide/mapGetters/MapQueries.ts';
import { R } from '../../../data/clientSide/mapState/MapStateTypes.ts';
import { actions } from '../../../data/clientSide/Reducer.ts';
import { AppDispatch, RootState } from '../../../data/store.ts';
import Dots from '../../../../assets/dots.svg?react';

export const TextOutput = ({ ri }: { ri: R }) => {
  const m = useSelector((state: RootState) => state.editor.commitList[state.editor.commitIndex]);
  const inputNodes = getInputNodes(m, ri.nodeId);
  const dispatch = useDispatch<AppDispatch>();

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
          <Text size="2">{`Inputs: ${inputNodes?.map(ri => ri.path.join('').toUpperCase())}`}</Text>
          <TextArea
            disabled={true}
            color="gray"
            variant="soft"
            style={{
              width: ri.selfW - 32,
              minHeight: 400,
              outline: 'none',
              pointerEvents: 'auto',
            }}
          />
        </Flex>
      </Box>
    </React.Fragment>
  );
};
