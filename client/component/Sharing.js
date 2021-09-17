import React, {useContext, useState} from 'react'
import {Context} from "../core/Store";
import {Modal} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import StyledButton from "../component-styled/StyledButton";
import StyledInput from "../component-styled/StyledInput";
import StyledRadioButtonGroup from "../component-styled/StyledRadioButtonGroup";

export function Sharing() {
    const [state, dispatch] = useContext(Context);
    const [email, setEmail] = useState('test1@mapboard.io');
    const [access, setAccess] = useState('view')

    const typeEmail = (e) =>
        setEmail(e.target.value)
    const closeSharing = _ =>
        dispatch({type: 'CLOSE_WORKSPACE_MODAL'})
    const createShare = _=>
        dispatch({type: 'CREATE_SHARE', payload: {email, access}})

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
                backgroundColor: '#fbfafc',
                padding: 20,
                border: "1px solid #fbfafc",
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
                <StyledButton
                    version="shortContained"
                    disabled={false}
                    action={createShare}
                    name={'share'}
                />
                <StyledButton
                    version={'shortOutlined'}
                    name={'close without sharing'}
                    action={closeSharing}
                />
            </div>}
        </Modal>
    )
}
