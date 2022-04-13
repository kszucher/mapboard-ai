import {useSelector, useDispatch} from "react-redux"
import { Button, IconButton } from '@mui/material'
import { getColors } from '../core/Colors'
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import CloseIcon from '@mui/icons-material/Close';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { setClear } from '../core/Utils'
import { MAP_RIGHTS } from '../core/EditorFlow'
import StyledButtonGroup from '../component-styled/StyledButtonGroup'

const colorList = [
    ['#D3EBCE', '#ECFDDF', '#FDFFEB', '#FFECD6', '#FED3D0', '#FED3D0'],
    ['#EFEFEF', '#DEDEE8', '#F3F0E0', '#E4EADE', '#DCE5E6', '#DCE5E6'],
    ['#9086A6', '#E0C1D2', '#EFF0ED', '#9DD4C9', '#75A3BA', '#75A3BA'],
    ['#A0D7D9', '#FBE7A3', '#F4CBA1', '#F8FDDF', '#AE99BF', '#AE99BF'],
    ['#1C5D6C', '#70A18F', '#B7CFAE', '#EDDDCF', '#B25C6D', '#B25C6D'],
    ['#B2CFC9', '#95BABD', '#9292B0', '#F6A7A7', '#FFD6C9', '#FFD6C9'],
    ['#04A4B5', '#30BFBF', '#56D3CB', '#EEEE99', '#EBD295', '#fafafa'],
    ['#285588', '#E36273', '#FCC40F', '#ECE7C7', '#A8875E', '#347ab7'],
    ['#605E85', '#6CCC86', '#F7D36F', '#FD7780', '#994D80', '#aa0011'],
    ['#B4C2D6', '#BFE3DA', '#F5FCDC', '#FEFFF7', '#C0DDBE', '#f2dede'],
    ['#FFD6DE', '#E8CEE3', '#C7BAE1', '#BBD3EC', '#ECE4C5', '#82c5e2'],
    ['#391F19', '#B68E63', '#F2DFA9', '#E58119', '#746839', '#09415A'],
]

export function Formatter () {
    const colorMode = useSelector(state => state.colorMode)
    const { PAGE_BACKGROUND, MAP_BACKGROUND } = getColors(colorMode)
    const formatMode = useSelector(state => state.formatMode)
    const lineColor = useSelector(state => state.node.lineColor)
    const borderColor = useSelector(state => state.node.borderColor)
    const fillColor = useSelector(state => state.node.fillColor)
    const textColor = useSelector(state => state.node.textColor)
    const dispatch = useDispatch()
    const setNodeParam = (nodeParamObj) => dispatch({type: 'SET_NODE_PARAMS', payload: nodeParamObj })

    const closePalette = _ => dispatch({type: 'CLOSE_PALETTE'})


    const resetLine = _ => setNodeParam(setClear(['lineType', 'lineWidth', 'lineColor']))
    const resetBorder = _ => setNodeParam(setClear(['borderWidth', 'borderColor']))
    const resetFill = _ => setNodeParam(setClear(['fillColor']))
    const resetText = _ => setNodeParam(setClear(['textColor', 'textFontSize']))





    const {UNAUTHORIZED, VIEW} = MAP_RIGHTS
    const LINE_WIDTH_TYPES = ['w1', 'w2', 'w3']
    const LINE_TYPE_TYPES = ['bezier', 'edge']
    const BORDER_WIDTH_TYPES = ['w1', 'w2', 'w3']
    const FONT_SIZE_TYPES = ['h1', 'h2', 'h3', 'h4', 't']


    const mapRight = useSelector(state => state.mapRight)
    const disabled = [UNAUTHORIZED, VIEW].includes(mapRight)
    const lineWidth = {[1]: 'w1', [2]: 'w2', [3]: 'w3'}[useSelector(state => state.node.lineWidth)]
    const lineType = {['b']: 'bezier', ['e']: 'edge'}[useSelector(state => state.node.lineType)]
    const borderWidth = {[1]: 'w1', [2]: 'w2', [3]: 'w3'}[useSelector(state => state.node.borderWidth)]
    const textFontSize = {[36]: 'h1', [24]: 'h2', [18]: 'h3', [16]: 'h4', [14]: 't'}[useSelector(state => state.node.textFontSize)]
    const taskStatus = useSelector(state => state.node.taskStatus)

    const setLineWidth = value => setNodeParam({lineWidth: {['w1']: 1, ['w2']: 2, ['w3']: 3}[value]})
    const setLineType = value => setNodeParam({lineType: {['bezier']: 'b', ['edge']: 'e'}[value]})
    const setBorderWidth = value => setNodeParam({borderWidth: {['w1']: 1, ['w2']: 2, ['w3']: 3}[value]})
    const setTextFontSize = value => setNodeParam({textFontSize: {['h1']: 36, ['h2']: 24, ['h3']: 18, ['h4']: 16, ['t']: 14}[value]})
    const toggleTask = _ => setNodeParam({taskStatus: taskStatus === -1 ? 'setTask' : 'clearTask'})
    const resetFormat = _ => setNodeParam(setClear(['lineType', 'lineWidth', 'lineColor', 'borderWidth', 'borderColor', 'fillColor', 'textColor', 'textFontSize']))

    const createMapInMap = _ => dispatch({type: 'CREATE_MAP_IN_MAP'})

















    const resolveColor = (formatMode) => {
        switch (formatMode) {
            case 'line':    return lineColor
            case 'border':  return borderColor
            case 'fill':    return fillColor
            case 'text':    return textColor
        }
    }

    const resolveColorName = (formatMode) => {
        return {
            line: 'lineColor',
            text: 'textColor',
            fill: 'fillColor',
            border: 'borderColor'
        }[formatMode]
    }

    const resolveReset = (formatMode) => {
        return {
            line: resetLine,
            text: resetText,
            fill: resetFill,
            border: resetBorder
        }[formatMode]
    }

    const o = 32
    const r = 12
    const width = o * colorList[0].length
    const height = o * colorList.length
    const offset = {
        line: 4,
        border: 5,
        fill: 6,
        text: 7
    }[formatMode]

    return (
        <div
            style={{
                position: 'fixed',
                // top: 12 + 40*offset,
                top: 12,
                right: 40 + 4*12,
                width: width + 40*2 + 12,
                display: 'flex',
                flexDirection: 'row',
                borderRadius: 16,
                backgroundColor: MAP_BACKGROUND,
                border: `1px solid ${PAGE_BACKGROUND}`,
            }}>

            <div>
                <IconButton disableRipple={true} color='secondary' onClick={closePalette}>
                    <ArrowRightIcon/>
                </IconButton>
            </div>
            <div
                style={{
                    top: 12 + 40*offset,
                    width,
                    height,
                    padding: 4,
                }}>
                <svg viewBox={`0 0 ${width} ${height}`}>
                    {colorList.map((iEl, i) =>
                        (iEl.map((jEl, j) => (
                            <circle
                                cx={o/2 + j*o}
                                cy={o/2 + i*o}
                                r={r}
                                key={'key' + i*10 + j}
                                fill={jEl}
                                stroke={colorList[i][j] === resolveColor(formatMode) ? '#9040b8' : 'none'}
                                strokeWidth={"2%"}
                                onClick={_ => setNodeParam({ [resolveColorName(formatMode)] : colorList[i][j] })}
                            />))))}
                </svg>
            </div>
            <div>
                <IconButton disableRipple={true} color='secondary' onClick={resolveReset(formatMode)}>
                    <DoDisturbIcon/>
                </IconButton>
            </div>
            <div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingLeft: 12, paddingRight: 12 }}>
                    <StyledButtonGroup open={formatMode === '' } valueList={['reset format']} value={''} action={resetFormat} disabled={disabled}/>
                    <StyledButtonGroup open={formatMode === 'line'} valueList={LINE_WIDTH_TYPES} value={lineWidth} action={setLineWidth} disabled={disabled}/>
                    <StyledButtonGroup open={formatMode === 'line'} valueList={LINE_TYPE_TYPES} value={lineType} action={setLineType} disabled={disabled}/>
                    <StyledButtonGroup open={formatMode === 'border'} valueList={BORDER_WIDTH_TYPES} value={borderWidth} action={setBorderWidth} disabled={disabled}/>
                    <StyledButtonGroup open={formatMode === 'text'} valueList={FONT_SIZE_TYPES} value={textFontSize} action={setTextFontSize} disabled={disabled}/>
                    <StyledButtonGroup open={formatMode === ''} valueList={['convert to task']} value={''} action={toggleTask} disabled={disabled}/>
                    <StyledButtonGroup open={formatMode === ''} valueList={['convert to submap']} value={''} action={createMapInMap} disabled={disabled}/>
                </div>
            </div>
        </div>
    )
}
