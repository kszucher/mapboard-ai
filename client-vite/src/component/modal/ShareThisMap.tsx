import {useSelector, useDispatch} from "react-redux";
import { MAP_RIGHTS } from '../../core/EditorFlow'
import { Button, FormControlLabel, FormLabel, Modal, RadioGroup, TextField, Typography, Radio } from '@mui/material'

export function ShareThisMap() {
    const {VIEW, EDIT} = MAP_RIGHTS
    const shareEmail = useSelector(state => state.shareEmail)
    const shareAccess = useSelector(state => state.shareAccess)
    const shareFeedbackMessage = useSelector(state => state.shareFeedbackMessage)
    const dispatch = useDispatch()
    const setShareEmail = e => dispatch({type: 'SET_SHARE_EMAIL', payload: e.target.value})
    const setShareAccess = e => dispatch({type: 'SET_SHARE_ACCESS', payload: e.target.value})
    const createShare = _ => dispatch({type: 'CREATE_SHARE', payload: {shareEmail, shareAccess}})
    const showWs = _ => dispatch({type: 'SHOW_WS'})
    return(
        <Modal open={true} onClose={_=>{}} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
            <div id="share-this-map-modal">
                <Typography component="h1" variant="h5" color="primary">
                    {'Share This Map'}
                </Typography>
                <TextField variant="outlined" fullWidth label="Share email" value={shareEmail} onChange={setShareEmail}/>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 32 }}>
                    <FormLabel component="legend">
                        {'Access'}
                    </FormLabel>
                    <RadioGroup aria-label="my-aria-label" name="my-name" value={shareAccess} onChange={setShareAccess} row={true}>
                        {[VIEW, EDIT].map((name, index) =>
                            <FormControlLabel value={name} control={<Radio />} label={name} key={index}/>)}
                    </RadioGroup>
                </div>
                {shareFeedbackMessage !== '' &&
                <Typography variant="body2" color="textSecondary" align="center">
                    {shareFeedbackMessage}
                </Typography>}
                <Button color="primary" variant="outlined" onClick={createShare}>
                    {'SHARE'}
                </Button>
                <Button color="primary" variant="outlined" onClick={showWs}>
                    {'CLOSE'}
                </Button>
            </div>
        </Modal>
    )
}
