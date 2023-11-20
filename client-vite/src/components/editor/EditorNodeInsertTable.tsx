import {Button, Dialog, Flex, Grid, Select, Text} from "@radix-ui/themes"
import {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {isXR, isXS} from "../../selectors/MapSelector"
import {mSelector} from "../../state/EditorState"

export const EditorNodeInsertTable = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const [row, setRow] = useState<number>(1)
  const [col, setCol] = useState<number>(1)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Dialog.Content style={{ maxWidth: 450 }}>
      <Dialog.Title>{'Insert Table'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        {'Insert Table'}
      </Dialog.Description>
      <Grid columns="2" gap="3" width="auto" align="center">
        <Text as="div" size="2" weight="bold">{'Rows'}</Text>
        <Select.Root value={row.toString()} onValueChange={(value) => setRow(parseInt(value))}>
          <Select.Trigger />
          <Select.Content>
            {[1,2,3,4,5,6,7,8,9,10].map((el, index) => (
              <Select.Item key={index} value={el.toString()}>{el}</Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        <Text as="div" size="2" weight="bold">{'Columns'}</Text>
        <Select.Root value={col.toString()} onValueChange={(value) => setCol(parseInt(value))}>
          <Select.Trigger />
          <Select.Content>
            {[1,2,3,4,5,6,7,8,9,10].map((el, index) => (
              <Select.Item key={index} value={el.toString()}>{el}</Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Grid>
      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button variant="soft" color="gray">
            {'Cancel'}
          </Button>
        </Dialog.Close>
        <Dialog.Close>
          <Button
            onClick={
              () => {
                isXR(m) && dispatch(actions.mapAction({type: 'insertSORTable', payload: {rowLen: row, colLen: col}}))
                isXS(m) && dispatch(actions.mapAction({type: 'insertSOTable', payload: {rowLen: row, colLen: col}}))
              }
            }>
            {'OK'}
          </Button>
        </Dialog.Close>
      </Flex>
    </Dialog.Content>
  )
}
