import { Box, Button, Flex, Text, TextArea } from '@radix-ui/themes';
import React from 'react';
import { useDispatch } from 'react-redux';
import { getNodeSelfW } from '../../../../shared/src/map/getters/map-queries.ts';
import { N } from '../../../../shared/src/map/state/map-consts-and-types.ts';
import { actions } from '../../data/reducer.ts';
import { AppDispatch } from '../../data/store.ts';

export const NodeTypeLlm = ({ nodeId, ni }: { nodeId: string; ni: N }) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <React.Fragment>
      <Box position="absolute" top="7" mt="2" ml="3" pt="2" pl="2" className="pointer-events-auto">
        <Flex direction="column" gap="2" align="start" content="center">
          <Text size="2">{`Instructions`}</Text>
          <TextArea
            placeholder=""
            color="gray"
            variant="soft"
            style={{
              width: getNodeSelfW(ni) - 40,
              minHeight: 120,
              outline: 'none',
              pointerEvents: 'auto',
            }}
            value={ni.llmInstructions ?? ''}
            onChange={e => {
              dispatch(actions.setNodeAttributes({ nodeId, attributes: { llmInstructions: e.target.value } }));
            }}
          />
          <Text size="2">{`Output Schema`}</Text>
          <Button size="1" color="gray" onClick={() => {}}>
            {'Show'}
          </Button>
        </Flex>
      </Box>
    </React.Fragment>
  );
};
