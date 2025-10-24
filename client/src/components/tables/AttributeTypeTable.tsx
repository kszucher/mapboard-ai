import { Button, Flex, Select, Table, Text, TextField } from '@radix-ui/themes';
import { useState } from 'react';
import { AttributeTypeUncheckedUpdateInput, NodeType } from '../../../../shared/src/schema/schema.ts';

export const AttributeTypeTable = ({ nodeType }: { nodeType: Partial<NodeType> }) => {
  const UI_DIRECTIONS = ['Input', 'Output'];
  const UI_TYPES = ['String', 'Number', 'Enum'];

  const getDirectionParam = (attributeType: AttributeTypeUncheckedUpdateInput) => {
    if (attributeType.isInput) return 'Input';
    else return 'Output';
  };

  const setDirectionParam = (uiDirection: string) => {
    if (uiDirection === 'Input') return { isInput: true };
    else return { isInput: false };
  };

  const getTypeParam = (attributeType: AttributeTypeUncheckedUpdateInput) => {
    if (attributeType.isString) return 'String';
    else if (attributeType.isNumber) return 'Number';
    else if (attributeType.isEnum) return 'Enum';
  };

  const setTypeParam = (uiType: string) => {
    if (uiType === 'String') return { isString: true, isNumber: false, isEnum: false };
    else if (uiType === 'Number') return { isString: false, isNumber: true, isEnum: false };
    else if (uiType === 'Enum') return { isString: false, isNumber: false, isEnum: true };
  };

  const isAttributeTypeIncomplete = (attributeType: AttributeTypeUncheckedUpdateInput) => {
    return (
      !attributeType.label ||
      (attributeType.isInput &&
        ((attributeType.isString && !attributeType.defaultString) ||
          (attributeType.isNumber && !attributeType.defaultNumber) ||
          (attributeType.isEnum && !attributeType.defaultEnum?.length)))
    );
  };

  const emptyAttributeType: AttributeTypeUncheckedUpdateInput = {
    label: '',
    isInput: true,
    isString: true,
    isNumber: false,
    isEnum: false,
    defaultString: null,
    defaultNumber: null,
    defaultEnum: [],
  };

  const [newAttributeType, setNewAttributeType] = useState(emptyAttributeType);
  const [defaultEnumElement, setDefaultEnumElement] = useState('');

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>{'Label'}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{'Direction'}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{'Type'}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{'Default(s)'}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{'Action'}</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {/* EXISTING ROWS */}
        <Table.Row>
          <Table.Cell>{'Label'}</Table.Cell>
          <Table.Cell>{'Direction'}</Table.Cell>
          <Table.Cell>{'Type'}</Table.Cell>
          <Table.Cell>{'Defaults(s)'}</Table.Cell>
          <Table.Cell>
            <Button size="1" variant="solid" onClick={() => {}}>
              {'Remove'}
            </Button>
          </Table.Cell>
        </Table.Row>
        {/* NEW ROW */}
        <Table.Row>
          {/* Label */}
          <Table.Cell>
            <TextField.Root
              size={'1'}
              variant={'soft'}
              placeholder="label"
              radius={'large'}
              onChange={e => setNewAttributeType({ ...newAttributeType, label: e.target.value })}
            />
          </Table.Cell>
          {/* Direction */}
          <Table.Cell>
            <Select.Root
              size="1"
              value={getDirectionParam(newAttributeType)}
              onValueChange={value => {
                setNewAttributeType({
                  ...newAttributeType,
                  ...setDirectionParam(value),
                  defaultString: null,
                  defaultNumber: null,
                  defaultEnum: [],
                });
              }}
            >
              <Select.Trigger variant="soft" color="gray" />
              <Select.Content>
                {UI_DIRECTIONS.map((direction, i) => (
                  <Select.Item key={i} value={direction}>
                    {direction}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Table.Cell>
          {/* Type */}
          <Table.Cell>
            <Select.Root
              size="1"
              value={getTypeParam(newAttributeType)}
              onValueChange={value => {
                setNewAttributeType({
                  ...newAttributeType,
                  ...setTypeParam(value),
                  defaultString: null,
                  defaultNumber: null,
                  defaultEnum: [],
                });
              }}
            >
              <Select.Trigger variant="soft" color="gray" />
              <Select.Content>
                {UI_TYPES.map((type, i) => (
                  <Select.Item key={i} value={type}>
                    {type}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Table.Cell>
          {/* Default(s) */}
          <Table.Cell>
            {newAttributeType.isEnum && (
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
                          defaultEnum: newAttributeType.defaultEnum!.filter((_, si) => si !== i),
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
                        defaultEnum: [...newAttributeType.defaultEnum!, defaultEnumElement],
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
          {/* Action */}
          <Table.Cell>
            <Button
              disabled={isAttributeTypeIncomplete(newAttributeType)}
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
