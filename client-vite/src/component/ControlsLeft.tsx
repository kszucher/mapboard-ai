import {FC} from "react";
import {useDispatch} from 'react-redux'
import { IconButton } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import MoveUpIcon from '@mui/icons-material/MoveUp'
import MoveDownIcon from '@mui/icons-material/MoveDown'
import DeleteIcon from '@mui/icons-material/Delete'
import {api} from "../core/Api";

export const ControlsLeft: FC = () => {
  const dispatch = useDispatch()
  return (
    <div className="_bg fixed left-0 width-[40px] py-1 px-3 flex items-center border-l-0 bottom-[48px] rounded-r-2xl">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <IconButton
          color='secondary'
          onClick={()=>dispatch(api.endpoints.createMapInTab.initiate())}
          disabled={false}
        >
          <AddCircleOutlineIcon/>
        </IconButton>
        <IconButton
          color='secondary'
          onClick={()=>dispatch(api.endpoints.moveUpMapInTab.initiate())}
          disabled={false}
        >
          <MoveUpIcon/>
        </IconButton>
        <IconButton
          color='secondary'
          onClick={()=>dispatch(api.endpoints.moveDownMapInTab.initiate())}
          disabled={false}
        >
          <MoveDownIcon/>
        </IconButton>
        <IconButton
          color='secondary'
          onClick={()=>dispatch(api.endpoints.deleteMapInTab.initiate())}
          disabled={false}
        >
          <DeleteIcon/>
        </IconButton>
      </div>
    </div>
  )
}
