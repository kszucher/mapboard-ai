import {FC, useState} from "react";
import {useDispatch} from "react-redux";
import {actions, AppDispatch} from '../editor/EditorReducer'
import {Button, FormControlLabel, FormLabel, Modal, Radio, RadioGroup, TextField, Typography} from '@mui/material'
import {AccessTypes, PageState} from "../core/Enums";
import { useCreateShareMutation} from "../core/Api";
import {BaseQueryError} from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {getMapId} from "../state/ApiState";

export const ModalShareThisMap: FC = () => {
  const [ createShare,  response ] = useCreateShareMutation()
  const errorMessage = (response.error as BaseQueryError<any>)?.data?.message
  const [shareEmail, setShareEmail] = useState('')
  const [shareAccess, setShareAccess] = useState(AccessTypes.VIEW)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Modal open={true} onClose={_=>{}} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
      <div className="_bg relative left-1/2 -translate-x-1/2 top-[96px] w-[384px] flex flex-col items-center inline-flex gap-4 p-5 rounded-2xl">
        <Typography component="h1" variant="h5" color="primary">
          {'Share This Map'}
        </Typography>
        <TextField
          variant="outlined" fullWidth label="Share email"
          value={shareEmail}
          onChange={(e) => setShareEmail(e.target.value)}/>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 32 }}>
          <FormLabel component="legend">
            {'Access'}
          </FormLabel>
          <RadioGroup
            aria-label="my-aria-label" name="my-name" row={true}
            value={shareAccess}
            onChange={(e) => setShareAccess(e.target.value as AccessTypes)}>
            {[AccessTypes.VIEW, AccessTypes.EDIT].map(
              (name, index) => <FormControlLabel value={name} control={<Radio />} label={name} key={index}/>
            )}
          </RadioGroup>
        </div>
        {errorMessage !== '' &&
          <Typography variant="body2" color="textSecondary" align="center">
            {errorMessage}
          </Typography>
        }
        <Button
          color="primary" variant="outlined"
          onClick={() => createShare({mapId: getMapId(), shareEmail, shareAccess})}
        >
          {'SHARE'}
        </Button>
        <Button
          color="primary" variant="outlined"
          onClick={_=>dispatch(actions.setPageState(PageState.WS))}>
          {'CLOSE'}
        </Button>
      </div>
    </Modal>
  )
}
