import {useSelector, useDispatch} from 'react-redux'
import { Button, MobileStepper } from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { getColors } from '../core/Colors'

export function FramesBottom () {
    const colorMode = useSelector(state => state.colorMode)
    const frameLen = useSelector(state => state.frameLen)
    const frameSelected = useSelector(state => state.frameSelected)
    const framaNavigationVisible = useSelector(state => state.framaNavigationVisible)
    const {MAP_BACKGROUND} = getColors(colorMode)
    const dispatch = useDispatch()
    const openPrevFrame = _=> dispatch({type: 'OPEN_PREV_FRAME'})
    const openNextFrame = _ => dispatch({type: 'OPEN_NEXT_FRAME'})
    return (
        <div style={{ position: 'fixed', left: '50%', transform: 'translate(-50%)', bottom: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {frameLen > 0 &&
                <MobileStepper
                    style={{
                        flexWrap: 'wrap', gap: 12, background: MAP_BACKGROUND,
                        borderRadius: '16px 16px 0 0', border: `2px solid ${'#9040b8'}`, borderBottom: 0,
                    }}
                    variant="dots"
                    steps={frameLen}
                    position="static"
                    activeStep={frameSelected}
                    backButton={
                        <Button style={{paddingLeft:12}} size="large" onClick={openPrevFrame}
                                disabled={frameSelected === 0 || !framaNavigationVisible}>
                            <KeyboardArrowLeftIcon />
                        </Button>
                    }
                    nextButton={
                        <Button style={{paddingRight:12}} size="large" onClick={openNextFrame}
                                disabled={frameSelected === frameLen - 1 || !framaNavigationVisible}>
                            <KeyboardArrowRightIcon />
                        </Button>
                    }
                />}
            </div>
        </div>
    )
}
