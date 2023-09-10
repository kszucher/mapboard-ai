import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import { Button, Modal, Typography } from '@mui/material'
import {actions, AppDispatch, RootState} from "../reducers/EditorReducer"
import {PageState} from "../state/Enums"
import {nodeApi, useOpenWorkspaceQuery} from "../apis/NodeApi"
import {getX} from "../selectors/MapUtils"
import {getMapId} from "../state/NodeApiState"
import {mSelector} from "../state/EditorState"

export const ModalCreateMapInMap: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const { isFetching } = useOpenWorkspaceQuery()
  const dispatch = useDispatch<AppDispatch>()
  return(
    <Modal open={true} onClose={_=>{}} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
      {<div className="_bg fixed top-[80px] right-[64px] w-[192px] flex flex-col gap-4 p-4 rounded-lg">
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
          <Typography variant="subtitle2" color='primary'>
            {'CREATE SUBMAP?'}
          </Typography>
        </div>
        <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
          <Button
            color="primary"
            variant='outlined'
            disabled={isFetching}
            onClick={() => {dispatch(nodeApi.endpoints.createMapInMap.initiate({mapId: getMapId(), nodeId: getX(m).nodeId, content: getX(m).content}))}}
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
