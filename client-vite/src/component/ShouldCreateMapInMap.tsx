import {FC} from "react";
import {useDispatch} from "react-redux";
import { Button, Modal, Typography } from '@mui/material'
import {actions, AppDispatch} from "../editor/EditorReducer";
import {PageState} from "../core/Enums";
import {api, useOpenWorkspaceQuery} from "../core/Api";
import {getMapId} from "../state/ApiState";
import {getMap} from "../state/EditorState";

export const ShouldCreateMapInMap: FC = () => {
  const { isFetching } = useOpenWorkspaceQuery()
  const dispatch = useDispatch<AppDispatch>()
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
            color="primary" variant='outlined' disabled={isFetching}
            onClick={() =>
              window.alert('TODO: figure out nodeId and content in the new LINEAR system')
              // dispatch(api.endpoints.createMapInMap.initiate({
              //   mapId: getMapId(),
              //   nodeId: getMapData(getMap(), getMap().g.sc.lastPath).nodeId,
              //   content: getMapData(getMap(), getMap().g.sc.lastPath).content
              // }))
            }
          >
            {'OK'}
          </Button>
          <Button
            color="primary" variant='outlined' disabled={isFetching}
            onClick={_=>dispatch(actions.setPageState(PageState.WS))}>
            {'CANCEL'}
          </Button>
        </div>
      </div>}
    </Modal>
  )
}
