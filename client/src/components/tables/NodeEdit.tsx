import { Badge, Button, Select, Table } from '@radix-ui/themes';
import { useState } from 'react';
import { Color, NodeType } from '../../../../shared/src/api/api-types-node-type.ts';
import { useGetNodeTypeInfoQuery } from '../../data/api.ts';
import { NodeConfigType } from '../popovers/NodeConfigType.tsx';

export const NodeEdit = () => {
  const nodeTypes = useGetNodeTypeInfoQuery().data || [];
  const emptyNodeType: Partial<NodeType> = { type: '', label: '', color: Color.gray, w: 0, h: 0 };
  const [newNodeType, setNewNodeType] = useState(emptyNodeType);

  return (
    <Table.Root size={'1'}>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>{'Type'}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{'Label'}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{'Color'}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{'Width'}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{'Height'}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{'Fields'}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{'Action'}</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {nodeTypes?.map(el => (
          <Table.Row key={el.id}>
            <Table.Cell>{el.type}</Table.Cell>
            <Table.Cell>{el.label}</Table.Cell>
            <Table.Cell>
              <Badge color={el.color} size="1">
                {el.color}
              </Badge>
            </Table.Cell>
            <Table.Cell>{el.w}</Table.Cell>
            <Table.Cell>{el.h}</Table.Cell>
            <Table.Cell>
              <NodeConfigType nodeType={el} />
            </Table.Cell>
            <Table.Cell>
              <Button size="1" variant="solid" onClick={() => {}}>
                {'Remove'}
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
        <Table.Row key={'add'}>
          <Table.Cell>{newNodeType.type}</Table.Cell>
          <Table.Cell>{newNodeType.label}</Table.Cell>
          <Table.Cell>
            <Select.Root
              size="1"
              value={newNodeType.color}
              onValueChange={(value: Color) => setNewNodeType({ ...newNodeType, color: value })}
            >
              <Select.Trigger variant="soft" color={newNodeType.color} />
              <Select.Content>
                {Object.values(Color).map(color => (
                  <Select.Item key={color} value={color}>
                    {color}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Table.Cell>
          <Table.Cell>{newNodeType.w}</Table.Cell>
          <Table.Cell>{newNodeType.h}</Table.Cell>
          <Table.Cell>
            <NodeConfigType nodeType={newNodeType} />
          </Table.Cell>
          <Table.Cell>
            <Button size="1" variant="solid" color="gray" onClick={() => {}}>
              {'Add'}
            </Button>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
};
