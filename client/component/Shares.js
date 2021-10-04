import React, {useContext, useEffect} from 'react'
import {Context} from "../core/Store";
import {Modal} from "@material-ui/core";
import StyledButton from "../component-styled/StyledButton";
import {DataGrid} from "@mui/x-data-grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutlined'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import {COLORS} from "../core/Utils";

export function Shares() {
    const [state, dispatch] = useContext(Context);
    const {shareDataExport, shareDataImport} = state;

    const closeSharing = _ =>         dispatch({type: 'CLOSE_WORKSPACE_MODAL'})
    const acceptShare = params =>     dispatch({type: 'ACCEPT_SHARE', payload: {shareIdOut: params.row._id}})
    const withdrawShare = params =>   dispatch({type: 'WITHDRAW_SHARE', payload: {shareIdOut: params.row._id}})

    const columnsExport = [
        {field: 'map',            headerName: 'Map Name',    width: 200, sortable: false, editable: false},
        {field: 'shareUserEmail', headerName: 'Shared With', width: 250, sortable: false, editable: false},
        {field: 'access',         headerName: 'Access',      width: 140, sortable: false, editable: false},
        {field: 'status',         headerName: 'Status',      width: 140, sortable: false, editable: false},
        {field: ' ',              headerName: 'Actions',     width: 200, renderCell: (params) => (
                <strong>
                    <IconButton
                        aria-label="xxx"
                        size="small"
                        onClick={_=>withdrawShare(params)}
                        disabled={false}
                    >
                        <CancelIcon/>
                    </IconButton>
                </strong>
            ),
        }
    ];

    const columnsImport = [
        {field: 'map',            headerName: 'Map Name',    width: 200, sortable: false, editable: false},
        {field: 'shareUserEmail', headerName: 'Shared By',   width: 250, sortable: false, editable: false},
        {field: 'access',         headerName: 'Access',      width: 140, sortable: false, editable: false},
        {field: 'status',         headerName: 'Status',      width: 140, sortable: false, editable: false},
        {field: ' ',              headerName: 'Actions',     width: 200, renderCell: (params) => (
                <strong>
                    <IconButton
                        aria-label="xxx"
                        size="small"
                        onClick={_=>acceptShare(params)}
                        disabled={params.row.status === 'accepted'}
                    >
                        {params.row.status === 'waiting' && <AddCircleOutlineIcon/>}
                        {params.row.status === 'accepted' && <CheckCircleIcon/>}
                    </IconButton>
                </strong>
            ),
        }
    ];

    useEffect(() => {
        dispatch({type: 'GET_SHARES'})
    }, []);

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
                // maxWidth: 'fit-content',
                width: 200+250+140+140+200,
                // height: 1200,
                flexDirection: 'column',
                alignItems: 'center',
                display: 'flex',
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
                    Maps I Share With Others
                </Typography>
                <div style={{ width: '100%' }}>
                    {shareDataExport.length > 0 && <DataGrid
                        rows={shareDataExport}
                        columns={columnsExport}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableSelectionOnClick
                        autoHeight={true}
                    />}
                </div>
                <Typography
                    component="h1"
                    variant="h5">
                    Maps Others Share With Me
                </Typography>
                <div style={{ width: '100%' }}>
                    {shareDataImport.length > 0 && <DataGrid
                        rows={shareDataImport}
                        columns={columnsImport}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableSelectionOnClick
                        autoHeight={true}
                    />}
                </div>
                <StyledButton
                    version={'shortOutlined'}
                    name={'close'}
                    action={closeSharing}/>
            </div>}
        </Modal>
    )
}
