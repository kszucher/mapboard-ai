import {useSelector, useDispatch} from "react-redux"
import { Button } from '@mui/material'
import { getColors } from '../core/Colors'

const colorList = [
    // ['#D3EBCE', '#ECFDDF', '#FDFFEB', '#FFECD6', '#FED3D0', '#FED3D0'],
    // ['#EFEFEF', '#DEDEE8', '#F3F0E0', '#E4EADE', '#DCE5E6', '#DCE5E6'],
    // ['#9086A6', '#E0C1D2', '#EFF0ED', '#9DD4C9', '#75A3BA', '#75A3BA'],
    // ['#A0D7D9', '#FBE7A3', '#F4CBA1', '#F8FDDF', '#AE99BF', '#AE99BF'],
    // ['#1C5D6C', '#70A18F', '#B7CFAE', '#EDDDCF', '#B25C6D', '#B25C6D'],
    // ['#B2CFC9', '#95BABD', '#9292B0', '#F6A7A7', '#FFD6C9', '#FFD6C9'],
    // ['#04A4B5', '#30BFBF', '#56D3CB', '#EEEE99', '#EBD295', '#fafafa'],
    // ['#285588', '#E36273', '#FCC40F', '#ECE7C7', '#A8875E', '#347ab7'],
    // ['#605E85', '#6CCC86', '#F7D36F', '#FD7780', '#994D80', '#aa0011'],
    // ['#B4C2D6', '#BFE3DA', '#F5FCDC', '#FEFFF7', '#C0DDBE', '#f2dede'],
    // ['#FFD6DE', '#E8CEE3', '#C7BAE1', '#BBD3EC', '#ECE4C5', '#82c5e2'],
    ['#391F19', '#B68E63', '#F2DFA9', '#E58119', '#746839', '#09415A'],
]

export function Palette () {
    const colorMode = useSelector(state => state.colorMode)
    const {MAP_BACKGROUND} = getColors(colorMode)
    const formatMode = useSelector(state => state.formatMode)
    const lineColor = useSelector(state => state.node.lineColor)
    const borderColor = useSelector(state => state.node.borderColor)
    const fillColor = useSelector(state => state.node.fillColor)
    const textColor = useSelector(state => state.node.textColor)
    const dispatch = useDispatch()
    const setNodeParam = (nodeParamObj) => dispatch({type: 'SET_NODE_PARAMS', payload: nodeParamObj })
    const closePalette = _ => dispatch({type: 'CLOSE_PALETTE'})

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

    const o = 32
    const r = 12
    const xWidth = o * colorList[0].length
    const yWidth = o * colorList.length

    return (
        <div style={{
            position: 'fixed',
            top: 12 + 40*4,
            right: 80,
            width: xWidth,
            height: yWidth,
            backgroundColor: MAP_BACKGROUND,
            padding: 4,
            borderRadius: '16px 16px 16px 16px',
            borderRight: 0,
            borderColor: '#dddddd',
        }}>
            <svg viewBox={`0 0 ${xWidth} ${yWidth}`}>
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
            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center', paddingTop: 12 }}>
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
