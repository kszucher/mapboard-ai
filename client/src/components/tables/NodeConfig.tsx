import { Badge, Button, Select, Table } from '@radix-ui/themes';
import { useState } from 'react';
import { Color, defaultMapConfig, MapNodeConfig } from '../../../../shared/src/api/api-types-map-config.ts';
import { useGetMapConfigInfoQuery } from '../../data/api.ts';
import { MapNodeFieldConfig } from '../popovers/MapNodeFieldConfig.tsx';

export const NodeConfig = () => {
  const { mapNodeConfigs } = useGetMapConfigInfoQuery().data || defaultMapConfig;
  const emptyNodeConfig: Partial<MapNodeConfig> = { type: '', label: '', color: Color.gray, w: 0, h: 0 };
  const [newNodeConfig, setNewNodeConfig] = useState(emptyNodeConfig);

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
        {mapNodeConfigs?.map(el => (
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
              <MapNodeFieldConfig nodeConfig={el} />
            </Table.Cell>
            <Table.Cell>
              <Button size="1" variant="solid" onClick={() => {}}>
                {'Remove'}
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
        <Table.Row key={'add'}>
          <Table.Cell>{newNodeConfig.type}</Table.Cell>
          <Table.Cell>{newNodeConfig.label}</Table.Cell>
          <Table.Cell>
            <Select.Root
              size="1"
              value={newNodeConfig.color}
              onValueChange={(value: Color) => setNewNodeConfig({ ...newNodeConfig, color: value })}
            >
              <Select.Trigger variant="soft" color={newNodeConfig.color} />
              <Select.Content>
                {Object.values(Color).map(color => (
                  <Select.Item key={color} value={color}>
                    {color}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Table.Cell>
          <Table.Cell>{newNodeConfig.w}</Table.Cell>
          <Table.Cell>{newNodeConfig.h}</Table.Cell>
          <Table.Cell>
            <MapNodeFieldConfig nodeConfig={newNodeConfig} />
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
