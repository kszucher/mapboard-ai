import {Button, Dialog, Flex, Link, Table, TableBody} from "@radix-ui/themes"
import React from "react"
import {useDispatch} from "react-redux"
import {nodeApi, useGetSharesQuery} from "../../apis/NodeApi"
import {AppDispatch} from "../../reducers/EditorReducer"

export const EditorMapSharesSharedWithMe = () => {
  const { data } = useGetSharesQuery()
  let { shareDataImport } = data || { shareDataImport: [] }
  const dispatch = useDispatch<AppDispatch>()
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
            <Table.ColumnHeaderCell>{'Shared With'}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{'Access'}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{'Status'}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{'Action'}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <TableBody>
          {shareDataImport.map((el: { _id: string, sharedMapName: string, ownerUserEmail: string, access: string, status: string  }) =>
            <Table.Row key={el._id}>
              <Table.RowHeaderCell>{el.sharedMapName}</Table.RowHeaderCell>
              <Table.Cell>{el.ownerUserEmail}</Table.Cell>
              <Table.Cell>{el.access}</Table.Cell>
              <Table.Cell>{el.status}</Table.Cell>
              {el.status === 'waiting' &&
                <Table.Cell>
                  <Button size="1" variant="solid" onClick={() => dispatch(nodeApi.endpoints.acceptShare.initiate({shareId: el._id}))}>
                    {'Accept'}
                  </Button>
                </Table.Cell>}
              {el.status === 'accepted' && <Table.Cell>{''}</Table.Cell>}
            </Table.Row>
          )}
        </TableBody>
      </Table.Root>
      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button variant="soft" color="gray">
            {'Close'}
          </Button>
        </Dialog.Close>
      </Flex>
    </Dialog.Content>
  )
}
