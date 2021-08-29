import React, {useContext, useState} from 'react'
import {Context} from "../core/Store";
import {PAGE_STATES} from "../core/EditorFlow";
import {Modal} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import StyledButton from "../component-styled/StyledButton";
import StyledInput from "../component-styled/StyledInput";
import StyledRadioButtonGroup from "../component-styled/StyledRadioButtonGroup";

export function SharingEditor() {
    const [state, dispatch] = useContext(Context);
    const {pageState} = state;
    const [email, setEmail] = useState('');
    const [access, setAccess] = useState('view')

    const typeEmail = (e) =>        setEmail(e.target.value)
    const closeSharingEditor = _ => dispatch({type: 'CLOSE_SHARING_EDITOR'})
    const checkValidity = _=>       dispatch({type: 'CHECK_VALIDITY', payload: {email, access}})


    return(
        <Modal
            open={pageState === PAGE_STATES.WORKSPACE_SHARING}
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
                <Typography component="h1" variant="h5">Sharing</Typography>

                <StyledInput open={true} label="Email" value={email} action={typeEmail}/>

                <StyledRadioButtonGroup open={true} valueList={['view', 'edit']} value={access} action={e=>setAccess(e.target.value)}/>

                <StyledButton version="longContained" disabled={false} action={checkValidity} name={'check validity'}/>

                <StyledButton version={'shortOutlined'} name={'Close'} action={closeSharingEditor}/>

            </div>}
        </Modal>
    )
}
