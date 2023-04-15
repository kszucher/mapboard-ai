import {FC} from "react"
import {RootStateOrAny, useDispatch, useSelector} from "react-redux"
import {Button, IconButton} from '@mui/material'
import {BorderIcon, FillIcon, LineIcon, TextIcon} from './Icons'
import {TargetedButtonGroup} from "./TargetedButtonGroup"
import {colorList} from '../core/Colors'
import {actions} from '../editor/EditorReducer'
import {FormatMode, LineTypes, TextTypes, WidthTypes} from "../core/Enums"
import {getSelectionFamilyProp, getSelectionProp, getLS} from "../map/MapUtils"

export const Formatter: FC = () => {
  const o = 32
  const r = 12
  const width =  o * colorList[0].length
  const height = o * colorList.length
  const formatMode = useSelector((state: RootStateOrAny) => state.editor.formatMode)
  const mapListIndex = useSelector((state: RootStateOrAny) => state.editor.mapListIndex)
  const mapList = useSelector((state: RootStateOrAny) => state.editor.mapList)
  const tm = useSelector((state: RootStateOrAny) => state.editor.tempMap)
  const m = tm.length ? tm : mapList[mapListIndex]
  const ls = getLS(m)
  const lineWidth = WidthTypes[getSelectionProp(m, 'lineWidth') || 0]
  const lineType = LineTypes[getSelectionProp(m, 'lineType') || 0]
  const lineColor = getSelectionProp(m, 'lineColor')
  const borderWidth = WidthTypes[ls.selection === 's' ? getSelectionProp(m, 'sBorderWidth') || 0 : getSelectionFamilyProp(m, 'fBorderWidth') || 0]
  const borderColor = ls.selection === 's' ? getSelectionProp(m, 'sBorderColor') : getSelectionFamilyProp(m, 'fBorderColor')
  const fillColor = ls.selection === 's' ? getSelectionProp(m, 'sFillColor') : getSelectionFamilyProp(m, 'fFillColor')
  const textFontSize = TextTypes[getSelectionProp(m, 'textFontSize') || 0]
  const textColor = getSelectionProp(m, 'textColor')
  const dispatch = useDispatch()
  const setFormatText = () => dispatch(actions.setFormatMode(FormatMode.text))
  const setFormatBorder = () => dispatch(actions.setFormatMode(FormatMode.border))
  const setFormatFill = () => dispatch(actions.setFormatMode(FormatMode.fill))
  const setFormatLine = () => dispatch(actions.setFormatMode(FormatMode.line))
  const mapDispatch = (type: string, payload: any) => dispatch(actions.mapAction({ type, payload } ))
  const setLineWidth = (v: number) => mapDispatch('setLineWidth', WidthTypes[v])
  const setLineType = (v: number) => mapDispatch('setLineType', LineTypes[v])
  const setLineColor = (v: string) => mapDispatch('setLineColor', v)
  const setBorderWidth = (v: number) => mapDispatch('setBorderWidth', WidthTypes[v])
  const setBorderColor = (v: string) => mapDispatch('setBorderColor', v)
  const setFillColor = (v: string) => mapDispatch('setFillColor', v)
  const setTextFontSize = (v: number) => mapDispatch('setTextFontSize', TextTypes[v])
  const setTextColor = (v: string) => mapDispatch('setTextColor', v)
  const clearText = () => mapDispatch('clearText', null)
  const clearBorder = () => mapDispatch('clearBorder', null)
  const clearFill = () => mapDispatch('clearFill', null)
  const clearLine = () => mapDispatch('clearLine', null)
  return (
    <div className="_bg fixed w-[216px] top-[96px] right-[64px] flex flex-col gap-3 rounded-2xl p-3">
      <div className="flex justify-center">
        <IconButton color='secondary' aria-label="text" onClick={(setFormatText)}><TextIcon/></IconButton>
        <IconButton color='secondary' aria-label="border" onClick={setFormatBorder}><BorderIcon selection={ls.selection}/></IconButton>
        <IconButton color='secondary' aria-label="fill" onClick={setFormatFill}><FillIcon selection={ls.selection}/></IconButton>
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
          }}
        >
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
