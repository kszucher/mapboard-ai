import {FC} from "react";
import {useSelector, useDispatch, RootStateOrAny} from "react-redux";
import { Button, Modal, Typography } from '@mui/material'
import {actions, getMapCreationProps} from "../core/EditorFlow";
import {PageState} from "../core/Types";
import {api} from "../core/Api";

export const ShouldCreateMapInMap: FC = () => {
  const interactionDisabled = useSelector((state: RootStateOrAny) => state.editor.interactionDisabled)
  const dispatch = useDispatch()
  return(
    <Modal open={true} onClose={_=>{}} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
      {<div className="_bg fixed top-[96px] right-[64px] w-[192px] flex flex-col gap-4 p-4 rounded-2xl">
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
          <Typography variant="subtitle2" color='primary'>
            {'CREATE SUBMAP?'}
          </Typography>
        </div>
        <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
          <Button
            color="primary" variant='outlined' disabled={interactionDisabled}
            onClick={() => dispatch(api.endpoints.createMapInMap.initiate(getMapCreationProps()))}>
            {'OK'}
          </Button>
          <Button
            color="primary" variant='outlined' disabled={interactionDisabled}
            onClick={_=>dispatch(actions.setPageState(PageState.WS))}>
            {'CANCEL'}
          </Button>
        </div>
      </div>}
    </Modal>
  )
}
