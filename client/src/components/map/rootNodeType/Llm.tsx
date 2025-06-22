import { Box, DropdownMenu, Flex, IconButton, Text, TextArea } from '@radix-ui/themes';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInputR } from '../../../../../shared/src/map/getters/map-queries.ts';
import { R } from '../../../../../shared/src/map/state/map-types.ts';
import Dots from '../../../../assets/dots.svg?react';
import { actions } from '../../../data/reducer.ts';
import { AppDispatch, RootState } from '../../../data/store.ts';

export const Llm = ({ nodeId, ri }: { nodeId: string; ri: R }) => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const inputNodes = getInputR(m, nodeId);
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
                dispatch(actions.deleteLR({ nodeId }));
              }}
            >
              {'Delete'}
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={() => {
                dispatch(
                  actions.setRAttributes({
                    nodeId,
                    attributes: { isProcessing: false },
                  })
                );
              }}
            >
              {'Reset'}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Box>

      <Box position="absolute" top="7" mt="2" ml="2" pt="2" pl="2" className="pointer-events-auto">
        <Flex direction="column" gap="4" align="start" content="center">
          <Text size="2">{`Inputs: ${Object.values(inputNodes).map(ri => 'R' + ri.iid)}`}</Text>

          <TextArea
            disabled
            placeholder=""
            color="gray"
            variant="soft"
            style={{
              width: ri.selfW - 32,
              minHeight: 180,
              outline: 'none',
              pointerEvents: 'auto',
            }}
            value={'test text'}
            onChange={() => {}}
          />

          <Flex direction="row" gap="4" align="start" content="center"></Flex>
        </Flex>
      </Box>
    </React.Fragment>
  );
};
