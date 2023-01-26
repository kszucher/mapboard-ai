import {FC} from "react";
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux'
import {api, useOpenWorkspaceQuery} from "../core/Api";
import { Button, MobileStepper } from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import {defaultUseOpenWorkspaceQueryState} from "../core/EditorFlow";
import {PageState} from "../core/Types";

export const FrameCarousel: FC = () => {
  const pageState = useSelector((state: RootStateOrAny) => state.editor.pageState)
  const { data, isFetching } = useOpenWorkspaceQuery(undefined, { skip:  pageState === PageState.AUTH  })
  const { dataFramesLen, dataFrameSelected } = data?.data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch()
  return (
    <div className="_bg fixed left-1/2 -translate-x-1/2 bottom-0 rounded-t-2xl border-2 border-mb-pink border-b-0">
      {
        dataFramesLen > 0 &&
        <MobileStepper
          className="gap-3 rounded-t-2xl bg-mb-pink"
          sx={{background: 'var(--map-background-color)'}}
          variant="dots"
          steps={dataFramesLen}
          position="static"
          activeStep={dataFrameSelected}
          backButton={
            <Button
              style={{paddingLeft:12}}
              size="large"
              disabled={dataFrameSelected === 0 || isFetching}
              onClick={() => dispatch(api.endpoints.selectPrevMapFrame.initiate())}
            >
              <KeyboardArrowLeftIcon />
            </Button>
          }
          nextButton={
            <Button
              style={{paddingRight:12}}
              size="large"
              disabled={dataFrameSelected === dataFramesLen - 1 || isFetching}
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
