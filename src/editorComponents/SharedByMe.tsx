import { Button, Dialog, Flex, Table } from "@radix-ui/themes"
import { useDispatch } from "react-redux"
import { defaultGetSharesQueryState } from "../apiState/ApiState.ts"
import { api, AppDispatch, useGetSharesQuery } from "../rootComponent/RootComponent.tsx"

export const SharedByMe = () => {
  const { data } = useGetSharesQuery()
  const { shareDataExport } = data || defaultGetSharesQueryState
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
            <Table.ColumnHeaderCell>{'Shared With'}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{'Access'}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{'Status'}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{'Action'}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {shareDataExport.map(el =>
            <Table.Row key={el._id}>
              <Table.RowHeaderCell>{el.sharedMapName}</Table.RowHeaderCell>
              <Table.Cell>{el.shareUserEmail}</Table.Cell>
              <Table.Cell>{el.access}</Table.Cell>
              <Table.Cell>{el.status}</Table.Cell>
              <Table.Cell>
                <Button size="1" variant="solid"
                        onClick={() => dispatch(api.endpoints.withdrawShare.initiate({ shareId: el._id }))}>
                  {'Remove'}
                </Button>
              </Table.Cell>
            </Table.Row>
          )}
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
  )
}
