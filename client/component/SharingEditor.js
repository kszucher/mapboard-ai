import React, {useContext, useState} from 'react'
import {Context} from "../core/Store";
import {PAGE_STATES} from "../core/EditorFlow";
import {Modal} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import StyledButton from "../component-styled/StyledButton";
import StyledInput from "../component-styled/StyledInput";
import StyledRadioButtonGroup from "../component-styled/StyledRadioButtonGroup";
import {DataGrid} from "@mui/x-data-grid";

export function SharingEditor() {
    const [state, dispatch] = useContext(Context);
    const {pageState, shareDataExtended} = state;
    const [email, setEmail] = useState('test1@mapboard.io');
    const [access, setAccess] = useState('view')

    const typeEmail = (e) =>        setEmail(e.target.value)
    const closeSharingEditor = _ => dispatch({type: 'CLOSE_SHARING_EDITOR'})
    const createShare = _=>         dispatch({type: 'CREATE_SHARE', payload: {email, access}})

    const columns = [
        {
            field: 'map',
            headerName: 'Map Name',
            width: 200,
            sortable: false,
            editable: false,
        },
        {
            field: 'shareUserEmail',
            headerName: 'Shared With',
            width: 250,
            sortable: false,
            editable: false,
        },
        {
            field: 'access',
            headerName: 'Access',
            type: 'number',
            width: 140,
            sortable: false,
            editable: false,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 140,
            sortable: false,
            editable: false,
        },
    ];

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
                width: 48*16,
                height: 800,
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
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={shareDataExtended}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableSelectionOnClick
                    />
                </div>
                <StyledButton version="shortContained" disabled={false} action={createShare} name={'share'}/>
                <StyledButton version={'shortOutlined'} name={'close without sharing'} action={closeSharingEditor}/>
            </div>}
        </Modal>
    )
}

// TODO: shares and sharing are different,
// introduce PROGRESS LOADER and get results from the server!!!!
