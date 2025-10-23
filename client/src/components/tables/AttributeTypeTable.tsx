import { Button, Flex, Select, Table, Text, TextField } from '@radix-ui/themes';
import { useState } from 'react';
import { AttributeType, AttributeTypeLabel, NodeType } from '../../../../shared/src/api/api-types-node-type.ts';

export const AttributeTypeTable = ({ nodeType }: { nodeType: Partial<NodeType> }) => {
  const emptyAttributeType: Partial<AttributeType> = { type: '', label: '', selectOptions: [] };
  const [AttributeType, setAttributeType] = useState(emptyAttributeType ?? nodeType);
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
              value={AttributeType.type}
              onValueChange={(value: AttributeTypeLabel) => {
                setAttributeType({ ...AttributeType, type: value });
              }}
            >
              <Select.Trigger variant="soft" color="gray" />
              <Select.Content>
                {Object.values(AttributeTypeLabel).map(label => (
                  <Select.Item key={label} value={label}>
                    {label}
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
              onChange={e => setAttributeType({ ...AttributeType, label: e.target.value })}
            ></TextField.Root>
          </Table.Cell>
          <Table.Cell>
            {AttributeType.type === AttributeTypeLabel.SELECT && (
              <Flex direction="column" gap="2" align="start" content="center">
                {AttributeType.selectOptions?.map((el, i) => (
                  <Flex key={i} gap="2" align="start" content="center">
                    <Text as="div" size="2" mb="1">
                      {el}
                    </Text>
                    <Button
                      size="1"
                      variant="solid"
                      color="gray"
                      onClick={() => {
                        setAttributeType({
                          ...AttributeType,
                          selectOptions: AttributeType.selectOptions?.filter((_, si) => si !== i),
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
                    setAttributeType({
                      ...AttributeType,
                      selectOptions: [...(AttributeType.selectOptions ?? []), selectOption],
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
                !AttributeType.type ||
                !AttributeType.label ||
                (AttributeType.type === AttributeTypeLabel.SELECT &&
                  (!AttributeType.selectOptions || AttributeType.selectOptions.length === 0))
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
