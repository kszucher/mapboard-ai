import { Box, Button, Flex, Text } from '@radix-ui/themes';
import React from 'react';
import { N } from '../../../../shared/src/map/state/map-consts-and-types.ts';

export const NodeTypeDataFrame = ({ nodeId, ni }: { nodeId: string; ni: N }) => {
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
