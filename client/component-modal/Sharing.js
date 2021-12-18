import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from "react-redux";
import {Modal} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import StyledButton from "../component-styled/StyledButton";
import StyledInput from "../component-styled/StyledInput";
import StyledRadioButtonGroup from "../component-styled/StyledRadioButtonGroup";
import {COLORS} from "../core/Utils";

export function Sharing() {
    // const serverResponse = useSelector(state => state.serverResponse)
    // const serverResponseCntr = useSelector(state => state.serverResponseCntr)
    const dispatch = useDispatch()

    const [email, setEmail] = useState('test2@mapboard.io');
    const [access, setAccess] = useState('view')
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const typeEmail =    (e) => setEmail(e.target.value)
    const closeSharing = _ =>   dispatch({type: 'CLOSE_SHARING'})
    const createShare =  _ =>   dispatch({type: 'CREATE_SHARE', payload: {email, access}})

    // useEffect(() => {
    //     switch (serverResponse.cmd) {
    //         case 'createShareFailNotAValidUser':            setFeedbackMessage('There is no user associated with this address.'); break;
    //         case 'createShareFailCantShareWithYourself':    setFeedbackMessage('Please choose a different address than yours.'); break;
    //         case 'createShareSuccess':                      setFeedbackMessage('The map has been shared successfully.'); break;
    //         case 'createShareFailAlreadyShared':            setFeedbackMessage('The map has already been shared.'); break;
    //         case 'updateShareSuccess':                      setFeedbackMessage('Access has changed successfully.'); break;
    //     }
    // }, [serverResponseCntr]);

    return(
        <Modal
            open={true}
            onClose={_=>{}}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            {<div style={{
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
                    open={true}
                    label="Email"
                    value={email}
                    action={typeEmail}
                />
                <StyledRadioButtonGroup
                    open={true}
                    valueList={['view', 'edit']}
                    value={access}
                    action={e=>setAccess(e.target.value)}
                />
                {feedbackMessage !== '' &&
                <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center">
                    {feedbackMessage}
                </Typography>}
                <StyledButton
                    version="shortOutlined"
                    disabled={false}
                    action={createShare}
                    name={'share'}
                />
                <StyledButton
                    version={'shortOutlined'}
                    name={'close'}
                    action={closeSharing}
                />
            </div>}
        </Modal>
    )
}
