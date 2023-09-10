import {useAuth0} from "@auth0/auth0-react";
import {FC, useState} from 'react'
import {useDispatch} from "react-redux"
import { Button, Modal, Typography } from '@mui/material'
import { ModalDeleteUser } from './ModalDeleteUser'
import {actions, AppDispatch} from "../reducers/EditorReducer"
import {PageState} from "../state/Enums"
import {nodeApi, useOpenWorkspaceQuery} from "../apis/NodeApi"
import {defaultUseOpenWorkspaceQueryState} from "../state/NodeApiState"

export const Profile: FC = () => {
  const [childModalOpen, setChildModalOpen] = useState(false)
  const { data } = useOpenWorkspaceQuery()
  const { name } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  const { logout } = useAuth0()
  return (
    <Modal open={true} onClose={_=>{}} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
      <div className="_bg fixed flex flex-col items-center gap-4 top-[80px] right-0 p-5 rounded-lg">
        <Typography component="h1" variant="h5" color="primary">{name}</Typography>
        <Button color="primary" variant="contained" onClick={()=>{
          logout({ logoutParams: { returnTo: window.location.origin }})
          dispatch(actions.resetState())
          dispatch(nodeApi.util.resetApiState())
        }}>{'SIGN OUT'}</Button>
        <Button color="primary" variant="contained" onClick={()=>{
          logout({ logoutParams: { returnTo: window.location.origin }})
          dispatch(nodeApi.endpoints.signOutEverywhere.initiate())
          dispatch(actions.resetState())
          dispatch(nodeApi.util.resetApiState())
        }}>{'SIGN OUT EVERYWHERE'}</Button>
        <Button color="primary" variant="outlined" onClick={_=>setChildModalOpen(true)}>{'DELETE ACCOUNT'}</Button>
        <Button color="primary" variant="outlined" onClick={_=>dispatch(actions.setPageState(PageState.WS))}>{'CLOSE'}</Button>
        {childModalOpen && <ModalDeleteUser/>}
      </div>
    </Modal>
  )
}
