import {useSelector, useDispatch, RootStateOrAny} from 'react-redux'
import { Button, MobileStepper } from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

export function FrameCarousel () {
    const frameLen = useSelector((state: RootStateOrAny) => state.frameLen)
    const frameSelected = useSelector((state: RootStateOrAny) => state.frameSelected)
    const interactionDisabled = useSelector((state: RootStateOrAny) => state.interactionDisabled)
    const dispatch = useDispatch()
    const openPrevFrame = () => dispatch({type: 'OPEN_PREV_FRAME'})
    const openNextFrame = () => dispatch({type: 'OPEN_NEXT_FRAME'})

    return (
        <div className="_bg fixed left-1/2 -translate-x-1/2 bottom-0 rounded-t-2xl border-2 border-mb-pink border-b-0">
            {frameLen > 0 &&
            <MobileStepper
                className="gap-3 rounded-t-2xl bg-mb-pink"
                sx={{background: 'var(--map-background-color)'}}
                variant="dots"
                steps={frameLen}
                position="static"
                activeStep={frameSelected}
                backButton={
                    <Button style={{paddingLeft:12}} size="large" onClick={openPrevFrame}
                            disabled={frameSelected === 0 || interactionDisabled}>
                        <KeyboardArrowLeftIcon />
                    </Button>
                }
                nextButton={
                    <Button style={{paddingRight:12}} size="large" onClick={openNextFrame}
                            disabled={frameSelected === frameLen - 1 || interactionDisabled}>
                        <KeyboardArrowRightIcon />
                    </Button>
                }
            />}
        </div>
    )
}
