import { Box, Flex, TextArea } from '@radix-ui/themes';
import React from 'react';
import { R } from '../../../../../shared/src/map/state/map-types.ts';

export const Question = ({ nodeId, ri }: { nodeId: string; ri: R }) => {
  const x = { nodeId, ri };
  if (!x) {
    window.alert('missing props');
  }

  return (
    <React.Fragment>
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
