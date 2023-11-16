import {Button, Dialog, Flex, Text, TextField} from "@radix-ui/themes"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {getX} from "../../selectors/MapSelector"
import {mSelector} from "../../state/EditorState"

export const EditorNodeEditContentEquation = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Dialog.Content style={{ maxWidth: 450 }}>
      <Dialog.Title>{'Edit Equation'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        {'Edit Equation'}
      </Dialog.Description>
      <Flex direction="column" gap="3">
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            {'Equation'}
          </Text>
          <TextField.Input
            radius="large"
            value={getX(m).content}
            onChange={(e) => dispatch(actions.mapAction({type: 'setContentEquation', payload: {content: e.target.value}}))}
          />
        </label>
      </Flex>
      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button variant="soft" color="gray">
            {'Cancel'}
          </Button>
        </Dialog.Close>
        <Dialog.Close>
          <Button>
            {'OK'}
          </Button>
        </Dialog.Close>
      </Flex>
    </Dialog.Content>
  )
}
