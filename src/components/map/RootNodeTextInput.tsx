import { Badge, Box, Flex, Text, TextArea } from '@radix-ui/themes';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInputNodes } from '../../data/clientSide/mapGetters/MapQueries.ts';
import { R } from '../../data/clientSide/mapState/MapStateTypes.ts';
import { actions } from '../../data/clientSide/Reducer.ts';
import { AppDispatch, RootState } from '../../data/store.ts';

export const RootNodeTextInput = ({ ri }: { ri: R }) => {
  const m = useSelector((state: RootState) => state.editor.commitList[state.editor.commitIndex]);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <React.Fragment>
      <Box position="absolute" top="0" left="0" pt="2" pl="2">
        <Flex direction="row" gap="2" align="start" content="center">
          <Badge color="gray" size="2">
            {ri.path.join('').toUpperCase()}
          </Badge>
          <Badge color="violet" size="2">
            {'Text Input'}
          </Badge>
        </Flex>
      </Box>
      <Box position="absolute" top="7" mt="2" ml="2" pt="2" pl="2" className="pointer-events-auto">
        <Flex direction="column" gap="4" align="start" content="center">
          <Text size="2">{`Text Input: ${getInputNodes(m, ri.nodeId)?.map(ri => ri.path.join('').toUpperCase())}`}</Text>
          <TextArea
            placeholder="Type Here…"
            color="gray"
            variant="soft"
            style={{
              width: ri.selfW - 32,
              minHeight: 100,
              outline: 'none',
              pointerEvents: 'auto',
            }}
            value={ri.textInput}
            onChange={e => {
              dispatch(actions.setTextInput({ nodeId: ri.nodeId, textInput: e.target.value }));
            }}
          />
        </Flex>
      </Box>
    </React.Fragment>
  );
};
