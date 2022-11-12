import {FC} from "react";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux"
import {Button, IconButton} from '@mui/material'
import {colorList} from '../core/Colors'
import {actions} from '../core/EditorFlow'
import {BorderIcon, FillIcon, LineIcon, TextIcon} from './Icons'
import {TargetedButtonGroup} from "./TargetedButtonGroup";
import {FormatMode, LineTypes, TextTypes, WidthTypes} from "../core/Types";
import {useMapDispatch} from "../hooks/UseMapDispatch";

export const Formatter: FC = () => {
  const o = 32
  const r = 12
  const width =  o * colorList[0].length
  const height = o * colorList.length

  const formatMode = useSelector((state: RootStateOrAny) => state.formatMode)
  const colorMode = useSelector((state: RootStateOrAny) => state.colorMode)

  const m = useSelector((state: RootStateOrAny) => state.mapStackData[state.mapStackDataIndex])
  const { selection, textColor, textFontSize, borderColor, borderWidth, fillColor, lineColor, lineWidth, lineType } = m.nc

  const dispatch = useDispatch()
  const mapDispatch = (action: string, payload: any) => useMapDispatch(dispatch, colorMode, action, payload)

  const setNodeColor = (value: string) => {
    if (formatMode === FormatMode.text)
      dispatch(actions.setNodeParams({node: {textColor: value}, nodeTriggersMap: true}))
    else if (formatMode === FormatMode.border)
      dispatch(actions.setNodeParams({node: {borderColor: value}, nodeTriggersMap: true}))
    else if (formatMode === FormatMode.fill)
      dispatch(actions.setNodeParams({node: {fillColor: value}, nodeTriggersMap: true}))
    else if (formatMode === FormatMode.line)
      dispatch(actions.setNodeParams({node: {lineColor: value}, nodeTriggersMap: true}))
  }

  const resolveFormatColor = () => {
    if (formatMode === FormatMode.text) return textColor
    if (formatMode === FormatMode.border) return borderColor
    if (formatMode === FormatMode.fill) return fillColor
    if (formatMode === FormatMode.line) return lineColor
  }

  const resolveFormatClear = () => {
    if (formatMode === FormatMode.text)
      dispatch(actions.setNodeParams({node: {textColor: 'clear', textFontSize: 'clear'}, nodeTriggersMap: true}))
    else if (formatMode === FormatMode.border)
      dispatch(actions.setNodeParams({node: {borderWidth: 'clear', borderColor: 'clear'}, nodeTriggersMap: true}))
    else if (formatMode === FormatMode.fill)
      dispatch(actions.setNodeParams({node: {fillColor: 'clear'}, nodeTriggersMap: true}))
    else if (formatMode === FormatMode.line)
      dispatch(actions.setNodeParams({node: {lineType: 'clear', lineWidth: 'clear', lineColor: 'clear'}, nodeTriggersMap: true}))
  }

  return (
    <div className="_bg fixed w-[216px] top-[96px] right-[64px] flex flex-col gap-3 rounded-2xl p-3">
      <div className="flex justify-center">
        <IconButton color='secondary' aria-label="text" onClick={_=>dispatch(actions.setFormatMode(FormatMode.text))}>
          <TextIcon/>
        </IconButton>
        <IconButton color='secondary' aria-label="border" onClick={_=>dispatch(actions.setFormatMode(FormatMode.border))}>
          <BorderIcon selection={selection}/>
        </IconButton>
        <IconButton color='secondary' aria-label="fill" onClick={_=>dispatch(actions.setFormatMode(FormatMode.fill))}>
          <FillIcon selection={selection}/>
        </IconButton>
        <IconButton color='secondary' aria-label="line" onClick={_=>dispatch(actions.setFormatMode(FormatMode.line))}>
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
                      aria-label={colorList[i][j]}
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
            setValue={(value: number) => dispatch(actions.setNodeParams({node: {textFontSize: TextTypes[value]}, nodeTriggersMap: true}))}
          />
        }
        {
          formatMode === FormatMode.border &&
          <TargetedButtonGroup
            KEYS={Object.keys(WidthTypes).filter(x => !(parseInt(x) >= 0))}
            value={WidthTypes[borderWidth]}
            setValue={(value: number) => dispatch(actions.setNodeParams({node: {borderWidth: WidthTypes[value]}, nodeTriggersMap: true}))}
          />
        }
        {
          formatMode === FormatMode.line &&
          <>
            <TargetedButtonGroup
              KEYS={Object.keys(WidthTypes).filter(x => !(parseInt(x) >= 0))}
              value={WidthTypes[lineWidth]}
              setValue={(value: number) => dispatch(actions.setNodeParams({node: {lineWidth: WidthTypes[value]}, nodeTriggersMap: true}))}
            />
            <TargetedButtonGroup
              KEYS={Object.keys(LineTypes).filter(x => !(parseInt(x) >= 0))}
              value={LineTypes[lineType]}
              setValue={(value: number) => dispatch(actions.setNodeParams({node: {lineType: LineTypes[value]}, nodeTriggersMap: true}))}
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
        <Button color="primary" variant='outlined' onClick={_=>dispatch(actions.toggleFormatterVisible())}>
          {'CLOSE'}
        </Button>
      </div>
    </div>
  )
}
