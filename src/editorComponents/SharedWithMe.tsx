import { Button, Dialog, Flex, Table } from '@radix-ui/themes';
import { useDispatch } from 'react-redux';
import { sharesInfoDefaultState } from '../apiState/ApiState.ts';
import { StatusType } from '../editorState/EditorStateTypesEnums.ts';
import { api, AppDispatch } from '../rootComponent/RootComponent.tsx';

export const SharedWithMe = () => {
  const { sharesWithUser } = api.useGetSharesInfoQuery().data || sharesInfoDefaultState;
  const dispatch = useDispatch<AppDispatch>();
  return (
    <Dialog.Content style={{ maxWidth: 800 }}>
      <Dialog.Title>{'Maps Shared With Me'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        {'Maps Shared With Me'}
      </Dialog.Description>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{'Map Name'}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{'Shared By'}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{'Access'}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{'Status'}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{'Action'}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sharesWithUser.map(el => (
            <Table.Row key={el.id}>
              <Table.RowHeaderCell>{el.sharedMapName}</Table.RowHeaderCell>
              <Table.Cell>{el.ownerUserEmail}</Table.Cell>
              <Table.Cell>{el.access}</Table.Cell>
              <Table.Cell>{el.status}</Table.Cell>
              {el.status === StatusType.WAITING && (
                <Table.Cell>
                  <Button
                    size="1"
                    variant="solid"
                    onClick={() =>
                      dispatch(
                        api.endpoints.updateShareStatusAccepted.initiate({
                          shareId: el.id,
                        })
                      )
                    }
                  >
                    {'Accept'}
                  </Button>
                </Table.Cell>
              )}
              {el.status === StatusType.ACCEPTED && (
                <Table.Cell>
                  <Button
                    size="1"
                    variant="solid"
                    onClick={() => dispatch(api.endpoints.rejectShare.initiate({ shareId: el.id }))}
                  >
                    {'Remove'}
                  </Button>
                </Table.Cell>
              )}
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
