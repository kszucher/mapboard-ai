import { Box, Flex, Text } from '@radix-ui/themes';
import React from 'react';
import { useSelector } from 'react-redux';
import { getInputR } from '../../../../../shared/src/map/getters/map-queries.ts';
import { R } from '../../../../../shared/src/map/state/map-types.ts';
import { RootState } from '../../../data/store.ts';

export const Ingestion = ({ nodeId, ri }: { nodeId: string; ri: R }) => {
  const x = { nodeId, ri };
  if (!x) {
    window.alert('missing props');
  }

  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const inputNode = Object.values(getInputR(m, nodeId))[0];

  return (
    <React.Fragment>
      <Box position="absolute" top="7" mt="2" ml="2" pt="2" pl="2" className="pointer-events-auto">
        <Flex direction="column" gap="2" align="start" content="center">
          <Text size="2">{`Input: ${'R' + inputNode?.iid}`}</Text>
        </Flex>
      </Box>
    </React.Fragment>
  );
};
