import { Button, Dialog, Flex, Table } from '@radix-ui/themes';
import { useDispatch } from 'react-redux';
import { api } from '../../data/serverSide/Api.ts';
import { sharesInfoDefaultState } from '../../data/serverSide/ApiState.ts';
import { AppDispatch } from '../../data/store.ts';

export const SharedByMe = () => {
  const { sharesByUser } = api.useGetSharesInfoQuery().data || sharesInfoDefaultState;
  const dispatch = useDispatch<AppDispatch>();
  return (
    <Dialog.Content style={{ maxWidth: 800 }}>
      <Dialog.Title>{'Maps Shared By Me'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        {'Maps Shared By Me'}
      </Dialog.Description>
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
          {sharesByUser.map(el => (
            <Table.Row key={el.id}>
              <Table.RowHeaderCell>{el.sharedMapName}</Table.RowHeaderCell>
              <Table.Cell>{el.shareUserEmail}</Table.Cell>
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
      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button variant="soft" color="gray">
            {'Close'}
          </Button>
        </Dialog.Close>
      </Flex>
    </Dialog.Content>
  );
};
