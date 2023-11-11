import {AlertDialog, Button, Flex} from "@radix-ui/themes"
import React, {FC} from "react";

export const EditorProfileDeleteAccount: FC = () => {
  return (
    <>
      <AlertDialog.Title>Revoke access</AlertDialog.Title>
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
          <Button variant="solid" color="red">
            Revoke access
          </Button>
        </AlertDialog.Action>
      </Flex>
    </>
  )
}
