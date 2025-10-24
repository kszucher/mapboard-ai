import { Button, Table } from '@radix-ui/themes';
import { useDispatch } from 'react-redux';

import { ShareStatus } from '../../../../shared/src/schema/schema.ts';
import { api, useGetShareInfoQuery } from '../../data/api.ts';
import { AppDispatch } from '../../data/store.ts';

export const SharedWithMe = () => {
  const sharesWithUser = useGetShareInfoQuery().data?.SharesWithMe;
  const dispatch = useDispatch<AppDispatch>();
  return (
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
        {sharesWithUser?.map(el => (
          <Table.Row key={el.id}>
            <Table.RowHeaderCell>{el.Map.name}</Table.RowHeaderCell>
            <Table.Cell>{el.OwnerUser.email}</Table.Cell>
            <Table.Cell>{el.access}</Table.Cell>
            <Table.Cell>{el.status}</Table.Cell>
            {el.status === ShareStatus.WAITING && (
              <Table.Cell>
                <Button
                  size="1"
                  variant="solid"
                  onClick={() =>
                    dispatch(
                      api.endpoints.acceptShare.initiate({
                        shareId: el.id,
                      })
                    )
                  }
                >
                  {'Accept'}
                </Button>
              </Table.Cell>
            )}
            {el.status === ShareStatus.ACCEPTED && (
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
  );
};
