import { Button, Flex, Select, Table, Text, TextField } from '@radix-ui/themes';
import { useState } from 'react';
import { NodeType, NodeConfigType, NodeConfigTypeLabel } from '../../../../shared/src/api/api-types-node-type.ts';

export const NodeConfigTypeEdit = ({ nodeType }: { nodeType: Partial<NodeType> }) => {
  const emptyNodeConfigType: Partial<NodeConfigType> = { type: '', label: '', selectOptions: [] };
  const [nodeConfigType, setNodeConfigType] = useState(emptyNodeConfigType ?? nodeType);
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
              value={nodeConfigType.type}
              onValueChange={(value: NodeConfigTypeLabel) => {
                setNodeConfigType({ ...nodeConfigType, type: value });
              }}
            >
              <Select.Trigger variant="soft" color="gray" />
              <Select.Content>
                {Object.values(NodeConfigTypeLabel).map(label => (
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
              onChange={e => setNodeConfigType({ ...nodeConfigType, label: e.target.value })}
            ></TextField.Root>
          </Table.Cell>
          <Table.Cell>
            {nodeConfigType.type === NodeConfigTypeLabel.SELECT && (
              <Flex direction="column" gap="2" align="start" content="center">
                {nodeConfigType.selectOptions?.map((el, i) => (
                  <Flex key={i} gap="2" align="start" content="center">
                    <Text as="div" size="2" mb="1">
                      {el}
                    </Text>
                    <Button
                      size="1"
                      variant="solid"
                      color="gray"
                      onClick={() => {
                        setNodeConfigType({
                          ...nodeConfigType,
                          selectOptions: nodeConfigType.selectOptions?.filter((_, si) => si !== i),
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
                    setNodeConfigType({
                      ...nodeConfigType,
                      selectOptions: [...(nodeConfigType.selectOptions ?? []), selectOption],
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
                !nodeConfigType.type ||
                !nodeConfigType.label ||
                (nodeConfigType.type === NodeConfigTypeLabel.SELECT &&
                  (!nodeConfigType.selectOptions || nodeConfigType.selectOptions.length === 0))
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
