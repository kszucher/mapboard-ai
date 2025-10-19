import { Badge, Button, Select, Table } from '@radix-ui/themes';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Color, defaultMapConfig } from '../../../../shared/src/api/api-types-map-config.ts';
import { api, useGetMapConfigInfoQuery } from '../../data/api.ts';
import { AppDispatch } from '../../data/store.ts';

export const MapConfigLink = () => {
  const { mapNodeConfigs, mapLinkConfigs } = useGetMapConfigInfoQuery().data || defaultMapConfig;
  const emptyLinkConfig = { fromNodeConfigId: NaN, toNodeConfigId: NaN, schema: '' };
  const [newLinkConfig, setNewLinkConfig] = useState(emptyLinkConfig);
  const dispatch = useDispatch<AppDispatch>();

  console.log(mapLinkConfigs);

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
        {mapLinkConfigs?.map(el => (
          <Table.Row key={el.id}>
            <Table.Cell>
              <Badge color="gray">{el.FromNodeConfig?.type}</Badge>
            </Table.Cell>
            <Table.Cell>
              <Badge color="gray">{el.ToNodeConfig?.type}</Badge>
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
              value={newLinkConfig.fromNodeConfigId ? newLinkConfig.fromNodeConfigId.toString() : ''}
              onValueChange={id => setNewLinkConfig({ ...newLinkConfig, fromNodeConfigId: Number(id) })}
            >
              <Select.Trigger
                variant="soft"
                color={mapNodeConfigs?.find(el => el.id === newLinkConfig.fromNodeConfigId)?.color || Color.gray}
              />
              <Select.Content>
                {mapNodeConfigs?.map(el => (
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
              value={newLinkConfig.toNodeConfigId ? newLinkConfig.toNodeConfigId.toString() : ''}
              onValueChange={id => setNewLinkConfig({ ...newLinkConfig, toNodeConfigId: Number(id) })}
            >
              <Select.Trigger
                variant="soft"
                color={mapNodeConfigs?.find(el => el.id === newLinkConfig.toNodeConfigId)?.color || Color.gray}
              />
              <Select.Content>
                {mapNodeConfigs?.map(el => (
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
                console.log(newLinkConfig);
                if (!isNaN(newLinkConfig.fromNodeConfigId) && !isNaN(newLinkConfig.toNodeConfigId)) {
                  dispatch(api.endpoints.createMapLinkConfig.initiate(newLinkConfig));
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
