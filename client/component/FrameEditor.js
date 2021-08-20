import React, {useContext} from 'react';
import {Context} from "../core/Store";
import {MobileStepper} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";

export function FrameEditor () {
    const [state, dispatch] = useContext(Context)
    const {frameLen, frameSelection} = state;
    return (
        <div style={{position: 'fixed', left: '50%', transform: 'translate(-50%)', bottom: 0, display: 'flex', alignItems: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                {frameLen > 0 &&
                <MobileStepper
                    style={{
                        backgroundColor: '#fbfafc',
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
                    activeStep={frameSelection[0]}
                    backButton={
                        <Button style={{paddingRight:20}}
                                size="large"
                                onClick={_=>dispatch({type: 'PREV_FRAME'})}
                                disabled={frameSelection[0] === 0}>
                            <KeyboardArrowLeft />
                        </Button>
                    }
                    nextButton={
                        <Button style={{paddingLeft:20}}
                                size="large"
                                onClick={_=>dispatch({type: 'NEXT_FRAME'})}
                                disabled={frameSelection[0] === frameLen - 1}>
                            <KeyboardArrowRight />
                        </Button>
                    }
                />}
            </div>
        </div>
    );
}
