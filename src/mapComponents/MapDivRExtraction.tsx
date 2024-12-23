import { Badge, Box, Button, Flex, TextArea } from '@radix-ui/themes';
import React from 'react';
import { R } from '../mapState/MapStateTypes.ts';

export const MapDivRExtraction = ({ ri }: { ri: R }) => {
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

          {!ri.extractionHash && (
            <Button
              size="1"
              radius="full"
              color="gray"
              onClick={() => {
                console.log('Start Extraction');
              }}
            >
              {'Start'}
            </Button>
          )}
        </Flex>
      </Box>
    </React.Fragment>
  );
};
