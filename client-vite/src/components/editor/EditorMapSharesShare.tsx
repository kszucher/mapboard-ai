import {Button, Dialog, Flex, Select, Text, TextField} from "@radix-ui/themes"
import {BaseQueryError} from "@reduxjs/toolkit/dist/query/baseQueryTypes"
import React, {useEffect, useState} from "react"
import {useDispatch} from "react-redux"
import {useCreateShareMutation} from "../../apis/NodeApi"
import {actions, AppDispatch} from "../../reducers/EditorReducer"
import {AccessTypes, PageState} from "../../state/Enums"
import {getMapId} from "../../state/NodeApiState"

export const EditorMapSharesShare = () => {
  const [ createShare, {isError, error, isLoading, isSuccess, reset} ] = useCreateShareMutation()
  const errorMessage = (error as BaseQueryError<any>)?.data?.message
  const [shareEmail, setShareEmail] = useState('')
  const [shareAccess, setShareAccess] = useState<AccessTypes>(AccessTypes.VIEW)
  const dispatch = useDispatch<AppDispatch>()
  useEffect(()=> {
    if (isSuccess) {
      dispatch(actions.setPageState(PageState.WS))
    }
  }, [isSuccess])
  useEffect(()=> {
    if (isError) {
      window.alert(errorMessage)
    }
  }, [isError])
  return (
    <Dialog.Content style={{ maxWidth: 450 }}>
      <Dialog.Title>{'Share This Map'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        {'Share This Map'}
      </Dialog.Description>
      <Flex direction="column" gap="3">
        <Select.Root value={shareAccess} onValueChange={(value) => setShareAccess(value as AccessTypes)}>
          <Select.Trigger />
          <Select.Content>
            {[AccessTypes.VIEW, AccessTypes.EDIT].map((el, index) => (
              <Select.Item key={index} value={el}>{el}</Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Name
          </Text>
          <TextField.Input
            radius="large"
            value={shareEmail}
            placeholder="User email"
            color={isError ? 'red' : 'gray'}
            onClick={() => reset()}
            onChange={(e) => setShareEmail(e.target.value)}
          />
        </label>
      </Flex>
      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button variant="soft" color="gray">
            {'Cancel'}
          </Button>
        </Dialog.Close>
        <Button disabled={isLoading || shareEmail === ''} onClick={() => createShare({mapId: getMapId(), shareEmail, shareAccess})}>
          {'Save'}
        </Button>
      </Flex>
    </Dialog.Content>
  )
}
