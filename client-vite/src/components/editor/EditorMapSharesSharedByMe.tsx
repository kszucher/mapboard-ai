import {Button, Dialog, Flex, Link, Table, TableBody} from "@radix-ui/themes"
import React from "react"
import {useDispatch} from "react-redux"
import {nodeApi, useGetSharesQuery} from "../../apis/NodeApi"
import {AppDispatch} from "../../reducers/EditorReducer"

export const EditorMapSharesSharedByMe = () => {
  const { data } = useGetSharesQuery()
  let { shareDataExport } = data || { shareDataExport: []}
  const dispatch = useDispatch<AppDispatch>()
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
            <Table.ColumnHeaderCell>{'Shared By'}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{'Access'}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{'Status'}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{'Action'}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <TableBody>
          {shareDataExport.map((el: { _id: string, sharedMapName: string, shareUserEmail: string, access: string, status: string  }) =>
            <Table.Row key={el._id}>
              <Table.RowHeaderCell>{el.sharedMapName}</Table.RowHeaderCell>
              <Table.Cell>{el.shareUserEmail}</Table.Cell>
              <Table.Cell>{el.access}</Table.Cell>
              <Table.Cell>{el.status}</Table.Cell>
              <Table.Cell>
                <Button size="1" variant="solid" onClick={() => window.alert('TODO: implement')/*dispatch(nodeApi.endpoints.withdrawShare.initiate({shareId: el._id}))*/}>
                  {'Withdraw'}
                </Button>
              </Table.Cell>
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
