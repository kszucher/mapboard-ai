import React, {useContext} from 'react'
import {Context} from "../core/Store";
import {Modal} from "@material-ui/core";
import StyledButton from "../component-styled/StyledButton";
import {DataGrid} from "@mui/x-data-grid";
import Typography from "@material-ui/core/Typography";

export function Shares() {
    const [state, dispatch] = useContext(Context);
    const {shareDataExport} = state;

    const closeSharing = _ =>       dispatch({type: 'CLOSE_WORKSPACE_MODAL'})

    const columns = [
        {field: 'map',            headerName: 'Map Name',    width: 200, sortable: false, editable: false                },
        {field: 'shareUserEmail', headerName: 'Shared With', width: 250, sortable: false, editable: false                },
        {field: 'access',         headerName: 'Access',      width: 140, sortable: false, editable: false, type: 'number'},
        {field: 'status',         headerName: 'Status',      width: 140, sortable: false, editable: false                },
    ];

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
                width: 48*16,
                // height: 1200,
                flexDirection: 'column',
                alignItems: 'center',
                display: 'flex',
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
                    My Shares
                </Typography>
                <div style={{ width: '100%' }}>
                    <DataGrid
                        rows={shareDataExport}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableSelectionOnClick
                        autoHeight={true}
                    />
                </div>
                <Typography
                    component="h1"
                    variant="h5">
                    Shared With Me
                </Typography>
                <div style={{ width: '100%' }}>
                    <DataGrid
                        rows={shareDataExport}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableSelectionOnClick
                        autoHeight={true}
                    />
                </div>
                <StyledButton version={'shortOutlined'} name={'close'} action={closeSharing}/>
            </div>}
        </Modal>
    )
}
