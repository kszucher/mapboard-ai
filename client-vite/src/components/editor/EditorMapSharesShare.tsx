import {Button, Dialog, Flex, Grid, Select, Text, TextField} from "@radix-ui/themes"
import {BaseQueryError} from "@reduxjs/toolkit/dist/query/baseQueryTypes"
import {useState} from "react"
import {useCreateShareMutation} from "../../apis/NodeApi"
import {AccessTypes} from "../../state/Enums"
import {getMapId} from "../../state/NodeApiState"
import {Spinner} from "../assets/Spinner"

export const EditorMapSharesShare = () => {
  const [ createShare, { error, isUninitialized, isLoading, isSuccess, isError, reset } ] = useCreateShareMutation()
  const errorMessage = (error as BaseQueryError<any>)?.data?.message
  const [shareEmail, setShareEmail] = useState('')
  const [shareAccess, setShareAccess] = useState<AccessTypes>(AccessTypes.VIEW)
  return (
    <Dialog.Content style={{ maxWidth: 450 }}>
      <Dialog.Title>{'Share This Map'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        {'Share This Map'}
      </Dialog.Description>
      <Grid columns="1" gap="3" width="auto" align="center">
        <Text as="div" size="2" weight="bold">{'Access'}</Text>
        <Select.Root
          disabled={isLoading || isSuccess}
          value={shareAccess}
          onValueChange={(value) => {reset(); setShareAccess(value as AccessTypes)}}>
          <Select.Trigger radius="large"/>
          <Select.Content>
            {[AccessTypes.VIEW, AccessTypes.EDIT].map((el, index) => (
              <Select.Item key={index} value={el}>{el}</Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        <Text as="div" size="2" weight="bold">{'Email'}</Text>
        <TextField.Input
          disabled={isLoading || isSuccess}
          radius="large"
          value={shareEmail}
          placeholder="User email"
          color={isError ? 'red' : 'gray'}
          onChange={(e) => {reset(); setShareEmail(e.target.value)}}
        />
      </Grid>
      <Flex direction="column" gap="3">
        {isUninitialized &&
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                {'Cancel'}
              </Button>
            </Dialog.Close>
            <Button disabled={shareEmail === ''} onClick={() => createShare({mapId: getMapId(), shareEmail, shareAccess})}>
              {'Share'}
            </Button>
          </Flex>
        }
        {isError && <Text as="div" size="2" mt="4" color="crimson">{errorMessage}</Text>}
        {isSuccess && <Text as="div" size="2" mt="4" color="grass">{'Successfully shared'}</Text>}
        {(isError || isSuccess) &&
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                {'Close'}
              </Button>
            </Dialog.Close>
          </Flex>
        }
        {isLoading && <Spinner/>}
      </Flex>
    </Dialog.Content>
  )
}
