import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import {COLORS} from "../core/Utils";
import { Button, MobileStepper } from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

export function FramesBottom () {
    const frameLen = useSelector(state => state.frameLen)
    const frameSelected = useSelector(state => state.frameSelected)
    const breadcrumbMapNameList = useSelector(state => state.breadcrumbMapNameList)
    const dispatch = useDispatch()

    const openPrevFrame = _=> dispatch({type: 'OPEN_PREV_FRAME'})
    const openNextFrame = _ => dispatch({type: 'OPEN_NEXT_FRAME'})

    useEffect(() => {
        dispatch({type: 'OPEN_FRAME'});
        return () => {
            dispatch({type: 'OPEN_MAP_FROM_BREADCRUMBS', payload: {breadcrumbMapSelected: breadcrumbMapNameList.length - 1}})
        }
    }, []);

    return (
        <div style={{
            position: 'fixed',
            left: '50%',
            transform: 'translate(-50%)',
            bottom: 0,
            display: 'flex',
            alignItems: 'center'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                {frameLen > 0 &&
                <MobileStepper
                    style={{
                        backgroundColor: COLORS.MAP_BACKGROUND,
                        borderTopLeftRadius: '16px',
                        borderTopRightRadius: '16px',
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderColor: '#9040b8',
                        borderBottom: 0
                    }}
                    variant="dots"
                    steps={frameLen}
                    position="static"
                    activeStep={frameSelected}
                    backButton={
                        <Button style={{paddingRight:20}}
                                size="large"
                                onClick={openPrevFrame}
                                disabled={frameSelected === 0}>
                            <KeyboardArrowLeftIcon />
                        </Button>
                    }
                    nextButton={
                        <Button style={{paddingLeft:20}}
                                size="large"
                                onClick={openNextFrame}
                                disabled={frameSelected === frameLen - 1}>
                            <KeyboardArrowRightIcon />
                        </Button>
                    }
                />}
            </div>
        </div>
    )
}
