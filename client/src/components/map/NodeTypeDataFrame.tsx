import { Box, Button, Flex, Text } from '@radix-ui/themes';
import React from 'react';
import { N } from '../../../../shared/src/api/api-types-node.ts';

export const NodeTypeDataFrame = ({ nodeId, ni }: { nodeId: number; ni: N }) => {
  const x = { nodeId, ni };
  if (!x) {
    window.alert('missing props');
  }

  return (
    <React.Fragment>
      <Box position="absolute" top="7" mt="2" ml="2" pt="2" pl="2" className="pointer-events-auto">
        <Flex direction="column" gap="2" align="start" content="center">
          <Text size="2">{`Input Data`}</Text>
          <Button size="1" color="gray" onClick={() => {}}>
            {'Show'}
          </Button>
        </Flex>
      </Box>
    </React.Fragment>
  );
};
