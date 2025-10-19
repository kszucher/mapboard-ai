import { Button, Select, Table } from '@radix-ui/themes';
import { useState } from 'react';
import {
  MapNodeConfig,
  MapNodeFieldConfig,
  MapNodeFieldType,
} from '../../../../shared/src/api/api-types-map-config.ts';

export const NodeFieldConfig = ({ nodeConfig }: { nodeConfig: Partial<MapNodeConfig> }) => {
  const emptyFieldConfig: Partial<MapNodeFieldConfig> = { type: '', label: '' };
  const [fieldConfig, setFieldConfig] = useState(emptyFieldConfig);

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Label</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Options</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <Table.Row>
          <Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>
          <Table.Cell>danilo@example.com</Table.Cell>
          <Table.Cell>Developer</Table.Cell>
          <Table.Cell>
            <Button size="1" variant="solid" onClick={() => {}}>
              {'Remove'}
            </Button>
          </Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.RowHeaderCell>
            <Select.Root size="1" value={'TEXT'} onValueChange={(value: MapNodeFieldType) => {}}>
              <Select.Trigger variant="soft" color="gray" />
              <Select.Content>
                {Object.values(MapNodeFieldType).map(mapNodeInputType => (
                  <Select.Item key={mapNodeInputType} value={mapNodeInputType}>
                    {mapNodeInputType}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Table.RowHeaderCell>
          <Table.Cell>zahra@example.com</Table.Cell>
          <Table.Cell>Admin</Table.Cell>
          <Table.Cell>
            {' '}
            <Button size="1" variant="solid" color="gray" onClick={() => {}}>
              {'Add'}
            </Button>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
};
