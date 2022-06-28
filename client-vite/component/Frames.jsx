import {useSelector, useDispatch} from 'react-redux'
import { Button, IconButton, MobileStepper } from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { getColors } from '../core/Colors'
import InputIcon from '@mui/icons-material/Input'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'

export function Frames () {
    const colorMode = useSelector(state => state.colorMode)
    const frameLen = useSelector(state => state.frameLen)
    const frameSelected = useSelector(state => state.frameSelected)
    const interactionDisabled = useSelector(state => state.interactionDisabled)
    const { PAGE_BACKGROUND, MAP_BACKGROUND } = getColors(colorMode)
    const dispatch = useDispatch()
    const openPrevFrame = _=> dispatch({type: 'OPEN_PREV_FRAME'})
    const openNextFrame = _ => dispatch({type: 'OPEN_NEXT_FRAME'})
    const importFrame = _ => dispatch({type: 'IMPORT_FRAME'})
    const duplicateFrame = _ => dispatch({type: 'DUPLICATE_FRAME'})
    const deleteFrame = _ => dispatch({type: 'DELETE_FRAME'})
    const closeFrameEditor = _ => dispatch({type: 'CLOSE_FRAME_EDITOR'})
    return (
        <div style={{
            position: 'fixed',
            left: '50%',
            transform: 'translate(-50%)',
            bottom: 0,
            borderTop: 0,
            borderLeft: `1px solid ${PAGE_BACKGROUND}`,
            borderRight: `1px solid ${PAGE_BACKGROUND}`,
            borderRadius: '16px 16px 0 0',
            border: `2px solid ${'#9040b8'}`,
            borderBottom: 0,
            backgroundColor: MAP_BACKGROUND,
        }}>
            {frameLen > 0 && <MobileStepper
                style={{ flexWrap: 'wrap', gap: 12, borderTopLeftRadius: 16, borderTopRightRadius: 16, background: MAP_BACKGROUND }}
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
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                height: 40,
                padding: '4px 12px 4px 12px',
            }}>
                <IconButton color='secondary' onClick={importFrame}>
                    <InputIcon/>
                </IconButton>
                <IconButton color='secondary' onClick={duplicateFrame} disabled={frameLen === 0}>
                    <ContentCopyIcon/>
                </IconButton>
                <IconButton color='secondary' onClick={deleteFrame} disabled={frameLen === 0}>
                    <DeleteIcon/>
                </IconButton>
                <IconButton color='secondary' onClick={closeFrameEditor}>
                    <CloseIcon/>
                </IconButton>
            </div>
        </div>
    )
}
