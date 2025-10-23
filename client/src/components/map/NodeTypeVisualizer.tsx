import { Box, Flex, TextArea } from '@radix-ui/themes';
import React from 'react';
import { N } from '../../../../shared/src/api/api-types-node.ts';
import { getNodeHeight, getNodeWidth } from '../../../../shared/src/map/map-getters.ts';

export const NodeTypeVisualizer = ({ nodeId, ni }: { nodeId: number; ni: N }) => {
  const x = { nodeId, ni };
  if (!x) {
    window.alert('missing props');
  }

  return (
    <React.Fragment>
      <Box position="absolute" top="7" mt="2" ml="2" pt="2" pl="2" className="pointer-events-auto">
        <Flex direction="column" gap="4" align="start" content="center">
          <TextArea
            placeholder="Type Here…"
            color="gray"
            variant="soft"
            disabled={true}
            style={{
              width: getNodeWidth(ni) - 40,
              minHeight: getNodeHeight(ni) - 70,
              outline: 'none',
              pointerEvents: 'auto',
            }}
            value={ni.visualizerOutputText ?? ''}
          />
        </Flex>
      </Box>
    </React.Fragment>
  );
};
