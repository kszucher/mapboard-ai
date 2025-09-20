import { Box, Flex } from '@radix-ui/themes';
import React from 'react';
import { N } from '../../../../shared/src/api/api-types-map-node.ts';

export const NodeTypeVectorDatabase = ({ nodeId, ni }: { nodeId: number; ni: N }) => {
  const x = { nodeId, ni };
  if (!x) {
    window.alert('missing props');
  }

  return (
    <React.Fragment>
      <Box position="absolute" top="7" mt="2" ml="2" pt="2" pl="2" className="pointer-events-auto">
        <Flex direction="column" gap="4" align="start" content="center"></Flex>
      </Box>
    </React.Fragment>
  );
};
