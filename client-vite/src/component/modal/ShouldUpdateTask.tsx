import {useSelector, useDispatch, RootStateOrAny} from "react-redux";
import { Button, Modal, Typography } from '@mui/material'

export function ShouldUpdateTask() {
    const interactionDisabled = useSelector((state: RootStateOrAny) => state.interactionDisabled)
    const dispatch = useDispatch()
    const showWs = _ => dispatch({type: 'SHOW_WS'})
    const toggleTask = _=> dispatch({type: 'TOGGLE_TASK'})
    return(
        <Modal open={true} onClose={_=>{}} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
            {<div id="update-task">
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <Typography variant="subtitle2" color='primary'>{'TOGGLE TASK MODE?'}</Typography>
                </div>
                <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <Button color="primary" variant='outlined' onClick={toggleTask} disabled={interactionDisabled}>
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
