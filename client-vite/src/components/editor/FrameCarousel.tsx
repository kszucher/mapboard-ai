import {FC} from "react"
import {useDispatch} from 'react-redux'
import {nodeApi, useOpenWorkspaceQuery} from "../../apis/NodeApi"
import { Button, MobileStepper } from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import {AppDispatch} from "../../reducers/EditorReducer"
import {defaultUseOpenWorkspaceQueryState, getMapId} from "../../state/NodeApiState"

export const FrameCarousel: FC = () => {
  const { data, isFetching } = useOpenWorkspaceQuery()
  const { frameIdList, frameId } = data || defaultUseOpenWorkspaceQueryState
  const frameIdPosition = frameIdList.indexOf(frameId)
  const prevFrameIdPosition = frameIdPosition > 0 ? frameIdPosition - 1 : 0
  const nextFrameIdPosition = frameIdPosition < frameIdList.length - 1 ? frameIdPosition + 1 : frameIdList.length - 1
  const prevFrameId = frameIdList[prevFrameIdPosition]
  const nextFrameId = frameIdList[nextFrameIdPosition]
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div className="dark:bg-zinc-800 bg-zinc-50 border-2 border-b-0 border-purple-700 fixed left-1/2 -translate-x-1/2 bottom-0 rounded-t-lg ">
      {
        frameIdList.length > 0 && frameId !=='' &&
        <MobileStepper
          className="gap-3 rounded-t-lg bg-purple-700"
          sx={{background: '#000000'}}
          variant="dots"
          steps={frameIdList.length}
          position="static"
          activeStep={frameIdPosition}
          backButton={
            <Button
              style={{paddingLeft:12}}
              size="large"
              disabled={frameIdPosition === 0 || isFetching}
              onClick={() => dispatch(nodeApi.endpoints.selectMap.initiate({ mapId: getMapId(), frameId: prevFrameId}))}
            >
              <KeyboardArrowLeftIcon />
            </Button>
          }
          nextButton={
            <Button
              style={{paddingRight:12}}
              size="large"
              disabled={frameIdPosition === frameIdList.length - 1 || isFetching}
              onClick={() => dispatch(nodeApi.endpoints.selectMap.initiate({ mapId: getMapId(), frameId: nextFrameId}))}
            >
              <KeyboardArrowRightIcon />
            </Button>
          }
        />
      }
    </div>
  )
}
