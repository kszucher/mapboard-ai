import { Box, Flex, TextArea } from '@radix-ui/themes';
import React from 'react';
import { useSelector } from 'react-redux';
import { R } from '../../../../shared/src/map/state/map-types.ts';
import { RootState } from '../../data/store.ts';

export const RootNodeTypeLlm = ({ nodeId, ri }: { nodeId: string; ri: R }) => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);

  return (
    <React.Fragment>
      <Box position="absolute" top="7" mt="2" ml="3" pt="2" pl="2" className="pointer-events-auto">
        <Flex direction="column" gap="4" align="start" content="center">
          <TextArea
            disabled
            placeholder=""
            color="gray"
            variant="soft"
            style={{
              width: ri.selfW - 38,
              minHeight: 220,
              outline: 'none',
              pointerEvents: 'auto',
            }}
            value={m.r[nodeId].llmHash}
            onChange={() => {}}
          />

          <Flex direction="row" gap="4" align="start" content="center"></Flex>
        </Flex>
      </Box>
    </React.Fragment>
  );
};
