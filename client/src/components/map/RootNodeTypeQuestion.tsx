import { Box, Flex, TextArea } from '@radix-ui/themes';
import React from 'react';
import { useDispatch } from 'react-redux';
import { N } from '../../../../shared/src/map/state/map-types.ts';
import { actions } from '../../data/reducer.ts';
import { AppDispatch } from '../../data/store.ts';

export const RootNodeTypeQuestion = ({ nodeId, ni }: { nodeId: string; ni: N }) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <React.Fragment>
      <Box position="absolute" top="7" mt="2" ml="3" pt="2" pl="2" className="pointer-events-auto">
        <Flex direction="column" gap="4" align="start" content="center">
          <TextArea
            placeholder="Type Here…"
            color="gray"
            variant="soft"
            style={{
              width: ni.selfW - 38,
              minHeight: 210,
              outline: 'none',
              pointerEvents: 'auto',
            }}
            value={ni.context ?? ''}
            onChange={e => {
              dispatch(actions.setNodeAttributes({ nodeId, attributes: { context: e.target.value } }));
            }}
          />
        </Flex>
      </Box>
    </React.Fragment>
  );
};
