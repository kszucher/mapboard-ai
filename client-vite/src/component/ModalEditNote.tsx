import React, {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Button, Modal, TextField, Typography} from '@mui/material'
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import {PageState} from "../state/Enums"
import {useOpenWorkspaceQuery} from "../core/Api"
import {getR0} from "../core/MapUtils"
import {mSelector} from "../state/EditorState"

export const ModalEditNote: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const { isFetching } = useOpenWorkspaceQuery()
  const dispatch = useDispatch<AppDispatch>()
  return(
    <Modal open={true} onClose={_=>{}} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
      <div className="_bg fixed top-[80px] right-[64px] w-[400px] flex flex-col gap-4 p-4 rounded-lg">
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
          <Typography variant="subtitle2" color='primary'>
            {'DATA (max. 20000 characters):'}
          </Typography>
        </div>
        <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
          <TextField id="filled-multiline-static" label="Multiline" multiline rows={20} defaultValue={getR0(m).note} variant="filled" inputProps={{ maxLength: 20000 }} onChange={(e) => {
            dispatch(actions.mapAction({type: 'setNote', payload: {note: e.target.value}}))
          }}/>
          <Button color="primary" variant='outlined' disabled={isFetching} onClick={() =>
            dispatch(actions.setPageState(PageState.WS))
          }>
            {'CLOSE'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
