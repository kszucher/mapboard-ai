import {useSelector, useDispatch} from "react-redux"
import { Button, ButtonGroup, IconButton, Typography } from '@mui/material'
import { colorList, getColors } from '../core/Colors'
import { setClear } from '../core/Utils'
import { MAP_RIGHTS } from '../core/EditorFlow'
import { BorderIcon, FillIcon, LineIcon, TextIcon } from '../component/Icons'
import '../css/Component-Side.css'

const SpanHighlight = ({MAIN_COLOR, formatMode}) => (
    <>
        {formatMode !== '' && <span
            style={{
                position: 'fixed',
                right: 40 + 2*12 -(3*4) + 4*40 - 40* ({ text: 0, border: 1, fill: 2, line: 3 }[formatMode]),
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

export function Formatter () {
    const LINE_WIDTH_KEYS = ['w1', 'w2', 'w3']
    const LINE_TYPE_KEYS = ['bezier', 'edge']
    const BORDER_WIDTH_KEYS = ['w1', 'w2', 'w3']
    const FONT_SIZE_KEYS_1 = ['h1', 'h2', 'h3', 'h4']
    const FONT_SIZE_KEYS_2 = ['text']
    const {UNAUTHORIZED, VIEW} = MAP_RIGHTS
    const o = 32
    const r = 12
    const width = o * colorList[0].length
    const height = o * colorList.length

    const colorMode = useSelector(state => state.colorMode)
    const mapRight = useSelector(state => state.mapRight)
    const formatMode = useSelector(state => state.formatMode)
    const lineColor = useSelector(state => state.node.lineColor)
    const borderColor = useSelector(state => state.node.borderColor)
    const fillColor = useSelector(state => state.node.fillColor)
    const textColor = useSelector(state => state.node.textColor)
    const selection = useSelector(state => state.node.selection)

    const lineWidth = {[1]: 'w1', [2]: 'w2', [3]: 'w3'}[useSelector(state => state.node.lineWidth)]
    const lineType = {['b']: 'bezier', ['e']: 'edge'}[useSelector(state => state.node.lineType)]
    const borderWidth = {[1]: 'w1', [2]: 'w2', [3]: 'w3'}[useSelector(state => state.node.borderWidth)]
    const textFontSize = {[36]: 'h1', [24]: 'h2', [18]: 'h3', [16]: 'h4', [14]: 'text'}[useSelector(state => state.node.textFontSize)]
    const disabled = [UNAUTHORIZED, VIEW].includes(mapRight)
    const { BUTTON_COLOR, MAIN_COLOR } = getColors(colorMode)

    const dispatch = useDispatch()
    const setNodeParam = obj => dispatch({type: 'SET_NODE_PARAMS', payload: { node: obj, nodeTriggersMap: true } })
    const setLineWidth = value => setNodeParam({lineWidth: {['w1']: 1, ['w2']: 2, ['w3']: 3}[value]})
    const setLineType = value => setNodeParam({lineType: {['bezier']: 'b', ['edge']: 'e'}[value]})
    const setBorderWidth = value => setNodeParam({borderWidth: {['w1']: 1, ['w2']: 2, ['w3']: 3}[value]})
    const setTextFontSize = value => setNodeParam({textFontSize: {['h1']: 36, ['h2']: 24, ['h3']: 18, ['h4']: 16, ['text']: 14}[value]})
    const resetLine = _ => setNodeParam(setClear(['lineType', 'lineWidth', 'lineColor']))
    const resetBorder = _ => setNodeParam(setClear(['borderWidth', 'borderColor']))
    const resetFill = _ => setNodeParam(setClear(['fillColor']))
    const resetText = _ => setNodeParam(setClear(['textColor', 'textFontSize']))

    const setFormatModeLine = _ => dispatch({type: 'SET_FORMAT_MODE', payload: 'line'})
    const setFormatModeBorder = _ => dispatch({type: 'SET_FORMAT_MODE', payload: 'border'})
    const setFormatModeFill = _ => dispatch({type: 'SET_FORMAT_MODE', payload: 'fill'})
    const setFormatModeText = _ => dispatch({type: 'SET_FORMAT_MODE', payload: 'text'})
    const closeFormatter = _ => dispatch({type: 'SET_FORMAT_MODE', payload: ''})

    return (
        <div id="formatter">
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
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
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <div style={{ width, height }}>
                    <svg viewBox={`0 0 ${width} ${height}`}>{colorList.map((iEl, i) => (iEl.map((jEl, j) => (
                        <circle cx={o/2 + j*o} cy={o/2 + i*o} r={r} key={'key' + i*10 + j} fill={jEl}
                                stroke={
                                    colorList[i][j] ===
                                    {line: lineColor, border: borderColor, fill: fillColor, text: textColor}[formatMode]
                                        ? '#9040b8'
                                        : 'none'
                                }
                                strokeWidth={"2%"}
                                onClick={_ => setNodeParam({ [formatMode + 'Color'] : colorList[i][j] })}
                        />))))}
                    </svg>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column',  alignItems: 'center'}}>
                {formatMode === 'line' && <>
                    <ButtonGroup disabled={disabled} variant="text" color="primary">
                        {LINE_WIDTH_KEYS.map((name, idx) =>
                            <Button style={{ backgroundColor: lineWidth === LINE_WIDTH_KEYS[idx] ? BUTTON_COLOR : '' }}
                                    onClick={ _=>setLineWidth(LINE_WIDTH_KEYS[idx]) }
                                    key={idx}>
                                {name}
                            </Button>
                        )}
                    </ButtonGroup>
                    <ButtonGroup disabled={disabled} variant="text" color="primary">
                        {LINE_TYPE_KEYS.map((name, idx) =>
                            <Button style={{ backgroundColor: lineType === LINE_TYPE_KEYS[idx] ? BUTTON_COLOR : '' }}
                                    onClick={ _=>setLineType(LINE_TYPE_KEYS[idx]) }
                                    key={idx}>
                                {name}
                            </Button>
                        )}
                    </ButtonGroup>
                </>}
                {formatMode === 'border' &&
                <ButtonGroup disabled={disabled} variant="text" color="primary">
                    {BORDER_WIDTH_KEYS.map((name, idx) =>
                        <Button style={{ backgroundColor: borderWidth === BORDER_WIDTH_KEYS[idx] ? BUTTON_COLOR : '' }}
                                onClick={ _=>setBorderWidth(BORDER_WIDTH_KEYS[idx]) }
                                key={idx}>{name}
                        </Button>
                    )}
                </ButtonGroup>}
                {formatMode === 'text' && <>
                    <ButtonGroup disabled={disabled} variant="text" color="primary">
                        {FONT_SIZE_KEYS_1.map((name, idx) =>
                            <Button style={{ backgroundColor: textFontSize === FONT_SIZE_KEYS_1[idx] ? BUTTON_COLOR : '' }}
                                    onClick={ _=>setTextFontSize(FONT_SIZE_KEYS_1[idx]) }
                                    key={idx}>{name}
                            </Button>
                        )}
                    </ButtonGroup>
                    <ButtonGroup disabled={disabled} variant="text" color="primary">
                        {FONT_SIZE_KEYS_2.map((name, idx) =>
                            <Button style={{ backgroundColor: textFontSize === FONT_SIZE_KEYS_2[idx] ? BUTTON_COLOR : '' }}
                                    onClick={ _=>setTextFontSize(FONT_SIZE_KEYS_2[idx]) }
                                    key={idx}>{name}
                            </Button>
                        )}
                    </ButtonGroup>
                </>}
            </div>
            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center' }}>
                <Button color="primary" variant='outlined'
                        onClick={{ line: resetLine, text: resetText, fill: resetFill, border: resetBorder }[formatMode]}>
                    {'RESET'}
                </Button>
            </div>
            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center' }}>
                <Button color="primary" variant='outlined' onClick={closeFormatter}>{'CLOSE'}</Button>
            </div>
        </div>
    )
}
