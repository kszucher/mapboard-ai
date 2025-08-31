import { Box, Flex, Select, Text, TextArea } from '@radix-ui/themes';
import React from 'react';
import { useDispatch } from 'react-redux';
import { MapOpType } from '../../../../shared/src/api/api-types-map.ts';
import { getNodeSelfW } from '../../../../shared/src/map/getters/map-queries.ts';
import { N } from '../../../../shared/src/map/state/map-consts-and-types.ts';
import { api, useGetMapInfoQuery } from '../../data/api.ts';
import { actions } from '../../data/reducer.ts';
import { AppDispatch } from '../../data/store.ts';

export const NodeTypeLlm = ({ nodeId, ni }: { nodeId: string; ni: N }) => {
  const mapId = useGetMapInfoQuery().data?.mapInfo.id;
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
              dispatch(
                actions.updateNodeOptimistic({
                  nodeId,
                  attributes: { llmInstructions: e.target.value },
                })
              );
              dispatch(
                api.endpoints.updateMap.initiate({
                  mapId: mapId!,
                  mapOp: {
                    type: MapOpType.UPDATE_NODE,
                    payload: {
                      nodeId,
                      data: { llmInstructions: e.target.value },
                    },
                  },
                })
              );
            }}
          />
          <Text size="2">{`Output Schema`}</Text>
          <Select.Root size="1" defaultValue="Text">
            <Select.Trigger variant={'soft'} color={'gray'} />
            <Select.Content>
              <Select.Item value="Text">Text</Select.Item>
              <Select.Item value="Vector Database Query">Vector Database Query</Select.Item>
              <Select.Item value="Data Frame Query">Data Frame Query</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Box>
    </React.Fragment>
  );
};
