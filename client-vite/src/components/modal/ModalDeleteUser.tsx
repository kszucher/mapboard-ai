import {FC} from "react"
import {useSelector, useDispatch} from "react-redux"
import { Button, Modal, Typography } from '@mui/material'
import {nodeApi} from "../../apis/NodeApi"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {PageState} from "../../state/Enums"

export const ModalDeleteUser:FC = () => {
  const pageState = useSelector((state: RootState) => state.editor.pageState)
  const interactionDisabled = useSelector((state: RootState) => state.editor.interactionDisabled)
  const dispatch = useDispatch<AppDispatch>()
  return(
    <Modal
      open={true}
      onClose={_=>{}}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {<div className="dark:bg-zinc-800 bg-zinc-50 border-2 dark:border-neutral-700 fixed top-[80px] left-[64px] w-[192px] flex flex-col gap-4 p-4 rounded-lg">
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
          <Typography variant="subtitle2" color='primary'>
            {'ARE YOU REALLY SURE?'}
          </Typography>
        </div>
        <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
          <Button
            color="primary"
            variant='outlined'
            disabled={interactionDisabled}
            onClick={() => dispatch(nodeApi.endpoints.deleteAccount.initiate())}
          >
            {'OK'}
          </Button>
          <Button
            color="primary"
            variant='outlined'
            disabled={interactionDisabled}
            onClick={_=>dispatch(actions.setPageState(PageState.WS))}
          >
            {'CANCEL'}
          </Button>
        </div>
      </div>}
    </Modal>
  )
}
