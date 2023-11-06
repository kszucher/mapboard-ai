import {Button, Label, Modal, Select, TextInput} from "flowbite-react"
import React, {FC, useState, useEffect} from "react"
import {useDispatch} from "react-redux"
import {actions, AppDispatch} from '../../reducers/EditorReducer'
import {AccessTypes, PageState} from "../../state/Enums"
import {useCreateShareMutation} from "../../apis/NodeApi"
import {BaseQueryError} from "@reduxjs/toolkit/dist/query/baseQueryTypes"
import {getMapId} from "../../state/NodeApiState"

export const ShareThisMapModal: FC = () => {
  const [ createShare, {isError, error, isLoading, isSuccess, reset} ] = useCreateShareMutation()
  const errorMessage = (error as BaseQueryError<any>)?.data?.message
  const [shareEmail, setShareEmail] = useState('')
  const [shareAccess, setShareAccess] = useState(AccessTypes.VIEW)
  const dispatch = useDispatch<AppDispatch>()
  useEffect(()=> {
    if (isSuccess) {
      dispatch(actions.setPageState(PageState.WS))
    }
  }, [isSuccess])
  return (
    <Modal
      theme={{
        root: {
          show: {
            on: "flex bg-zinc-700 bg-opacity-25 dark:bg-opacity-40"
          }
        },
        content: {
          base: "top-[64px] relative h-full w-full p-4 md:h-auto",
          inner: "relative rounded-lg bg-white shadow dark:bg-zinc-800 flex flex-col max-h-[90vh]"
        }
      }}
      show={true}
      onClose={() => dispatch(actions.setPageState(PageState.WS))}
      position="top-center"
      size="lg"
    >
      <Modal.Header>Share This Map</Modal.Header>
      <Modal.Body>
        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="small" value="Email" />
          </div>
          <TextInput
            type="text"
            value={shareEmail}
            onClick={() => reset()}
            onChange={(e) => setShareEmail(e.target.value)}
            color={isError ? 'failure' : 'gray'}
            helperText={<span className="font-medium text-red-600">{errorMessage}</span>}
          />
          <br/>
          <div className="mb-2 block">
            <Label htmlFor="access" value="Access" />
          </div>
          <Select id="access" required onChange={(e) => setShareAccess(e.target.value as AccessTypes)}>
            <option>{AccessTypes.EDIT}</option>
            <option>{AccessTypes.VIEW}</option>
          </Select>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={isLoading || shareEmail === ''} onClick={() => createShare({mapId: getMapId(), shareEmail, shareAccess})}>
          OK
        </Button>
        <Button color="gray" onClick={() => dispatch(actions.setPageState(PageState.WS))}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
