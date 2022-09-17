import {useSelector, useDispatch, RootStateOrAny} from "react-redux"
import {Button, ButtonGroup, IconButton} from '@mui/material'
import {colorList} from '../core/Colors'
import {setClear} from '../core/Utils'
import {FormatMode, MAP_RIGHTS} from '../core/EditorFlow'
import {BorderIcon, FillIcon, LineIcon, TextIcon} from './Icons'
import {LineTypes, TextTypes, WidthTypes} from "../core/DefaultProps";

const TargetedButtonGroup = ({KEYS, value, setValue}: { KEYS: string[], value: string, setValue: Function }) => {
    const {UNAUTHORIZED, VIEW} = MAP_RIGHTS
    const mapRight = useSelector((state: RootStateOrAny) => state.mapRight)
    const disabled = [UNAUTHORIZED, VIEW].includes(mapRight)
    return (
        <ButtonGroup className="targeted-button-group" disabled={disabled} variant="text" color="primary">
            {KEYS.map((name, idx) =>
                <Button
                    style={{ backgroundColor: value === KEYS[idx] ? 'var(--button-color)' : '' }}
                    onClick={() => setValue(KEYS[idx])}
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
    const setNodeParam = (obj: object) => dispatch({type: 'SET_NODE_PARAMS', payload: {node: obj, nodeTriggersMap: true}})

    const setFormatModeText = () => dispatch({type: 'SET_FORMAT_MODE', payload: FormatMode.text})
    const setFormatModeFill = () => dispatch({type: 'SET_FORMAT_MODE', payload: FormatMode.fill})
    const setFormatModeBorder = () => dispatch({type: 'SET_FORMAT_MODE', payload: FormatMode.border})
    const setFormatModeLine = () => dispatch({type: 'SET_FORMAT_MODE', payload: FormatMode.line})
    const closeFormatter = () => dispatch({type: 'SET_FORMATTER_VISIBLE', payload: false})

    const setNodeColor = (value: string) => {
        if (formatMode === FormatMode.text) setNodeParam({textColor: value})
        if (formatMode === FormatMode.border) setNodeParam({borderColor: value})
        if (formatMode === FormatMode.fill) setNodeParam({fillColor: value})
        if (formatMode === FormatMode.line) setNodeParam({lineColor: value})
    }

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
        <div className="_bg fixed w-[216px] top-[96px] right-[64px] flex flex-col gap-3 rounded-2xl p-3">
            <div className="flex justify-center">
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
                <span className="fixed top-[97px] w-[40px] h-[2px] bg-[color:var(--main-color)]" style={{right: 225 - 40* formatMode}}/>
            </div>
            <div className="flex justify-center">
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
                                            onClick={() => setNodeColor(colorList[i][j])}
                                        />
                                    )
                                )
                            )
                        )
                    }
                    </svg>
                </div>
            </div>
            <div className="flex flex-col items-center">
                {
                    formatMode === FormatMode.text &&
                    <TargetedButtonGroup
                        KEYS={Object.keys(TextTypes).filter(x => !(parseInt(x) >= 0))}
                        value={TextTypes[textFontSize]}
                        setValue={(value: number) => setNodeParam({textFontSize: TextTypes[value]})}
                    />
                }
                {
                    formatMode === FormatMode.border &&
                    <TargetedButtonGroup
                        KEYS={Object.keys(WidthTypes).filter(x => !(parseInt(x) >= 0))}
                        value={WidthTypes[borderWidth]}
                        setValue={(value: number) => setNodeParam({borderWidth: WidthTypes[value]})}
                    />
                }
                {
                    formatMode === FormatMode.line &&
                    <>
                        <TargetedButtonGroup
                            KEYS={Object.keys(WidthTypes).filter(x => !(parseInt(x) >= 0))}
                            value={WidthTypes[lineWidth]}
                            setValue={(value: number) => setNodeParam({lineWidth: WidthTypes[value]})}
                        />
                        <TargetedButtonGroup
                            KEYS={Object.keys(LineTypes).filter(x => !(parseInt(x) >= 0))}
                            value={LineTypes[lineType]}
                            setValue={(value: number) => setNodeParam({lineType: LineTypes[value]})}
                        />
                    </>
                }
            </div>
            <div className="flex flex-row justify-center">
                <Button color="primary" variant='outlined' onClick={resolveFormatClear}>
                    {'RESET'}
                </Button>
            </div>
            <div className="flex flex-row justify-center">
                <Button color="primary" variant='outlined' onClick={closeFormatter}>
                    {'CLOSE'}
                </Button>
            </div>
        </div>
    )
}
