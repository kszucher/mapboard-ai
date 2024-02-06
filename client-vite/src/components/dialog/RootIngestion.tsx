import {Button, Dialog, Flex, Text} from "@radix-ui/themes"
import {ChangeEvent, useRef, useState} from "react"
import {useDispatch} from "react-redux"
import {AppDispatch} from "../../reducers/EditorReducer.ts"
import {api} from "../../api/Api.ts"

export const RootIngestion = () => {
  const hiddenFileInput = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const dispatch = useDispatch<AppDispatch>()
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }
  const handleUpload = () => {
    if (file) {
      const formData = new FormData()
      formData.append("file", file)
      dispatch(api.endpoints.uploadFile.initiate({ bodyFormData: formData }))
    }
  }
  return (
    <Dialog.Content style={{ maxWidth: 450 }} onInteractOutside={(e) => {e.preventDefault()}}>
      <Dialog.Title>{'INGESTION'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        {'Ingest the content of text or audio files'}
      </Dialog.Description>
      <Flex direction="column" gap="2" align="start" content="center">
        <input
          type="file"
          onChange={handleFileChange}
          ref={hiddenFileInput}
          style={{display: 'none'}}
        />
        <Button color="gray" onClick={() => (hiddenFileInput.current as HTMLInputElement).click()}>
          Select Fle
        </Button>
        {file && (
          <Flex direction="column">
            <Text size="2">File Details:</Text>
            <Text size="2">Name: {file.name}</Text>
            <Text size="2">Type: {file.type}</Text>
            <Text size="2">Size: {file.size} bytes</Text>
          </Flex>
        )}
        {file &&
          <Button onClick={handleUpload}>
            Upload file
          </Button>
        }
      </Flex>
      <Flex gap="3" mt="4" justify="end">

        <Dialog.Close>
          <Button variant="soft" color="gray">
            {'Cancel'}
          </Button>
        </Dialog.Close>
      </Flex>
    </Dialog.Content>
  )
}
