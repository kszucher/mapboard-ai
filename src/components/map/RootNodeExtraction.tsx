import { Badge, Box, Button, Flex, Text, TextArea } from '@radix-ui/themes';
import React from 'react';
import { useSelector } from 'react-redux';
import { getInputNodes } from '../../data/clientSide/mapGetters/MapQueries.ts';
import { R } from '../../data/clientSide/mapState/MapStateTypes.ts';
import { RootState } from '../../data/store.ts';

export const RootNodeExtraction = ({ ri }: { ri: R }) => {
  const m = useSelector((state: RootState) => state.editor.commitList[state.editor.commitIndex]);

  return (
    <React.Fragment>
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
          <Text size="2">{`Inputs: ${getInputNodes(m, ri.nodeId)?.map(ri => ri.path.join('').toUpperCase())}`}</Text>

          <TextArea
            placeholder="Your Prompt…"
            color="gray"
            variant="soft"
            style={{
              width: ri.selfW - 32,
              minHeight: 100,
              outline: 'none',
              pointerEvents: 'auto',
            }}
          />

          <Flex direction="row" gap="4" align="start" content="center">
            {!ri.extractionHash && (
              <Button
                size="1"
                radius="full"
                color="gray"
                onClick={() => {
                  console.log('Show Raw Prompt');
                }}
              >
                {'Show Raw Prompt'}
              </Button>
            )}

            {!ri.extractionHash && (
              <Button
                size="1"
                radius="full"
                color="gray"
                onClick={() => {
                  console.log('Start');
                }}
              >
                {'Start'}
              </Button>
            )}
          </Flex>
        </Flex>
      </Box>
    </React.Fragment>
  );
};
