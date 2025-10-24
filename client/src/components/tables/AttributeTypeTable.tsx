import { Button, Flex, Select, Table, Text, TextField } from '@radix-ui/themes';
import { useState } from 'react';
import { AttributeType, AttributeTypeLabel, NodeType } from '../../../../shared/src/schema/schema.ts';

export const AttributeTypeTable = ({ nodeType }: { nodeType: Partial<NodeType> }) => {
  const emptyAttributeType: Partial<AttributeType> & Required<Pick<AttributeType, 'label'>> = {
    label: AttributeTypeLabel.INPUT_STRING,
    defaultString: null,
    defaultNumber: null,
    defaultEnum: [],
  };
  const [newAttributeType, setNewAttributeType] = useState(emptyAttributeType ?? nodeType);
  const [defaultEnumElement, setDefaultEnumElement] = useState('');

  const UI_LABELS: Record<AttributeTypeLabel, string> = {
    INPUT_STRING: 'Input String',
    INPUT_NUMBER: 'Input Number',
    INPUT_ENUM: 'Input Enum',
    OUTPUT_STRING: 'Output String',
    OUTPUT_NUMBER: 'Output Number',
  };

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
              value={newAttributeType.label}
              onValueChange={value => setNewAttributeType({ ...newAttributeType, label: value })}
            >
              <Select.Trigger variant="soft" color="gray">
                {UI_LABELS[newAttributeType.label]}
              </Select.Trigger>
              <Select.Content>
                {Object.entries(UI_LABELS).map(([key, label]) => (
                  <Select.Item key={key} value={key}>
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
              onChange={e => setNewAttributeType({ ...newAttributeType, label: e.target.value })}
            ></TextField.Root>
          </Table.Cell>
          <Table.Cell>
            {newAttributeType.label === AttributeTypeLabel.INPUT_ENUM && (
              <Flex direction="column" gap="2" align="start" content="center">
                {newAttributeType.defaultEnum?.map((el, i) => (
                  <Flex key={i} gap="2" align="start" content="center">
                    <Text as="div" size="2" mb="1">
                      {el}
                    </Text>
                    <Button
                      size="1"
                      variant="solid"
                      color="gray"
                      onClick={() => {
                        setNewAttributeType({
                          ...newAttributeType,
                          defaultEnum: newAttributeType.defaultEnum?.filter((_, si) => si !== i),
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
                  value={defaultEnumElement}
                  onChange={e => setDefaultEnumElement(e.target.value)}
                />
                <Button
                  size="1"
                  variant="solid"
                  color="gray"
                  onClick={() => {
                    if (defaultEnumElement) {
                      setNewAttributeType({
                        ...newAttributeType,
                        defaultEnum: [...(newAttributeType.defaultEnum ?? []), defaultEnumElement],
                      });
                      setDefaultEnumElement('');
                    }
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
                !newAttributeType.label ||
                (newAttributeType.label === AttributeTypeLabel.INPUT_ENUM &&
                  (!newAttributeType.defaultEnum || newAttributeType.defaultEnum.length === 0))
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
