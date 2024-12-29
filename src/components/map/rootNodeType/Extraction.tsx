import { Badge, Box, Button, Dialog, DropdownMenu, Flex, IconButton, Spinner, Text, TextArea } from '@radix-ui/themes';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInputNodes } from '../../../data/clientSide/mapGetters/MapQueries.ts';
import { R } from '../../../data/clientSide/mapState/MapStateTypes.ts';
import { actions } from '../../../data/clientSide/Reducer.ts';
import { api } from '../../../data/serverSide/Api.ts';
import { AppDispatch, RootState } from '../../../data/store.ts';
import Dots from '../../../../assets/dots.svg?react';

export const Extraction = ({ ri }: { ri: R }) => {
  const mapId = useSelector((state: RootState) => state.editor.mapId);
  const m = useSelector((state: RootState) => state.editor.commitList[state.editor.commitIndex]);
  const inputNodes = getInputNodes(m, ri.nodeId);
  const [extraction, { isError, reset }] = api.useExecuteExtractionMutation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isError) {
      reset();
      dispatch(actions.setIsProcessing({ nodeId: ri.nodeId, isProcessing: false }));
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
          <Badge color="jade" size="2">
            {'Extraction'}
          </Badge>
        </Flex>
      </Box>
      <Box position="absolute" top="7" mt="2" ml="2" pt="2" pl="2" className="pointer-events-auto">
        <Flex direction="column" gap="4" align="start" content="center">
          <Text size="2">{`Inputs: ${inputNodes?.map(ri => ri.path.join('').toUpperCase())}`}</Text>

          <TextArea
            disabled={ri.extractionHash !== ''}
            placeholder="Your Prompt…"
            color="gray"
            variant="soft"
            style={{
              width: ri.selfW - 32,
              minHeight: 140,
              outline: 'none',
              pointerEvents: 'auto',
            }}
            value={ri.extractionPrompt}
            onChange={e => {
              dispatch(actions.setExtractionPrompt({ nodeId: ri.nodeId, extractionPrompt: e.target.value }));
            }}
          />

          <Flex direction="row" gap="4" align="start" content="center">
            {inputNodes?.length !== 0 && !ri.isProcessing && (
              <Dialog.Trigger>
                <Button
                  size="1"
                  radius="full"
                  color="gray"
                  onClick={() => {
                    dispatch(actions.setIsProcessing({ nodeId: ri.nodeId, isProcessing: true }));
                    extraction({
                      mapId,
                      nodeId: ri.nodeId,
                    });
                  }}
                >
                  {'Execute Prompt'}
                </Button>
              </Dialog.Trigger>
            )}

            {ri.isProcessing && !ri.extractionHash && <Spinner size="3" />}
          </Flex>
        </Flex>
      </Box>
    </React.Fragment>
  );
};
