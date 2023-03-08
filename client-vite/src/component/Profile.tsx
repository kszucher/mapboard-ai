import {FC, useState} from 'react'
import {useSelector, useDispatch, RootStateOrAny} from "react-redux";
import { Button, Modal, Typography } from '@mui/material'
import { ShouldDeleteUser } from './ShouldDeleteUser'
import {actions, defaultUseOpenWorkspaceQueryState} from "../core/EditorFlow";
import {PageState} from "../core/Enums";
import {useOpenWorkspaceQuery} from "../core/Api";

export const Profile: FC = () => {
  const [childModalOpen, setChildModalOpen] = useState(false)
  const pageState = useSelector((state: RootStateOrAny) => state.editor.pageState)
  const { data, isFetching } = useOpenWorkspaceQuery(undefined, { skip:  pageState === PageState.AUTH  })
  const { name } = data || defaultUseOpenWorkspaceQueryState
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
