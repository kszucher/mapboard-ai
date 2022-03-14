import React, {useEffect} from 'react'
import {useSelector, useDispatch} from "react-redux"
import { Button, IconButton, Modal, Typography } from '@mui/material'
import {DataGrid} from "@mui/x-data-grid"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/AddCircleOutline';
import { getColors } from '../core/Colors'

export function Shares() {
    const shareDataExport = useSelector(state => state.shareDataExport)
    const shareDataImport = useSelector(state => state.shareDataImport)
    const dispatch = useDispatch()

    const getShares =     _ =>      dispatch({type: 'GET_SHARES'})
    const closeShares =   _ =>      dispatch({type: 'CLOSE_SHARES'})
    const acceptShare =   params => dispatch({type: 'ACCEPT_SHARE', payload: {shareIdOut: params.row._id}})
    const deleteShare =   params => dispatch({type: 'DELETE_SHARE', payload: {shareIdOut: params.row._id}})

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
                        onClick={_=>deleteShare(params)}
                        disabled={false}>
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
                        disabled={params.row.status === 'accepted'}>
                        {params.row.status === 'waiting' && <AddCircleOutlineIcon/>}
                        {params.row.status === 'accepted' && <CheckCircleIcon/>}
                    </IconButton>
                </strong>
            ),
        }
    ];

    useEffect(() => {
        getShares()
    }, []);

    return(
        <Modal
            open={true}
            onClose={_=>{}}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
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
                backgroundColor: getColors('light').MAP_BACKGROUND,
                padding: 20,
                border: `1px solid ${getColors('light').MAP_BACKGROUND}`,
                borderRadius: '16px'}}>
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
                        autoHeight={true}/>}
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
                        autoHeight={true}/>}
                </div>
                <Button
                    color="primary"
                    variant='outlined'
                    onClick={getShares}>
                    {'REFRESH'}
                </Button>
                <Button
                    color="primary"
                    variant='outlined'
                    onClick={closeShares}>
                    {'CLOSE'}
                </Button>
            </div>}
        </Modal>
    )
}
