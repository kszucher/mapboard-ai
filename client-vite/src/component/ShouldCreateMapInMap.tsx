import {FC} from "react";
import {useSelector, useDispatch, RootStateOrAny} from "react-redux";
import { Button, Modal, Typography } from '@mui/material'
import {actions, getMap, getMapId} from "../core/EditorFlow";
import {PageState} from "../core/Types";
import {api, useOpenWorkspaceQuery} from "../core/Api";
import {getMapData} from "../core/MapFlow";

export const ShouldCreateMapInMap: FC = () => {
  const pageState = useSelector((state: RootStateOrAny) => state.editor.pageState)
  const { isFetching, isSuccess } = useOpenWorkspaceQuery(undefined, { skip:  pageState === PageState.AUTH  })
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
            color="primary" variant='outlined' disabled={isFetching}
            onClick={() => dispatch(api.endpoints.createMapInMap.initiate({
              mapId: getMapId(),
              nodeId: getMapData(getMap(), getMap().g.sc.lastPath).nodeId,
              content: getMapData(getMap(), getMap().g.sc.lastPath).content
            }))}>
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
