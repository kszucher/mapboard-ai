import React, {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Button, Modal, TextField, Typography} from '@mui/material'
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {PageState} from "../../state/Enums"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {getX} from "../../selectors/MapSelector"
import {mSelector} from "../../state/EditorState"

export const ModalEditContentEquation: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const { isFetching } = useOpenWorkspaceQuery()
  const dispatch = useDispatch<AppDispatch>()
  return(
    <Modal open={true} onClose={_=>{}} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
      <div className="dark:bg-zinc-800 bg-zinc-50 border-2 dark:border-neutral-700 fixed top-[80px] right-[64px] w-[800px] flex flex-col gap-4 p-4 rounded-lg">
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
          <Typography variant="subtitle2" color='primary'>
            {'EQUATION'}
          </Typography>
        </div>
        <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
          <TextField id="filled-multiline-static" label="Multiline" multiline rows={20} defaultValue={getX(m).content} variant="filled" inputProps={{ maxLength: 1000 }} onChange={(e) => {
            dispatch(actions.mapAction({type: 'setContentEquation', payload: {content: e.target.value}}))
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
