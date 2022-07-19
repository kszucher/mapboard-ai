import {useSelector, useDispatch} from 'react-redux'
import { Button, IconButton, MobileStepper } from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { getColors } from '../core/Colors'
import '../css/Component-Side.css'

export function FrameCarousel () {
    const colorMode = useSelector(state => state.colorMode)
    const frameLen = useSelector(state => state.frameLen)
    const frameSelected = useSelector(state => state.frameSelected)
    const interactionDisabled = useSelector(state => state.interactionDisabled)
    const { PAGE_BACKGROUND, MAP_BACKGROUND } = getColors(colorMode)
    const dispatch = useDispatch()
    const openPrevFrame = _=> dispatch({type: 'OPEN_PREV_FRAME'})
    const openNextFrame = _ => dispatch({type: 'OPEN_NEXT_FRAME'})

    return (
        <div id="frame-carousel" >
            {frameLen > 0 &&
            <MobileStepper
                style={{
                    flexWrap: 'wrap',
                    gap: 12,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    background: MAP_BACKGROUND
                }}
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
