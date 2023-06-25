import {FC, useState} from 'react'
import {useDispatch} from "react-redux"
import { Button, Modal, Typography } from '@mui/material'
import { ModalDeleteUser } from './ModalDeleteUser'
import {actions, AppDispatch} from "../core/EditorReducer"
import {PageState} from "../state/Enums"
import {useOpenWorkspaceQuery} from "../core/Api"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"

export const Profile: FC = () => {
  const [childModalOpen, setChildModalOpen] = useState(false)
  const { data } = useOpenWorkspaceQuery()
  const { name } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Modal open={true} onClose={_=>{}} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
      <div className="_bg fixed left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 top-[96px] p-5 rounded-lg">
        <Typography component="h1" variant="h5" color="primary">
          {name}
        </Typography>
        <Button color="primary" variant="contained" onClick={_=>setChildModalOpen(true)}>
          {'DELETE ACCOUNT'}
        </Button>
        <Button color="primary" variant="outlined" onClick={_=>dispatch(actions.setPageState(PageState.WS))}>
          {'CLOSE'}
        </Button>
        {
          childModalOpen &&
          <ModalDeleteUser/>
        }
      </div>

    </Modal>
  )
}
