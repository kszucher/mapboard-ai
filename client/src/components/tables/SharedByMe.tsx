import { Button, Table } from '@radix-ui/themes';
import { useDispatch } from 'react-redux';
import { api, useGetShareInfoQuery } from '../../data/api.ts';
import { AppDispatch } from '../../data/store.ts';

export const SharedByMe = () => {
  const sharesByUser = useGetShareInfoQuery().data?.SharesByMe;
  const dispatch = useDispatch<AppDispatch>();
  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>{'Map Name'}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{'Shared With'}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{'Access'}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{'Status'}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{'Action'}</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sharesByUser?.map(el => (
          <Table.Row key={el.id}>
            <Table.RowHeaderCell>{el.Map.name}</Table.RowHeaderCell>
            <Table.Cell>{el.ShareUser.email}</Table.Cell>
            <Table.Cell>{el.access}</Table.Cell>
            <Table.Cell>{el.status}</Table.Cell>
            <Table.Cell>
              <Button
                size="1"
                variant="solid"
                onClick={() => dispatch(api.endpoints.withdrawShare.initiate({ shareId: el.id }))}
              >
                {'Remove'}
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
