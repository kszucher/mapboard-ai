import {useSelector, useDispatch} from "react-redux"
import { Button, ButtonGroup, Typography } from '@mui/material'
import { colorList, getColors } from '../core/Colors'
import { setClear } from '../core/Utils'
import { MAP_RIGHTS } from '../core/EditorFlow'

export function Formatter () {
    const LINE_WIDTH_TYPES = ['w1', 'w2', 'w3']
    const LINE_TYPE_TYPES = ['bezier', 'edge']
    const BORDER_WIDTH_TYPES = ['w1', 'w2', 'w3']
    const FONT_SIZE_TYPES = ['h1', 'h2', 'h3', 'h4', 't']

    const {UNAUTHORIZED, VIEW} = MAP_RIGHTS

    const colorMode = useSelector(state => state.colorMode)
    const mapRight = useSelector(state => state.mapRight)
    const formatMode = useSelector(state => state.formatMode)
    const lineColor = useSelector(state => state.node.lineColor)
    const borderColor = useSelector(state => state.node.borderColor)
    const fillColor = useSelector(state => state.node.fillColor)
    const textColor = useSelector(state => state.node.textColor)
    const lineWidth = {[1]: 'w1', [2]: 'w2', [3]: 'w3'}[useSelector(state => state.node.lineWidth)]
    const lineType = {['b']: 'bezier', ['e']: 'edge'}[useSelector(state => state.node.lineType)]
    const borderWidth = {[1]: 'w1', [2]: 'w2', [3]: 'w3'}[useSelector(state => state.node.borderWidth)]
    const textFontSize = {[36]: 'h1', [24]: 'h2', [18]: 'h3', [16]: 'h4', [14]: 't'}[useSelector(state => state.node.textFontSize)]

    const { PAGE_BACKGROUND, MAP_BACKGROUND } = getColors(colorMode)
    const disabled = [UNAUTHORIZED, VIEW].includes(mapRight)

    const dispatch = useDispatch()
    const closePalette = _ => dispatch({type: 'CLOSE_PALETTE'})
    const setNodeParam = (nodeParamObj) => dispatch({type: 'SET_NODE_PARAMS', payload: nodeParamObj })
    const setLineWidth = value => setNodeParam({lineWidth: {['w1']: 1, ['w2']: 2, ['w3']: 3}[value]})
    const setLineType = value => setNodeParam({lineType: {['bezier']: 'b', ['edge']: 'e'}[value]})
    const setBorderWidth = value => setNodeParam({borderWidth: {['w1']: 1, ['w2']: 2, ['w3']: 3}[value]})
    const setTextFontSize = value => setNodeParam({textFontSize: {['h1']: 36, ['h2']: 24, ['h3']: 18, ['h4']: 16, ['t']: 14}[value]})
    const resetLine = _ => setNodeParam(setClear(['lineType', 'lineWidth', 'lineColor']))
    const resetBorder = _ => setNodeParam(setClear(['borderWidth', 'borderColor']))
    const resetFill = _ => setNodeParam(setClear(['fillColor']))
    const resetText = _ => setNodeParam(setClear(['textColor', 'textFontSize']))

    const o = 32
    const r = 12
    const width = o * colorList[0].length
    const height = o * colorList.length

    return (
        <div style={{
            position: 'fixed',
            top: 48*2,
            right: 40+2*12+32,
            width: width + 2*12,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 16,
            background: MAP_BACKGROUND,
            border: `1px solid ${PAGE_BACKGROUND}`,
            flexWrap: 'wrap',
            gap: 12,
            paddingTop: 12,
            paddingBottom: 12
        }}>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <Typography variant="h6">
                    {formatMode.toUpperCase()}
                </Typography>
            </div>
            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center' }}>
                <Button
                    color="primary"
                    variant='outlined'
                    onClick={{ line: resetLine, text: resetText, fill: resetFill, border: resetBorder }[formatMode]}>
                    {'RESET'}
                </Button>
            </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <div style={{ width, height }}>
                    <svg viewBox={`0 0 ${width} ${height}`}>
                        {colorList.map((iEl, i) => (iEl.map((jEl, j) => (
                            <circle
                                cx={o/2 + j*o}
                                cy={o/2 + i*o}
                                r={r}
                                key={'key' + i*10 + j}
                                fill={jEl}
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
                {formatMode === 'line' && <ButtonGroup disabled={disabled} variant="text" color="primary">
                    {LINE_WIDTH_TYPES.map((name, index) =>
                        <Button
                            style={{ backgroundColor: lineWidth === LINE_WIDTH_TYPES[index] ? '#eeeaf2' : '' }}
                            onClick={_=>setLineWidth(LINE_WIDTH_TYPES[index])}
                            key={index}
                        >
                            {name}
                        </Button>
                    )}
                </ButtonGroup>}
                {formatMode === 'line' && <ButtonGroup disabled={disabled} variant="text" color="primary">
                    {LINE_TYPE_TYPES.map((name, index) =>
                        <Button
                            style={{ backgroundColor: lineType === LINE_TYPE_TYPES[index] ? '#eeeaf2' : '' }}
                            onClick={_=>setLineType(LINE_TYPE_TYPES[index])}
                            key={index}
                        >
                            {name}
                        </Button>
                    )}
                </ButtonGroup>}
                {formatMode === 'border' && <ButtonGroup disabled={disabled} variant="text" color="primary">
                    {BORDER_WIDTH_TYPES.map((name, index) =>
                        <Button
                            style={{ backgroundColor: borderWidth === BORDER_WIDTH_TYPES[index] ? '#eeeaf2' : '' }}
                            onClick={_=>setBorderWidth(BORDER_WIDTH_TYPES[index])}
                            key={index}
                        >
                            {name}
                        </Button>
                    )}
                </ButtonGroup>}
                {formatMode === 'text' && <ButtonGroup disabled={disabled} variant="text" color="primary">
                    {FONT_SIZE_TYPES.map((name, index) =>
                        <Button
                            style={{ backgroundColor: textFontSize === FONT_SIZE_TYPES[index] ? '#eeeaf2' : '' }}
                            onClick={_=>setTextFontSize(FONT_SIZE_TYPES[index])}
                            key={index}
                        >
                            {name}
                        </Button>
                    )}
                </ButtonGroup>}
            </div>
            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center' }}>
                <Button
                    color="primary"
                    variant='outlined'
                    onClick={closePalette}>
                    {'CLOSE'}
                </Button>
            </div>
        </div>
    )
}
