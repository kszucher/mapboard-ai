import {useSelector, useDispatch, RootStateOrAny} from "react-redux"
import { Button, ButtonGroup, IconButton } from '@mui/material'
import { colorList } from '../../core/Colors'
import { setClear } from '../../core/Utils'
import {FormatMode, MAP_RIGHTS} from '../../core/EditorFlow'
import { BorderIcon, FillIcon, LineIcon, TextIcon } from '../unsorted/Icons'

enum TextTypes {
    h1 = 36,
    h2 = 24,
    h3 = 18,
    h4 = 16,
    t = 14,
    // [36]: 'h1', [24]: 'h2', [18]: 'h3', [16]: 'h4', [14]: 't'}
    // TODO zeigarnik: try to use it for all 3 parameters
    // https://www.typescriptlang.org/docs/handbook/enums.html
    // https://bobbyhadz.com/blog/typescript-get-enum-key-by-value
}

const TargetedButtonGroup = (
    {KEYS, value, setValue}: {
        KEYS: string[],
        value: string,
        setValue: Function,
    }) => {
    const {UNAUTHORIZED, VIEW} = MAP_RIGHTS
    const mapRight = useSelector((state: RootStateOrAny) => state.mapRight)
    const disabled = [UNAUTHORIZED, VIEW].includes(mapRight)
    return (
        <ButtonGroup className="targeted-button-group" disabled={disabled} variant="text" color="primary">
            {KEYS.map((name, idx) =>
                <Button
                    style={{ backgroundColor: value === KEYS[idx] ? 'var(--button-color)' : '' }}
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

    const formatMode = useSelector((state: RootStateOrAny) => state.formatMode)
    const selection = useSelector((state: RootStateOrAny) => state.node.selection)
    const textColor = useSelector((state: RootStateOrAny) => state.node.textColor)
    const textFontSize = useSelector((state: RootStateOrAny) => state.node.textFontSize)
    const borderColor = useSelector((state: RootStateOrAny) => state.node.borderColor)
    const borderWidth = useSelector((state: RootStateOrAny) => state.node.borderWidth)
    const fillColor = useSelector((state: RootStateOrAny) => state.node.fillColor)
    const lineColor = useSelector((state: RootStateOrAny) => state.node.lineColor)
    const lineWidth = useSelector((state: RootStateOrAny) => state.node.lineWidth)
    const lineType = useSelector((state: RootStateOrAny) => state.node.lineType)

    const dispatch = useDispatch()
    const setNodeParam =
        obj => dispatch({type: 'SET_NODE_PARAMS', payload: { node: obj, nodeTriggersMap: true } })
    const setFormatModeText = _ => dispatch({type: 'SET_FORMAT_MODE', payload: FormatMode.text})
    const setFormatModeFill = _ => dispatch({type: 'SET_FORMAT_MODE', payload: FormatMode.fill})
    const setFormatModeBorder = _ => dispatch({type: 'SET_FORMAT_MODE', payload: FormatMode.border})
    const setFormatModeLine = _ => dispatch({type: 'SET_FORMAT_MODE', payload: FormatMode.line})
    const closeFormatter = _ => dispatch({type: 'SET_FORMATTER_VISIBLE', payload: false})

    const resolveFormatColor = () => {
        if (formatMode === FormatMode.text) return textColor
        if (formatMode === FormatMode.border) return borderColor
        if (formatMode === FormatMode.fill) return fillColor
        if (formatMode === FormatMode.line) return lineColor
    }

    const resolveFormatClear = () => {
        if (formatMode === FormatMode.text) setNodeParam(setClear(['textColor', 'textFontSize']))
        if (formatMode === FormatMode.border) setNodeParam(setClear(['borderWidth', 'borderColor']))
        if (formatMode === FormatMode.fill) setNodeParam(setClear(['fillColor']))
        if (formatMode === FormatMode.line) setNodeParam(setClear(['lineType', 'lineWidth', 'lineColor']))
    }

    return (
        <div id="formatter">
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <IconButton color='secondary' onClick={setFormatModeText}>
                    <TextIcon/>
                </IconButton>
                <IconButton color='secondary' onClick={setFormatModeBorder}>
                    <BorderIcon selection={selection}/>
                </IconButton>
                <IconButton color='secondary' onClick={setFormatModeFill}>
                    <FillIcon selection={selection}/>
                </IconButton>
                <IconButton color='secondary' onClick={setFormatModeLine}>
                    <LineIcon/>
                </IconButton>
                <span className='formatter-highlight' style={{right: 225 - 40* formatMode}}/>
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
                                            stroke={colorList[i][j] === resolveFormatColor() ? '#9040b8' : 'none'}
                                            strokeWidth={"2%"}
                                            onClick={_ => setNodeParam({[formatMode + 'Color'] : colorList[i][j]})}
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
                    formatMode === FormatMode.text &&
                    <TargetedButtonGroup
                        KEYS={['h1', 'h2', 'h3', 'h4', 't']}
                        value={{[36]: 'h1', [24]: 'h2', [18]: 'h3', [16]: 'h4', [14]: 't'}[textFontSize]}
                        setValue={value => setNodeParam({textFontSize: {['h1']: 36, ['h2']: 24, ['h3']: 18, ['h4']: 16, ['t']: 14}[value]})}
                    />
                }
                {
                    formatMode === FormatMode.border &&
                    <TargetedButtonGroup
                        KEYS={['w1', 'w2', 'w3']}
                        value={{[1]: 'w1', [2]: 'w2', [3]: 'w3'}[borderWidth]}
                        setValue={value => setNodeParam({borderWidth: {['w1']: 1, ['w2']: 2, ['w3']: 3}[value]})}
                    />
                }
                {
                    formatMode === FormatMode.line &&
                    <>
                        <TargetedButtonGroup
                            KEYS={['w1', 'w2', 'w3']}
                            value={{[1]: 'w1', [2]: 'w2', [3]: 'w3'}[lineWidth]}
                            setValue={value => setNodeParam({lineWidth: {['w1']: 1, ['w2']: 2, ['w3']: 3}[value]})}
                        />
                        <TargetedButtonGroup
                            KEYS={['bezier', 'edge']}
                            value={{['b']: 'bezier', ['e']: 'edge'}[lineType]}
                            setValue={value => setNodeParam({lineType: {['bezier']: 'b', ['edge']: 'e'}[value]})}
                        />
                    </>
                }
            </div>
            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center' }}>
                <Button color="primary" variant='outlined'
                        onClick={resolveFormatClear}>
                    {'RESET'}
                </Button>
            </div>
            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center' }}>
                <Button color="primary" variant='outlined' onClick={closeFormatter}>{'CLOSE'}</Button>
            </div>
        </div>
    )
}
