import {FC} from "react";
import {useDispatch} from 'react-redux'
import {api, useOpenMapQuery} from "../core/Api";
import { Button, MobileStepper } from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import {defaultUseOpenMapQueryState} from "../core/EditorFlow";

export const FrameCarousel: FC = () => {
  const { data, isFetching } = useOpenMapQuery()
  const { frameLen, frameSelected } = data?.resp?.data || defaultUseOpenMapQueryState
  const dispatch = useDispatch()
  return (
    <div className="_bg fixed left-1/2 -translate-x-1/2 bottom-0 rounded-t-2xl border-2 border-mb-pink border-b-0">
      {
        frameLen > 0 &&
        <MobileStepper
          className="gap-3 rounded-t-2xl bg-mb-pink"
          sx={{background: 'var(--map-background-color)'}}
          variant="dots"
          steps={frameLen}
          position="static"
          activeStep={frameSelected}
          backButton={
            <Button
              style={{paddingLeft:12}}
              size="large"
              disabled={frameSelected === 0 || isFetching}
              onClick={() => dispatch(api.endpoints.selectPrevMapFrame.initiate())}
            >
              <KeyboardArrowLeftIcon />
            </Button>
          }
          nextButton={
            <Button
              style={{paddingRight:12}}
              size="large"
              disabled={frameSelected === frameLen - 1 || isFetching}
              onClick={() => dispatch(api.endpoints.selectNextMapFrame.initiate())}
            >
              <KeyboardArrowRightIcon />
            </Button>
          }
        />
      }
    </div>
  )
}
