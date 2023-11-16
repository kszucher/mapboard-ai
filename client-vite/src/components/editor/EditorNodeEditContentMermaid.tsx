import {Button, Dialog, Flex, Text, TextArea} from "@radix-ui/themes"
import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {getX} from "../../selectors/MapSelector"
import {mSelector} from "../../state/EditorState"

export const EditorNodeEditContentMermaid = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const [content, setContent] = useState(getX(m).content)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Dialog.Content style={{ maxWidth: 450 }}>
      <Dialog.Title>{'Edit Equation'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        {'Edit Equation'}
      </Dialog.Description>
      <Flex direction="column" gap="3">
        <TextArea
          style={{ minHeight: 300 }}
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
          <Button onClick={() => {
            document.getElementById(getX(m).nodeId)!.removeAttribute('data-processed')
            dispatch(actions.mapAction({type: 'setContentMermaid', payload: {content: content}}))
          }}>
            {'OK'}
          </Button>
        </Dialog.Close>
      </Flex>
    </Dialog.Content>
  )
}
