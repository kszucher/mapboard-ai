import {useEffect} from 'react'
import {useSelector, useDispatch, RootStateOrAny} from "react-redux"
import { Button, IconButton, Modal, Typography } from '@mui/material'
import {DataGrid} from "@mui/x-data-grid"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CheckCircleIcon from '@mui/icons-material/AddCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'

export function Shares() {
    const shareDataExport = useSelector((state: RootStateOrAny) => state.shareDataExport).map((el: any, idx: any) => ({...el, id: idx}))
    const shareDataImport = useSelector((state: RootStateOrAny) => state.shareDataImport).map((el: any, idx: any) => ({...el, id: idx}))
    const dispatch = useDispatch()
    const getShares = () => dispatch({type: 'GET_SHARES'})
    const showWs = () => dispatch({type: 'SHOW_WS'})
    const acceptShare = (params: any) => dispatch({type: 'ACCEPT_SHARE', payload: {shareId: params.row._id}})
    const deleteShare = (params: any) => dispatch({type: 'DELETE_SHARE', payload: {shareId: params.row._id}})

    const columnsExport = [
        {field: 'sharedMapName',  headerName: 'Map Name',    width: 200, sortable: false, editable: false},
        {field: 'shareUserEmail', headerName: 'Shared With', width: 250, sortable: false, editable: false},
        {field: 'access',         headerName: 'Access',      width: 140, sortable: false, editable: false},
        {field: 'status',         headerName: 'Status',      width: 140, sortable: false, editable: false},
        {field: ' ',              headerName: 'Actions',     width: 200, renderCell: (params: any) => (
                <strong>
                    <IconButton
                        aria-label="xxx"
                        size="small"
                        onClick={_=>deleteShare(params)}
                        disabled={false}>
                        <CancelOutlinedIcon/>
                    </IconButton>
                </strong>
            ),
        }
    ];

    const columnsImport = [
        {field: 'sharedMapName',  headerName: 'Map Name',    width: 200, sortable: false, editable: false},
        {field: 'ownerUserEmail', headerName: 'Shared By',   width: 250, sortable: false, editable: false},
        {field: 'access',         headerName: 'Access',      width: 140, sortable: false, editable: false},
        {field: 'status',         headerName: 'Status',      width: 140, sortable: false, editable: false},
        {field: ' ',              headerName: 'Actions',     width: 200, renderCell: (params: any) => (
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

    return (
        <Modal
            open={true}
            onClose={_=>{}}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
            {<div id="shares">
                <Typography component="h1" variant="h5" color="primary">{'Maps I Share With Others'}</Typography>
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
                <Typography component="h1" variant="h5" color="primary">{'Maps Others Share With Me'}</Typography>
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
                <Button color="primary" variant='outlined' onClick={getShares}>{'REFRESH'}</Button>
                <Button color="primary" variant='outlined' onClick={showWs}>{'CLOSE'}</Button>
            </div>}
        </Modal>
    )
}
