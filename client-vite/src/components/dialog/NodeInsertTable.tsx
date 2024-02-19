import {Button, Dialog, Flex, Grid, Select, Text} from "@radix-ui/themes"
import {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {isXS} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState.ts"
import {DialogState} from "../../state/Enums.ts"

export const NodeInsertTable = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const dialogState = useSelector((state: RootState) => state.editor.dialogState)
  const [row, setRow] = useState<number>(1)
  const [col, setCol] = useState<number>(1)
  const dispatch = useDispatch<AppDispatch>()
  const md = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))
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
          <Button onClick={() => {
            dialogState === DialogState.CREATE_TABLE_U && isXS(m) && md(MR.insertSUTable, {rowLen: row, colLen: col})
            dialogState === DialogState.CREATE_TABLE_D && isXS(m) && md(MR.insertSDTable, {rowLen: row, colLen: col})
            dialogState === DialogState.CREATE_TABLE_O && isXS(m) && md(MR.insertSOTable, {rowLen: row, colLen: col})
          }}>
            {'OK'}
          </Button>
        </Dialog.Close>
      </Flex>
    </Dialog.Content>
  )
}
