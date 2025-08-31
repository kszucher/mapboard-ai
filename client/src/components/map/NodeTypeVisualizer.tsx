import { Box, Flex, TextArea } from '@radix-ui/themes';
import React from 'react';
import { useDispatch } from 'react-redux';
import { MapOpType } from '../../../../shared/src/api/api-types-map.ts';
import { getNodeSelfH, getNodeSelfW } from '../../../../shared/src/map/getters/map-queries.ts';
import { N } from '../../../../shared/src/map/state/map-consts-and-types.ts';
import { api, useGetMapInfoQuery } from '../../data/api.ts';
import { actions } from '../../data/reducer.ts';
import { AppDispatch } from '../../data/store.ts';

export const NodeTypeVisualizer = ({ nodeId, ni }: { nodeId: number; ni: N }) => {
  const mapId = useGetMapInfoQuery().data?.mapInfo.id;
  const dispatch = useDispatch<AppDispatch>();

  const x = { nodeId, ni };
  if (!x) {
    window.alert('missing props');
  }

  return (
    <React.Fragment>
      <Box position="absolute" top="7" mt="2" ml="2" pt="2" pl="2" className="pointer-events-auto">
        <Flex direction="column" gap="4" align="start" content="center">
          <TextArea
            placeholder="Type Here…"
            color="gray"
            variant="soft"
            style={{
              width: getNodeSelfW(ni) - 40,
              minHeight: getNodeSelfH(ni) - 70,
              outline: 'none',
              pointerEvents: 'auto',
            }}
            value={ni.visualizerInputText ?? ''}
            onChange={e => {
              dispatch(actions.updateNodeOptimistic({ nodeId, attributes: { visualizerInputText: e.target.value } }));
              dispatch(
                api.endpoints.updateMap.initiate({
                  mapId: mapId!,
                  mapOp: {
                    type: MapOpType.UPDATE_NODE,
                    payload: {
                      nodeId,
                      data: { visualizerInputText: e.target.value },
                    },
                  },
                })
              );
            }}
          />
        </Flex>
      </Box>
    </React.Fragment>
  );
};
