import {Dialog} from "@radix-ui/themes"

export const RootIngestion = () => {
  return (
    <Dialog.Content style={{ maxWidth: 450 }}>
      <Dialog.Title>{'INGESTION'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        {'Ingest the content of text or audio files'}
      </Dialog.Description>
    </Dialog.Content>
  )
}
