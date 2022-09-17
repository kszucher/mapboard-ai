import {useSelector, useDispatch, RootStateOrAny} from "react-redux";
import { MAP_RIGHTS } from '../core/EditorFlow'
import { Button, FormControlLabel, FormLabel, Modal, RadioGroup, TextField, Typography, Radio } from '@mui/material'

export function ShareThisMap() {
    const {VIEW, EDIT} = MAP_RIGHTS
    const shareEmail = useSelector((state: RootStateOrAny) => state.shareEmail)
    const shareAccess = useSelector((state: RootStateOrAny) => state.shareAccess)
    const shareFeedbackMessage = useSelector((state: RootStateOrAny) => state.shareFeedbackMessage)
    const dispatch = useDispatch()
    const setShareEmail = (value: string) => dispatch({type: 'SET_SHARE_EMAIL', payload: value})
    const setShareAccess = (value: string) => dispatch({type: 'SET_SHARE_ACCESS', payload: value})
    const createShare = () => dispatch({type: 'CREATE_SHARE', payload: {shareEmail, shareAccess}})
    const showWs = () => dispatch({type: 'SHOW_WS'})
    return(
        <Modal open={true} onClose={_=>{}} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
            <div className="_bg relative left-1/2 -translate-x-1/2 top-[96px] w-[384px] flex flex-col items-center inline-flex gap-4 p-5 rounded-2xl">
                <Typography component="h1" variant="h5" color="primary">
                    {'Share This Map'}
                </Typography>
                <TextField
                    variant="outlined"
                    fullWidth
                    label="Share email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                />
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 32 }}>
                    <FormLabel component="legend">
                        {'Access'}
                    </FormLabel>
                    <RadioGroup
                        aria-label="my-aria-label"
                        name="my-name"
                        value={shareAccess}
                        onChange={(e) => setShareAccess(e.target.value)}
                        row={true}
                    >
                        {
                            [VIEW, EDIT].map((name, index) =>
                                <FormControlLabel value={name} control={<Radio />} label={name} key={index}/>)
                        }
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
