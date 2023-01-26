import {FC, useState} from "react";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {actions, defaultUseOpenWorkspaceQueryState} from '../core/EditorFlow'
import {Button, FormControlLabel, FormLabel, Modal, Radio, RadioGroup, TextField, Typography} from '@mui/material'
import {AccessTypes, PageState} from "../core/Types";
import {api, useCreateShareMutation, useGetSharesQuery} from "../core/Api";
import {BaseQueryError} from "@reduxjs/toolkit/dist/query/baseQueryTypes";

export const ShareThisMap: FC = () => {
  const [ createShare,  response ] = useCreateShareMutation()
  const errorMessage = (response.error as BaseQueryError<any>)?.data?.message
  const [shareEmail, setShareEmail] = useState('')
  const [shareAccess, setShareAccess] = useState('')
  const dispatch = useDispatch()
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
            onChange={(e) => setShareAccess(e.target.value)}>
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
          onClick={() => createShare({shareEmail, shareAccess})}
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
