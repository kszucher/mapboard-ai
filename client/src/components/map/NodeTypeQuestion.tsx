import { Box, Flex, TextArea } from '@radix-ui/themes';
import React from 'react';
import { useDispatch } from 'react-redux';
import { defaultMapConfig } from '../../../../shared/src/api/api-types-map-config.ts';
import { getNodeHeight, getNodeWidth } from '../../../../shared/src/map/map-getters.ts';
import { N } from '../../../../shared/src/api/api-types-map-node.ts';
import { api, useGetMapConfigInfoQuery, useGetMapInfoQuery } from '../../data/api.ts';
import { actions } from '../../data/reducer.ts';
import { AppDispatch } from '../../data/store.ts';

export const NodeTypeQuestion = ({ nodeId, ni }: { nodeId: number; ni: N }) => {
  const { mapNodeConfigs } = useGetMapConfigInfoQuery().data || defaultMapConfig;
  const mapId = useGetMapInfoQuery().data?.id!;
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
              width: getNodeWidth(mapNodeConfigs, ni.MapNodeConfig.type) - 40,
              minHeight: getNodeHeight(mapNodeConfigs, ni.MapNodeConfig.type) - 70,
              outline: 'none',
              pointerEvents: 'auto',
            }}
            value={ni.questionOutputText ?? ''}
            onChange={e => {
              dispatch(actions.updateNodeOptimistic({ node: { id: nodeId, questionOutputText: e.target.value } }));
              dispatch(
                api.endpoints.updateNode.initiate({
                  mapId,
                  node: { id: nodeId, questionOutputText: e.target.value },
                })
              );
            }}
          />
        </Flex>
      </Box>
    </React.Fragment>
  );
};
