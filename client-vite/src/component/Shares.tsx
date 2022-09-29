import {FC, useEffect} from 'react'
import {useSelector, useDispatch, RootStateOrAny} from "react-redux"
import {DataGrid} from "@mui/x-data-grid"
import { Button, IconButton, Modal, Typography } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CheckCircleIcon from '@mui/icons-material/AddCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import {actions, sagaActions, PageState} from "../core/EditorFlow";

export const Shares: FC = () => {
  const shareDataExport = useSelector((state: RootStateOrAny) => state.shareDataExport).map((el: any, idx: any) => ({...el, id: idx}))
  const shareDataImport = useSelector((state: RootStateOrAny) => state.shareDataImport).map((el: any, idx: any) => ({...el, id: idx}))
  const dispatch = useDispatch()
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
            onClick={_=>dispatch(sagaActions.deleteShare(params.row._id))}
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
            onClick={_=>dispatch(sagaActions.acceptShare(params.row._id))}
            disabled={params.row.status === 'accepted'}>
            {params.row.status === 'waiting' && <AddCircleOutlineIcon/>}
            {params.row.status === 'accepted' && <CheckCircleIcon/>}
          </IconButton>
        </strong>
      ),
    }
  ];

  useEffect(() => {
    dispatch(sagaActions.getShares())
  }, []);

  return (
    <Modal open={true} onClose={_=>{}} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
      {<div className="_bg relative left-1/2 -translate-x-1/2 top-[96px] w-[790px] flex flex-col items-center gap-4 p-5 rounded-2xl">
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
        <Button color="primary" variant='outlined' onClick={_=>dispatch(sagaActions.getShares())}>
          {'REFRESH'}
        </Button>
        <Button color="primary" variant='outlined'
                onClick={_=>dispatch(actions.setPageState(PageState.WS))}>
          {'CLOSE'}
        </Button>
      </div>}
    </Modal>
  )
}
