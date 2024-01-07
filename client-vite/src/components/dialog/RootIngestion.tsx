import {Button, Dialog} from "@radix-ui/themes"

export const RootIngestion = () => {
  return (
    <Dialog.Content style={{ maxWidth: 450 }} onInteractOutside={(e) => {e.preventDefault()}}>
      <Dialog.Title>{'INGESTION'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        {'Ingest the content of text or audio files'}
      </Dialog.Description>
      <Dialog.Close>
        <Button variant="soft" color="gray">
          {'Cancel'}
        </Button>
      </Dialog.Close>
    </Dialog.Content>
  )
}
