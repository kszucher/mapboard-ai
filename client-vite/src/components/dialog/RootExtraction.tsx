import {Dialog} from "@radix-ui/themes"

export const RootExtraction = () => {
  return (
    <Dialog.Content style={{ maxWidth: 450 }}>
      <Dialog.Title>{'EXTRACTION'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        {'Extract information in your desired format'}
      </Dialog.Description>
    </Dialog.Content>
  )
}
