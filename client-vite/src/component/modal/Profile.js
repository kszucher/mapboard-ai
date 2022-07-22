import {useSelector, useDispatch} from "react-redux";
import { Button, Modal } from '@mui/material'

export function Settings() {
    const name = useSelector(state => state.name)
    const dispatch = useDispatch()
    const closeSettings = _ => dispatch({type: 'SHOW_WS'})
    return(
        <Modal
            open={true}
            onClose={_=>{}}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">

            <div id="profile">
                <Button color="primary" variant="outlined" onClick={closeSettings}>
                    {'CLOSE'}
                </Button>
            </div>

        </Modal>
    )
}
