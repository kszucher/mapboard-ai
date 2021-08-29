import React, {useContext, useState} from 'react'
import {Context} from "../core/Store";
import {Modal} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import StyledButton from "../component-styled/StyledButton";
import StyledInput from "../component-styled/StyledInput";
import {PAGE_STATES} from "../core/EditorFlow";

export function SharingEditor() {
    const [state, dispatch] = useContext(Context);
    const {pageState} = state;
    const [email, setEmail] = useState('');

    const typeEmail = (e) => {setEmail(e.target.value)}
    const closeSharingEditor = _ => dispatch({type: 'CLOSE_SHARING_EDITOR'})

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

                {/*CHECK VALIDITY*/}

                {/*SAVE*/}

                <StyledButton version={'shortOutlined'} name={'Close'} action={closeSharingEditor}/>

            </div>}
        </Modal>
    )
}
