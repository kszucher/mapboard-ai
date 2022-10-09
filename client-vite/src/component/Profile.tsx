import {FC, useState} from 'react'
import {useSelector, useDispatch, RootStateOrAny} from "react-redux";
import { Button, Modal, Typography } from '@mui/material'
import { ShouldDeleteUser } from './ShouldDeleteUser'
import {actions} from "../core/EditorFlow";
import {PageState} from "../core/Types";

export const Profile: FC = () => {
  const [childModalOpen, setChildModalOpen] = useState(false)
  const name = useSelector((state: RootStateOrAny) => state.name)
  const dispatch = useDispatch()
  return (
    <Modal open={true} onClose={_=>{}} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
      <div className="_bg fixed left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 top-[96px] p-5 rounded-2xl">
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
          <ShouldDeleteUser/>
        }
      </div>

    </Modal>
  )
}
