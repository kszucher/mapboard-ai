import {FC} from 'react'
import {useDispatch} from "react-redux"
import {DataGrid} from "@mui/x-data-grid"
import { Button, IconButton, Modal, Typography } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CheckCircleIcon from '@mui/icons-material/AddCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import {actions} from "../editor/EditorReducer";
import {PageState} from "../core/Enums";
import {api, useGetSharesQuery} from "../core/Api";

export const Shares: FC = () => {
  const { data, isFetching } = useGetSharesQuery()
  let { shareDataExport, shareDataImport } = data || { shareDataExport: [], shareDataImport: []}
  shareDataExport = shareDataExport.map((el: any) => ({...el, id: el._id}))
  shareDataImport = shareDataImport.map((el: any) => ({...el, id: el._id}))
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
            onClick={()=>dispatch(api.endpoints.deleteMap.initiate({mapId: params.row._id}))}
            disabled={false}
          >
            <CancelOutlinedIcon/>
          </IconButton>
        </strong>
      )
    }
  ]
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
            onClick={()=>dispatch(api.endpoints.acceptShare.initiate({shareId: params.row._id}))}
            disabled={params.row.status === 'accepted'}
          >
            {params.row.status === 'waiting' && <AddCircleOutlineIcon/>}
            {params.row.status === 'accepted' && <CheckCircleIcon/>}
          </IconButton>
        </strong>
      )
    }
  ]
  return (
    <Modal open={true} onClose={_=>{}} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
      <div className="_bg relative left-1/2 -translate-x-1/2 top-[96px] w-[860px] flex flex-col items-center gap-4 p-5 rounded-2xl">
        <Typography component="h1" variant="h5" color="primary">
          {'Maps I Share With Others'}
        </Typography>
        <div style={{ width: '100%' }}>
          {shareDataExport.length > 0 &&
            <DataGrid
              rows={shareDataExport}
              columns={columnsExport}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              disableSelectionOnClick
              autoHeight={true}
            />}
        </div>
        <Typography component="h1" variant="h5" color="primary">
          {'Maps Others Share With Me'}
        </Typography>
        <div style={{ width: '100%' }}>
          {shareDataImport.length > 0 &&
            <DataGrid
              rows={shareDataImport}
              columns={columnsImport}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              disableSelectionOnClick
              autoHeight={true}
            />}
        </div>
        <Button
          color="primary"
          variant='outlined'
          onClick={() => dispatch(actions.setPageState(PageState.WS))}>
          {'CLOSE'}
        </Button>
      </div>
    </Modal>
  )
}
