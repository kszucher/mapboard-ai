import {Button, Dialog, Flex, Spinner, Text} from "@radix-ui/themes"
import {useEffect, useRef, useState} from "react"
import {useGetIngestionQuery, useUploadFileMutation} from "../../api/Api.ts"
import {defaultGetIngestionQueryState} from "../../state/NodeApiState.ts"

export const RootIngestion = () => {
  const hiddenFileInput = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState<Boolean>(false)
  const [uploadFile, {isSuccess, reset}] = useUploadFileMutation()
  const { data } = useGetIngestionQuery()
  const { ingestionResult } = data || defaultGetIngestionQueryState

  useEffect(() => {
      if (isSuccess) {
        reset()
        setIsUploading(false)
      }
    }, [isSuccess]
  )

  return (
    <Dialog.Content style={{ maxWidth: 450 }} onInteractOutside={(e) => {e.preventDefault()}}>
      <Dialog.Title>{'INGESTION'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        {'Ingest the content of text or audio files'}
      </Dialog.Description>
      <Flex direction="column" gap="2" align="start" content="center">
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0])
            }
          }}
          ref={hiddenFileInput}
          style={{display: 'none'}}
        />
        {!isUploading &&
          <Button color="gray" onClick={() => (hiddenFileInput.current as HTMLInputElement).click()}>
            Select Fle
          </Button>
        }
        {!isUploading && file && (
          <Flex direction="column">
            <Text size="2">File Details:</Text>
            <Text size="2">Name: {file.name}</Text>
            <Text size="2">Type: {file.type}</Text>
            <Text size="2">Size: {file.size} bytes</Text>
          </Flex>
        )}
        {!isUploading && file &&
          <Button onClick={() => {
            if (file) {
              setIsUploading(true)
              const formData = new FormData()
              formData.append("file", file)
              uploadFile({ bodyFormData: formData })
            }
          }}>
            Upload file
          </Button>
        }
        {isUploading &&
          <Spinner size="3"/>
        }
        {ingestionResult &&
          <div>
            {ingestionResult}
          </div>
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
