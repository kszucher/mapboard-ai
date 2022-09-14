import {useSelector, useDispatch, RootStateOrAny} from "react-redux";
import { Button, Modal, Typography } from '@mui/material'
import { useState } from 'react'
import { ShouldDeleteUser } from './ShouldDeleteUser'

export function Profile() {
    const name = useSelector((state: RootStateOrAny) => state.name)
    const dispatch = useDispatch()
    const closeSettings = () => dispatch({type: 'SHOW_WS'})
    const [childModalOpen, setChildModalOpen] = useState(false)
    return(
        <Modal open={true} onClose={_=>{}} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
            <div className="_bg fixed left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 top-[96px] p-5 rounded-2xl">
                <Typography component="h1" variant="h5" color="primary">
                    {name}
                </Typography>

                <h1 className="text-yellow-500">
                    Hello world!
                </h1>

                <Button color="primary" variant="contained" onClick={_=>setChildModalOpen(true)}>
                    {'DELETE ACCOUNT'}
                </Button>
                <Button color="primary" variant="outlined" onClick={closeSettings}>
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
