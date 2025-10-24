import { Button, Flex, Select, Table, Text, TextField } from '@radix-ui/themes';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AttributeTypeUpdate } from '../../../../shared/src/schema/schema.ts';
import { api, useGetAttributeTypeInfoQuery } from '../../data/api.ts';
import { AppDispatch } from '../../data/store.ts';

export const AttributeTypeTable = ({ nodeTypeId }: { nodeTypeId: number }) => {
  const attributeTypes = useGetAttributeTypeInfoQuery().data || [];
  const attributeTypesOfNode = attributeTypes.filter(ati => ati.nodeTypeId === nodeTypeId);

  const UI_DIRECTIONS = ['Input', 'Output'];
  const UI_TYPES = ['String', 'Number', 'Enum'];

  const getDirectionParam = (attributeType: AttributeTypeUpdate) => {
    if (attributeType.isInput) return 'Input';
    else return 'Output';
  };

  const setDirectionParam = (uiDirection: string) => {
    if (uiDirection === 'Input') return { isInput: true };
    else return { isInput: false };
  };

  const getTypeParam = (attributeType: AttributeTypeUpdate) => {
    if (attributeType.isString) return 'String';
    else if (attributeType.isNumber) return 'Number';
    else if (attributeType.isEnum) return 'Enum';
  };

  const setTypeParam = (uiType: string) => {
    if (uiType === 'String') return { isString: true, isNumber: false, isEnum: false };
    else if (uiType === 'Number') return { isString: false, isNumber: true, isEnum: false };
    else if (uiType === 'Enum') return { isString: false, isNumber: false, isEnum: true };
  };

  const getDefaultParam = (attributeType: AttributeTypeUpdate) => {
    if (attributeType.defaultString) return attributeType.defaultString;
    else if (attributeType.defaultNumber) return attributeType.defaultNumber.toString();
    else if (attributeType.isEnum) return attributeType.defaultEnum.join(', ');
  };

  const isAttributeTypeIncomplete = (attributeType: AttributeTypeUpdate) => {
    return (
      !attributeType.label || (attributeType.isInput && attributeType.isEnum && !attributeType.defaultEnum?.length)
    );
  };

  const emptyAttributeType: AttributeTypeUpdate = {
    label: '',
    nodeTypeId: nodeTypeId,
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

  const dispatch = useDispatch<AppDispatch>();

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
        {attributeTypesOfNode.map((el, i) => (
          <Table.Row key={i}>
            <Table.Cell>{el.label}</Table.Cell>
            <Table.Cell>{getDirectionParam(el)}</Table.Cell>
            <Table.Cell>{getTypeParam(el)}</Table.Cell>
            <Table.Cell>{getDefaultParam(el)}</Table.Cell>
            <Table.Cell>
              <Button size="1" variant="solid" onClick={() => {}}>
                {'Remove'}
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}

        {/* NEW ROW */}
        <Table.Row>
          {/* Label */}
          <Table.Cell>
            <TextField.Root
              size={'1'}
              variant={'soft'}
              placeholder="label"
              radius={'large'}
              value={newAttributeType.label}
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
              onClick={() => {
                dispatch(api.endpoints.insertAttributeType.initiate(newAttributeType));
                setNewAttributeType(emptyAttributeType);
                setDefaultEnumElement('');
              }}
            >
              {'Create'}
            </Button>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
};
