import {Button, Dialog, Flex, Text, TextField} from "@radix-ui/themes"
import React from "react"

export const EditorMapRenameDialog = () => {
  return (
    <Dialog.Content style={{ maxWidth: 450 }}>
      <Dialog.Title>{'Rename Map'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        Rename map
      </Dialog.Description>
      <Flex direction="column" gap="3">
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Name
          </Text>
          <TextField.Input
            radius="large"
            defaultValue="Freja Johnsen"
            placeholder="Enter your full name"
          />
        </label>
      </Flex>
      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button variant="soft" color="gray">
            Cancel
          </Button>
        </Dialog.Close>
        <Dialog.Close>
          <Button>Save</Button>
        </Dialog.Close>
      </Flex>
    </Dialog.Content>
  )
}
