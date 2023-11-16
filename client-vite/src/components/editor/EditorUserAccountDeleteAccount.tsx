import {AlertDialog, Button, Flex} from "@radix-ui/themes"
import React, {FC} from "react"
import {useDispatch} from "react-redux"
import {nodeApi} from "../../apis/NodeApi"
import {AppDispatch} from "../../reducers/EditorReducer"

export const EditorUserAccountDeleteAccount: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  return (
    <>
      <AlertDialog.Title>{'Delete Account'}</AlertDialog.Title>
      <AlertDialog.Description size="2">
        Are you sure? This application will no longer be accessible and any
        existing sessions will be expired.
      </AlertDialog.Description>
      <Flex gap="3" mt="4" justify="end">
        <AlertDialog.Cancel>
          <Button variant="soft" color="gray">
            Cancel
          </Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action>
          <Button variant="solid" color="red" onClick={() => dispatch(nodeApi.endpoints.deleteAccount.initiate())}>
            {'Delete Account'}
          </Button>
        </AlertDialog.Action>
      </Flex>
    </>
  )
}
