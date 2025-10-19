import { Button, Flex, Select, Table, Text, TextField } from '@radix-ui/themes';
import { useState } from 'react';
import {
  MapNodeConfig,
  MapNodeFieldConfig,
  MapNodeFieldType,
} from '../../../../shared/src/api/api-types-map-config.ts';

export const NodeFieldConfig = ({ nodeConfig }: { nodeConfig: Partial<MapNodeConfig> }) => {
  const emptyFieldConfig: Partial<MapNodeFieldConfig> = { type: '', label: '', selectOptions: [] };
  const [fieldConfig, setFieldConfig] = useState(emptyFieldConfig ?? nodeConfig);
  const [selectOption, setSelectOption] = useState('');

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
          <Table.RowHeaderCell>X</Table.RowHeaderCell>
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
            <Select.Root
              size="1"
              value={fieldConfig.type}
              onValueChange={(value: MapNodeFieldType) => {
                setFieldConfig({ ...fieldConfig, type: value });
              }}
            >
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
          <Table.Cell>
            <TextField.Root
              size={'1'}
              variant={'soft'}
              placeholder="label"
              radius={'large'}
              onChange={e => setFieldConfig({ ...fieldConfig, label: e.target.value })}
            ></TextField.Root>
          </Table.Cell>
          <Table.Cell>
            {fieldConfig.type === MapNodeFieldType.SELECT && (
              <Flex direction="column" gap="2" align="start" content="center">
                {fieldConfig.selectOptions?.map((el, i) => (
                  <Flex key={i} gap="2" align="start" content="center">
                    <Text as="div" size="2" mb="1">
                      {el}
                    </Text>
                    <Button
                      size="1"
                      variant="solid"
                      color="gray"
                      onClick={() => {
                        setFieldConfig({
                          ...fieldConfig,
                          selectOptions: fieldConfig.selectOptions?.filter((_, si) => si !== i),
                        });
                      }}
                    >
                      -
                    </Button>
                  </Flex>
                ))}
                <TextField.Root
                  size={'1'}
                  variant={'soft'}
                  placeholder="option"
                  radius={'large'}
                  value={selectOption}
                  onChange={e => setSelectOption(e.target.value)}
                />
                <Button
                  size="1"
                  variant="solid"
                  color="gray"
                  onClick={() => {
                    setFieldConfig({
                      ...fieldConfig,
                      selectOptions: [...(fieldConfig.selectOptions ?? []), selectOption],
                    });
                    setSelectOption('');
                  }}
                >
                  +
                </Button>
              </Flex>
            )}
          </Table.Cell>
          <Table.Cell>
            <Button
              disabled={
                !fieldConfig.type ||
                !fieldConfig.label ||
                (fieldConfig.type === MapNodeFieldType.SELECT &&
                  (!fieldConfig.selectOptions || fieldConfig.selectOptions.length === 0))
              }
              size="1"
              variant="solid"
              color="gray"
              onClick={() => {}}
            >
              {'Create'}
            </Button>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
};
