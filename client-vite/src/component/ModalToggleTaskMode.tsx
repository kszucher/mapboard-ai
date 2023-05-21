import {FC} from "react";
import {useDispatch} from "react-redux";
import { Button, Modal, Typography } from '@mui/material'
import {actions, AppDispatch} from "../core/EditorReducer";
import {PageState} from "../state/Enums";

export const ModalToggleTaskMode: FC = () => {
  const interactionDisabled = false
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Modal
      open={true}
      onClose={_=>{}}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {<div className="_bg fixed top-[96px] right-[64px] w-[192px] flex flex-col gap-4 p-4 rounded-lg">
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
          <Typography variant="subtitle2" color='primary'>
            {'TOGGLE TASK MODE?'}
          </Typography>
        </div>
        <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
          <Button color="primary" variant='outlined' disabled={interactionDisabled}
                  onClick={()=>{
                    dispatch(actions.mapAction({type: 'toggleTask', payload:{}}))
                    dispatch(actions.setPageState(PageState.WS))
                  }}>
            {'OK'}
          </Button>
          <Button color="primary" variant='outlined' disabled={interactionDisabled}
                  onClick={_=>dispatch(actions.setPageState(PageState.WS))}>
            {'CANCEL'}
          </Button>
        </div>
      </div>}
    </Modal>
  )
}
