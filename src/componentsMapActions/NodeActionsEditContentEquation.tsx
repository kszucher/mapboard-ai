import {Button, Dialog, Flex, TextArea} from "@radix-ui/themes"
import {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../editorMutations/EditorMutations.ts"
import {MM} from "../mapMutations/MapMutationEnum.ts"
import {getXS} from "../mapQueries/MapQueries.ts"

import {mSelector} from "../editorQueries/EditorQueries.ts";

export const NodeActionsEditContentEquation = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const [content, setContent] = useState(getXS(m).content)
  const dispatch = useDispatch<AppDispatch>()
  const dm = (type: MM, payload? : any) => dispatch(actions.mapReducer({type, payload}))
  return (
    <Dialog.Content style={{ maxWidth: 450 }}>
      <Dialog.Title>{'Edit Equation'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        {'Edit Equation'}
      </Dialog.Description>
      <Flex direction="column" gap="3">
        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </Flex>
      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button variant="soft" color="gray">
            {'Cancel'}
          </Button>
        </Dialog.Close>
        <Dialog.Close>
          <Button onClick={() => dm(MM.setContentEquation, {content})}>
            {'OK'}
          </Button>
        </Dialog.Close>
      </Flex>
    </Dialog.Content>
  )
}
