import {useSelector, useDispatch} from "react-redux";
import { Button, Modal, Typography } from '@mui/material'

export function Profile() {
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
                <Typography component="h1" variant="h5" color="primary">
                    {name}
                </Typography>
                <Button color="primary" variant="outlined" onClick={closeSettings}>
                    {'CLOSE'}
                </Button>
            </div>

        </Modal>
    )
}
