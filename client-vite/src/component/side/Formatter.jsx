import {useSelector, useDispatch} from "react-redux"
import { Button, ButtonGroup, IconButton, Typography } from '@mui/material'
import { colorList, getColors } from '../../core/Colors'
import { setClear } from '../../core/Utils'
import { MAP_RIGHTS } from '../../core/EditorFlow'
import { BorderIcon, FillIcon, LineIcon, TextIcon } from '../unsorted/Icons'

const SpanHighlight = ({MAIN_COLOR, formatMode}) => (
    <>
        {formatMode !== '' && <span
            style={{
                position: 'fixed',
                right: 225 - 40* ({ text: 0, border: 1, fill: 2, line: 3 }[formatMode]),
                // right: 10,
                top: 48*2+2,
                width: 40,
                height: 2,
                backgroundColor: MAIN_COLOR,
                // borderRadius: 8,
            }}/>
        }
    </>
)

const TargetedButtonGroup = ({KEYS, value, setValue, BUTTON_COLOR}) => {
    const {UNAUTHORIZED, VIEW} = MAP_RIGHTS
    const mapRight = useSelector(state => state.mapRight)
    const disabled = [UNAUTHORIZED, VIEW].includes(mapRight)
    return (
        <ButtonGroup className="targeted-button-group" disabled={disabled} variant="text" color="primary">
            {KEYS.map((name, idx) =>
                <Button
                    style={{ backgroundColor: value === KEYS[idx] ? BUTTON_COLOR : '' }}
                    onClick={ _ => setValue(KEYS[idx]) }
                    key={idx}>
                    {name}
                </Button>
            )}
        </ButtonGroup>
    )
}

export function Formatter () {
    const o = 32
    const r = 12
    const width =  o * colorList[0].length
    const height = o * colorList.length

    const colorMode = useSelector(state => state.colorMode)
    const formatMode = useSelector(state => state.formatMode)
    const lineColor = useSelector(state => state.node.lineColor)
    const borderColor = useSelector(state => state.node.borderColor)
    const fillColor = useSelector(state => state.node.fillColor)
    const textColor = useSelector(state => state.node.textColor)
    const selection = useSelector(state => state.node.selection)
    const lineWidth = useSelector(state => state.node.lineWidth)
    const lineType = useSelector(state => state.node.lineType)
    const borderWidth = useSelector(state => state.node.borderWidth)
    const textFontSize = useSelector(state => state.node.textFontSize)

    const { BUTTON_COLOR, MAIN_COLOR } = getColors(colorMode)

    const dispatch = useDispatch()
    const setNodeParam = obj => dispatch({type: 'SET_NODE_PARAMS', payload: { node: obj, nodeTriggersMap: true } })
    const setFormatModeLine = _ => dispatch({type: 'SET_FORMAT_MODE', payload: 'line'})
    const setFormatModeBorder = _ => dispatch({type: 'SET_FORMAT_MODE', payload: 'border'})
    const setFormatModeFill = _ => dispatch({type: 'SET_FORMAT_MODE', payload: 'fill'})
    const setFormatModeText = _ => dispatch({type: 'SET_FORMAT_MODE', payload: 'text'})
    const closeFormatter = _ => dispatch({type: 'SET_FORMAT_MODE', payload: ''})

    return (
        <div id="formatter">
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <IconButton color='secondary' onClick={setFormatModeText}>
                    <TextIcon MAIN_COLOR={MAIN_COLOR}/>
                </IconButton>
                <IconButton color='secondary' onClick={setFormatModeBorder}>
                    <BorderIcon MAIN_COLOR={MAIN_COLOR} selection={selection}/>
                </IconButton>
                <IconButton color='secondary' onClick={setFormatModeFill}>
                    <FillIcon MAIN_COLOR={MAIN_COLOR} selection={selection}/>
                </IconButton>
                <IconButton color='secondary' onClick={setFormatModeLine}>
                    <LineIcon MAIN_COLOR={MAIN_COLOR}/>
                </IconButton>
                <SpanHighlight MAIN_COLOR={MAIN_COLOR} formatMode={formatMode}/>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div style={{ width, height }}>
                    <svg viewBox={`0 0 ${width} ${height}`}>{
                        colorList.map((iEl, i) => (
                                iEl.map((jEl, j) => (
                                        <circle
                                            cx={o/2 + j*o}
                                            cy={o/2 + i*o}
                                            r={r}
                                            key={'key' + i*10 + j}
                                            fill={jEl}
                                            stroke={
                                                colorList[i][j] === {
                                                    line: lineColor,
                                                    border: borderColor,
                                                    fill: fillColor,
                                                    text: textColor
                                                }[formatMode]
                                                    ? '#9040b8'
                                                    : 'none'
                                            }
                                            strokeWidth={"2%"}
                                            onClick={_ =>
                                                setNodeParam({
                                                    [formatMode + 'Color'] : colorList[i][j]
                                                })
                                            }
                                        />
                                    )
                                )
                            )
                        )
                    }
                    </svg>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column',  alignItems: 'center'}}>
                {
                    formatMode === 'line' &&
                    <>
                        <TargetedButtonGroup
                            KEYS={['w1', 'w2', 'w3']}
                            value={{[1]: 'w1', [2]: 'w2', [3]: 'w3'}[lineWidth]}
                            setValue={value => setNodeParam({lineWidth: {['w1']: 1, ['w2']: 2, ['w3']: 3}[value]})}
                            BUTTON_COLOR={BUTTON_COLOR}
                        />
                        <TargetedButtonGroup
                            KEYS={['bezier', 'edge']}
                            value={{['b']: 'bezier', ['e']: 'edge'}[lineType]}
                            setValue={value => setNodeParam({lineType: {['bezier']: 'b', ['edge']: 'e'}[value]})}
                            BUTTON_COLOR={BUTTON_COLOR}
                        />
                    </>
                }
                {
                    formatMode === 'border' &&
                    <TargetedButtonGroup
                        KEYS={['w1', 'w2', 'w3']}
                        value={{[1]: 'w1', [2]: 'w2', [3]: 'w3'}[borderWidth]}
                        setValue={value => setNodeParam({borderWidth: {['w1']: 1, ['w2']: 2, ['w3']: 3}[value]})}
                        BUTTON_COLOR={BUTTON_COLOR}
                    />
                }
                {
                    formatMode === 'text' &&
                    <>
                        <TargetedButtonGroup
                            KEYS={['h1', 'h2', 'h3', 'h4', 't']}
                            value={{[36]: 'h1', [24]: 'h2', [18]: 'h3', [16]: 'h4', [14]: 't'}[textFontSize]}
                            setValue={value => setNodeParam({textFontSize: {['h1']: 36, ['h2']: 24, ['h3']: 18, ['h4']: 16, ['t']: 14}[value]})}
                            BUTTON_COLOR={BUTTON_COLOR}
                        />
                    </>
                }
            </div>
            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center' }}>
                <Button color="primary" variant='outlined'
                        onClick={
                            {
                                line: setNodeParam(setClear(['lineType', 'lineWidth', 'lineColor'])),
                                text: setNodeParam(setClear(['textColor', 'textFontSize'])),
                                fill: setNodeParam(setClear(['fillColor'])),
                                border: setNodeParam(setClear(['borderWidth', 'borderColor']))
                            }[formatMode]
                        }>
                    {'RESET'}
                </Button>
            </div>
            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center' }}>
                <Button color="primary" variant='outlined' onClick={closeFormatter}>{'CLOSE'}</Button>
            </div>
        </div>
    )
}
