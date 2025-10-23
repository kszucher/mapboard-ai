import { Badge, Button, Select, Table } from '@radix-ui/themes';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Color } from '../../../../shared/src/api/api-types-node-type.ts';
import { api, useGetEdgeTypeInfoQuery, useGetNodeTypeInfoQuery } from '../../data/api.ts';
import { AppDispatch } from '../../data/store.ts';

export const EdgeEdit = () => {
  const nodeTypes = useGetNodeTypeInfoQuery().data || [];
  const edgeTypes = useGetEdgeTypeInfoQuery().data || [];
  const emptyEdgeType = { fromNodeTypeId: NaN, toNodeTypeId: NaN, schema: '' };
  const [newEdgeType, setNewEdgeType] = useState(emptyEdgeType);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Table.Root size={'1'}>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>{'Source Node'}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{'Target Node'}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{'Schema'}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{'Action'}</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {edgeTypes?.map(el => (
          <Table.Row key={el.id}>
            <Table.Cell>
              <Badge color="gray">{el.FromNodeType?.type}</Badge>
            </Table.Cell>
            <Table.Cell>
              <Badge color="gray">{el.ToNodeType?.type}</Badge>
            </Table.Cell>
            <Table.Cell>{'schema'}</Table.Cell>
            <Table.Cell>
              <Button size="1" variant="solid" onClick={() => {}}>
                {'Remove'}
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
        <Table.Row key={'add'}>
          <Table.Cell>
            <Select.Root
              size="1"
              value={newEdgeType.fromNodeTypeId ? newEdgeType.fromNodeTypeId.toString() : ''}
              onValueChange={id => setNewEdgeType({ ...newEdgeType, fromNodeTypeId: Number(id) })}
            >
              <Select.Trigger
                variant="soft"
                color={nodeTypes?.find(el => el.id === newEdgeType.fromNodeTypeId)?.color || Color.gray}
              />
              <Select.Content>
                {nodeTypes?.map(el => (
                  <Select.Item key={el.id} value={el.id?.toString() || ''}>
                    {el.type}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Table.Cell>
          <Table.Cell>
            <Select.Root
              size="1"
              value={newEdgeType.toNodeTypeId ? newEdgeType.toNodeTypeId.toString() : ''}
              onValueChange={id => setNewEdgeType({ ...newEdgeType, toNodeTypeId: Number(id) })}
            >
              <Select.Trigger
                variant="soft"
                color={nodeTypes?.find(el => el.id === newEdgeType.toNodeTypeId)?.color || Color.gray}
              />
              <Select.Content>
                {nodeTypes?.map(el => (
                  <Select.Item key={el.id} value={el.id?.toString() || ''}>
                    {el.type}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Table.Cell>
          <Table.Cell>{''}</Table.Cell>
          <Table.Cell>
            <Button
              size="1"
              variant="solid"
              color="gray"
              onClick={() => {
                console.log(newEdgeType);
                if (!isNaN(newEdgeType.fromNodeTypeId) && !isNaN(newEdgeType.toNodeTypeId)) {
                  dispatch(api.endpoints.createEdgeType.initiate(newEdgeType));
                }
              }}
            >
              {'Add'}
            </Button>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
};
