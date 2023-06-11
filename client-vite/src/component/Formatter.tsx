import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Button, IconButton} from '@mui/material'
import {mSelector} from "../state/EditorState";
import {BorderIcon, FillIcon, LineIcon, TextIcon} from './Icons'
import {TargetedButtonGroup} from "./TargetedButtonGroup"
import {colorList} from './Colors'
import {actions, AppDispatch, RootState} from '../core/EditorReducer'
import {FormatMode, LineTypes, TextTypes, WidthTypes} from "../state/Enums"
import {getPropXASSO, getPropXA, getX} from "../core/MapUtils"

export const Formatter: FC = () => {
  const o = 32
  const r = 12
  const width =  o * colorList[0].length
  const height = o * colorList.length
  const formatMode = useSelector((state: RootState) => state.editor.formatMode)
  const m = useSelector((state:RootState) => mSelector(state))
  const x = getX(m)
  const lineWidth = WidthTypes[getPropXA(m, 'lineWidth') as number || 0]
  const lineType = LineTypes[getPropXA(m, 'lineType') as number || 0]
  const lineColor = getPropXA(m, 'lineColor')
  const borderWidth = WidthTypes[x.selection === 's' ? getPropXA(m, 'sBorderWidth') as number || 0 : getPropXASSO(m, 'fBorderWidth') as number || 0]
  const borderColor = x.selection === 's' ? getPropXA(m, 'sBorderColor') : getPropXASSO(m, 'fBorderColor')
  const fillColor = x.selection === 's' ? getPropXA(m, 'sFillColor') : getPropXASSO(m, 'fFillColor')
  const textFontSize = TextTypes[getPropXA(m, 'textFontSize') as number || 0]
  const textColor = getPropXA(m, 'textColor')
  const dispatch = useDispatch<AppDispatch>()
  const setFormatText = () => dispatch(actions.setFormatMode(FormatMode.text))
  const setFormatBorder = () => dispatch(actions.setFormatMode(FormatMode.border))
  const setFormatFill = () => dispatch(actions.setFormatMode(FormatMode.fill))
  const setFormatLine = () => dispatch(actions.setFormatMode(FormatMode.line))
  const setLineWidth = (v: number) => dispatch(actions.mapAction({type: 'setLineWidth', payload: WidthTypes[v]}))
  const setLineType = (v: number) => dispatch(actions.mapAction({type: 'setLineType', payload: LineTypes[v]}))
  const setLineColor = (v: string) => dispatch(actions.mapAction({type: 'setLineColor', payload: v}))
  const setBorderWidth = (v: number) => dispatch(actions.mapAction({type: 'setBorderWidth', payload:WidthTypes[v]}))
  const setBorderColor = (v: string) => dispatch(actions.mapAction({type: 'setBorderColor', payload: v}))
  const setFillColor = (v: string) => dispatch(actions.mapAction({type: 'setFillColor', payload: v}))
  const setTextFontSize = (v: number) => dispatch(actions.mapAction({type: 'setTextFontSize', payload: TextTypes[v]}))
  const setTextColor = (v: string) => dispatch(actions.mapAction({type: 'setTextColor', payload: v}))
  const clearText = () => dispatch(actions.mapAction({type: 'clearText', payload: null}))
  const clearBorder = () => dispatch(actions.mapAction({type: 'clearBorder', payload: null}))
  const clearFill = () => dispatch(actions.mapAction({type: 'clearFill', payload: null}))
  const clearLine = () => dispatch(actions.mapAction({type: 'clearLine', payload: null}))
  return (
    <div className="_bg fixed w-[216px] top-[96px] right-[64px] flex flex-col gap-3 rounded-lg p-3">
      <div className="flex justify-center">
        <IconButton color='secondary' aria-label="text" onClick={(setFormatText)}><TextIcon/></IconButton>
        <IconButton color='secondary' aria-label="border" onClick={setFormatBorder}><BorderIcon selection={x.selection}/></IconButton>
        <IconButton color='secondary' aria-label="fill" onClick={setFormatFill}><FillIcon selection={x.selection}/></IconButton>
        <IconButton color='secondary' aria-label="line" onClick={setFormatLine}><LineIcon/></IconButton>
        <span className="fixed top-[97px] w-[40px] h-[2px] bg-[color:var(--main-color)]" style={{right: 225 - 40* formatMode}}/>
      </div>
      <div className="flex justify-center">
        <div style={{ width, height }}>
          <svg viewBox={`0 0 ${width} ${height}`}>{
            colorList.map((iEl, i) => (
                iEl.map((jEl, j) => (
                    <circle
                      aria-label={colorList[i][j]}
                      cx={o/2 + j*o}
                      cy={o/2 + i*o}
                      r={r}
                      key={'key' + i*10 + j}
                      fill={jEl}
                      stroke={colorList[i][j] === (() => {
                        if (formatMode === FormatMode.text) return textColor
                        if (formatMode === FormatMode.border) return borderColor
                        if (formatMode === FormatMode.fill) return fillColor
                        if (formatMode === FormatMode.line) return lineColor
                      })() ? '#9040b8' : 'none'}
                      strokeWidth={"2%"}
                      onClick={() => {
                        const color = colorList[i][j]
                        if (formatMode === FormatMode.text) setTextColor(color)
                        else if (formatMode === FormatMode.border) setBorderColor(color)
                        else if (formatMode === FormatMode.fill) setFillColor(color)
                        else if (formatMode === FormatMode.line) setLineColor(color)
                      }}
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
        {formatMode === FormatMode.text && <TargetedButtonGroup KEYS={Object.keys(TextTypes).filter(x => !(parseInt(x) >= 0))} value={textFontSize} setValue={(v: number) => setTextFontSize(v)}/>}
        {formatMode === FormatMode.border && <TargetedButtonGroup KEYS={Object.keys(WidthTypes).filter(x => !(parseInt(x) >= 0))} value={borderWidth} setValue={(v: number) => setBorderWidth(v)}/>}
        {formatMode === FormatMode.line && <TargetedButtonGroup KEYS={Object.keys(WidthTypes).filter(x => !(parseInt(x) >= 0))} value={lineWidth} setValue={(v: number) => setLineWidth(v)}/>}
        {formatMode === FormatMode.line && <TargetedButtonGroup KEYS={Object.keys(LineTypes).filter(x => !(parseInt(x) >= 0))} value={lineType} setValue={(v: number) => setLineType(v)}/>
        }
      </div>
      <div className="flex flex-row justify-center">
        <Button
          color="primary"
          variant='outlined'
          onClick={() => {
            if (formatMode === FormatMode.text) clearText()
            else if (formatMode === FormatMode.border) clearBorder()
            else if (formatMode === FormatMode.fill) clearFill()
            else if (formatMode === FormatMode.line) clearLine()
          }}>
          {'RESET'}
        </Button>
      </div>
      <div className="flex flex-row justify-center">
        <Button
          color="primary"
          variant='outlined'
          onClick={() => dispatch(actions.toggleFormatterVisible())}
        >
          {'CLOSE'}
        </Button>
      </div>
    </div>
  )
}
