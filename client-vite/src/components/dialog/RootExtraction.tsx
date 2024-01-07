import {Button, Dialog} from "@radix-ui/themes"

export const RootExtraction = () => {
  return (
    <Dialog.Content style={{ maxWidth: 450 }} onInteractOutside={(e) => {e.preventDefault()}}>
      <Dialog.Title>{'EXTRACTION'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        {'Extract information in your desired format'}
      </Dialog.Description>
      <Dialog.Close>
        <Button variant="soft" color="gray">
          {'Cancel'}
        </Button>
      </Dialog.Close>
    </Dialog.Content>
  )
}
