import {FC} from "react";
import {useDispatch} from 'react-redux'
import {api, useOpenWorkspaceQuery} from "../core/Api";
import { Button, MobileStepper } from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import {AppDispatch} from "../editor/EditorReducer";
import {defaultUseOpenWorkspaceQueryState, getMapId} from "../state/ApiState";

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
    <div className="_bg fixed left-1/2 -translate-x-1/2 bottom-0 rounded-t-md border-2 border-mb-pink border-b-0">
      {
        frameIdList.length > 0 && frameId !=='' &&
        <MobileStepper
          className="gap-3 rounded-t-md bg-mb-pink"
          sx={{background: 'var(--map-background-color)'}}
          variant="dots"
          steps={frameIdList.length}
          position="static"
          activeStep={frameIdPosition}
          backButton={
            <Button
              style={{paddingLeft:12}}
              size="large"
              disabled={frameIdPosition === 0 || isFetching}
              onClick={() => dispatch(api.endpoints.selectMap.initiate({ mapId: getMapId(), frameId: prevFrameId}))}
            >
              <KeyboardArrowLeftIcon />
            </Button>
          }
          nextButton={
            <Button
              style={{paddingRight:12}}
              size="large"
              disabled={frameIdPosition === frameIdList.length - 1 || isFetching}
              onClick={() => dispatch(api.endpoints.selectMap.initiate({ mapId: getMapId(), frameId: nextFrameId}))}
            >
              <KeyboardArrowRightIcon />
            </Button>
          }
        />
      }
    </div>
  )
}
