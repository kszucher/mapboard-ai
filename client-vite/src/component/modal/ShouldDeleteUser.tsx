import {useSelector, useDispatch, RootStateOrAny} from "react-redux";
import { Button, Modal, Typography } from '@mui/material'

export function ShouldDeleteUser() {
    const interactionDisabled = useSelector((state: RootStateOrAny) => state.interactionDisabled)
    const dispatch = useDispatch()
    const showWs = () => dispatch({type: 'SHOW_WS'})
    const deleteAccount = () => dispatch({type: 'DELETE_ACCOUNT'})
    return(
        <Modal open={true} onClose={_=>{}} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
            {<div id="should-delete-user">
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <Typography variant="subtitle2" color='primary'>{'ARE YOU REALLY SURE?'}</Typography>
                </div>
                <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <Button color="primary" variant='outlined' onClick={deleteAccount} disabled={interactionDisabled}>
                        {'OK'}
                    </Button>
                    <Button color="primary" variant='outlined' onClick={showWs} disabled={interactionDisabled}>
                        {'CANCEL'}
                    </Button>
                </div>
            </div>}
        </Modal>
    )
}
