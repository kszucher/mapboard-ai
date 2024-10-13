import {Button, Flex, Spinner, Text} from "@radix-ui/themes"
import {useEffect, useRef, useState} from "react"
import {R} from "../mapState/MapStateTypes.ts"
import {useUploadFileMutation} from "../rootComponent/RootComponent.tsx"

export const MapDivRIngestion = ({ri}: {ri :R}) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadFile, {isSuccess, reset}] = useUploadFileMutation()
  // const { data } = useGetIngestionQuery()
  // const { ingestionResult } = data || defaultGetIngestionQueryState
  // no such fancy state here,
  // instead we will state custom state loading, and server will kill it merge it push it

  useEffect(() => {
      if (isSuccess) {
        reset()
        setIsUploading(false)
      }
    }, [isSuccess]
  )

  return (

      <Flex direction="column" gap="2" align="start" content="center">
        <div>
          {ri.path}
        </div>
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
        {/*{ingestionResult &&*/}
        {/*  <div>*/}
        {/*    {ingestionResult}*/}
        {/*  </div>*/}
        {/*}*/}
      </Flex>
  )
}
