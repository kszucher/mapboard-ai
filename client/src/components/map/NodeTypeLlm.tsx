import { Box, Flex, Select, Text, TextArea } from '@radix-ui/themes';
import React from 'react';
import { useDispatch } from 'react-redux';
import { LlmOutputSchema, N } from '../../../../shared/src/api/api-types-node.ts';
import { getNodeWidth } from '../../../../shared/src/map/map-getters.ts';
import { api, useGetMapInfoQuery, useGetNodeTypeInfoQuery } from '../../data/api.ts';
import { actions } from '../../data/reducer.ts';
import { AppDispatch } from '../../data/store.ts';

export const NodeTypeLlm = ({ nodeId, ni }: { nodeId: number; ni: N }) => {
  const nodeTypes = useGetNodeTypeInfoQuery().data || [];
  const mapId = useGetMapInfoQuery().data?.id!;
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
              width: getNodeWidth(nodeTypes, ni) - 40,
              minHeight: 120,
              outline: 'none',
              pointerEvents: 'auto',
            }}
            value={ni.llmInstructions ?? ''}
            onChange={e => {
              dispatch(actions.updateNodeOptimistic({ node: { id: nodeId, llmInstructions: e.target.value } }));
              dispatch(
                api.endpoints.updateNode.initiate({
                  mapId,
                  nodeId,
                  nodeData: { llmInstructions: e.target.value },
                })
              );
            }}
          />
          <Text size="2">{`Output Schema`}</Text>
          <Select.Root
            size="1"
            value={ni.llmOutputSchema ?? LlmOutputSchema.TEXT}
            defaultValue={LlmOutputSchema.TEXT}
            onValueChange={(value: LlmOutputSchema) => {
              dispatch(actions.updateNodeOptimistic({ node: { id: nodeId, llmOutputSchema: value } }));
              dispatch(
                api.endpoints.updateNode.initiate({
                  mapId,
                  nodeId,
                  nodeData: { llmOutputSchema: value },
                })
              );
            }}
          >
            <Select.Trigger variant="soft" color="gray" />
            <Select.Content>
              {Object.values(LlmOutputSchema).map(value => (
                <Select.Item key={value} value={value}>
                  {value
                    .replace(/_/g, ' ')
                    .toLowerCase()
                    .replace(/\b\w/g, c => c.toUpperCase())}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
      </Box>
    </React.Fragment>
  );
};
