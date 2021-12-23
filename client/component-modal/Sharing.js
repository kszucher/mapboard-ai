import React from 'react'
import {useSelector, useDispatch} from "react-redux";
import {Modal} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import StyledButton from "../component-styled/StyledButton";
import StyledInput from "../component-styled/StyledInput";
import StyledRadioButtonGroup from "../component-styled/StyledRadioButtonGroup";
import {COLORS} from "../core/Utils";
import { MAP_RIGHTS } from '../core/EditorFlow'

export function Sharing() {
    const {VIEW, EDIT} = MAP_RIGHTS

    const shareEmail = useSelector(state => state.shareEmail)
    const shareAccess = useSelector(state => state.shareAccess)
    const shareFeedbackMessage = useSelector(state => state.shareFeedbackMessage)

    const dispatch = useDispatch()
    const setShareEmail = e => dispatch({type: 'SET_SHARE_EMAIL', payload: e.target.value})
    const setShareAccess = e => dispatch({type: 'SET_SHARE_ACCESS', payload: e.target.value})
    const createShare = _ => dispatch({type: 'CREATE_SHARE', payload: {shareEmail, shareAccess}})
    const closeSharing = _ => dispatch({type: 'CLOSE_SHARING'})

    return(
        <Modal
            open={true}
            onClose={_=>{}}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={{
                position: 'relative',
                left: '50%',
                transform: 'translate(-50%)',
                top: 96,
                width: 48*8,
                // height: 800,
                flexDirection: 'column',
                alignItems: 'center',
                display: 'inline-flex',
                flexWrap: 'wrap',
                gap: 16,
                backgroundColor: COLORS.MAP_BACKGROUND,
                padding: 20,
                border: `1px solid ${COLORS.MAP_BACKGROUND}`,
                borderRadius: '16px'
            }}>
                <Typography
                    component="h1"
                    variant="h5">
                    Sharing
                </Typography>
                <StyledInput
                    label="Share email"
                    value={shareEmail}
                    onChange={setShareEmail}
                />
                <StyledRadioButtonGroup
                    open={true}
                    valueList={[VIEW, EDIT]}
                    value={shareAccess}
                    action={setShareAccess}
                />
                {shareFeedbackMessage !== '' &&
                <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center">
                    {shareFeedbackMessage}
                </Typography>}
                <StyledButton variant="outlined" onClick={createShare} name={'share'}/>
                <StyledButton variant="outlined" onClick={closeSharing} name={'close'}/>
            </div>
        </Modal>
    )
}
