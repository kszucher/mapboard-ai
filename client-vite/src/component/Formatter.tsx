import {FC} from "react"
import {RootStateOrAny, useDispatch, useSelector} from "react-redux"
import {Button, IconButton} from '@mui/material'
import {BorderIcon, FillIcon, LineIcon, TextIcon} from './Icons'
import {TargetedButtonGroup} from "./TargetedButtonGroup"
import {colorList} from '../core/Colors'
import {actions} from '../core/EditorReducer'
import {FormatMode, LineTypes, TextTypes, WidthTypes} from "../core/Enums"
import {N} from "../state/NPropsTypes";

export const Formatter: FC = () => {
  const o = 32
  const r = 12
  const width =  o * colorList[0].length
  const height = o * colorList.length
  const formatMode = useSelector((state: RootStateOrAny) => state.editor.formatMode)
  const mapListIndex = useSelector((state: RootStateOrAny) => state.editor.mapListIndex)
  const mapList = useSelector((state: RootStateOrAny) => state.editor.mapList)
  const tm = useSelector((state: RootStateOrAny) => state.editor.tempMap)
  const ml = tm && Object.keys(tm).length ? tm : mapList[mapListIndex]
  const g = ml.filter((n: N) => n.path.length === 1).at(0)
  const { selection, textColor, textFontSize, borderColor, borderWidth, fillColor, lineColor, lineWidth, lineType } = g.nc
  const dispatch = useDispatch()

  const setNodeColor = (value: string) => {
    if (formatMode === FormatMode.text) dispatch(actions.mapAction({type: 'setFormatParams', payload:{textColor: value}}))
    else if (formatMode === FormatMode.border) dispatch(actions.mapAction({type: 'setFormatParams', payload:{borderColor: value}}))
    else if (formatMode === FormatMode.fill) dispatch(actions.mapAction({type: 'setFormatParams', payload:{fillColor: value}}))
    else if (formatMode === FormatMode.line) dispatch(actions.mapAction({type: 'setFormatParams', payload:{lineColor: value}}))
  }

  const resolveFormatColor = () => {
    if (formatMode === FormatMode.text) return textColor
    if (formatMode === FormatMode.border) return borderColor
    if (formatMode === FormatMode.fill) return fillColor
    if (formatMode === FormatMode.line) return lineColor
  }

  const resolveFormatClear = () => {
    if (formatMode === FormatMode.text) dispatch(actions.mapAction({type: 'setFormatParams', payload:{textColor: 'clear', textFontSize: 'clear'}}))
    else if (formatMode === FormatMode.border) dispatch(actions.mapAction({type: 'setFormatParams', payload:{borderWidth: 'clear', borderColor: 'clear'}}))
    else if (formatMode === FormatMode.fill) dispatch(actions.mapAction({type: 'setFormatParams', payload:{fillColor: 'clear'}}))
    else if (formatMode === FormatMode.line) dispatch(actions.mapAction({type: 'setFormatParams', payload:{lineType: 'clear', lineWidth: 'clear', lineColor: 'clear'}}))
  }

  return (
    <div className="_bg fixed w-[216px] top-[96px] right-[64px] flex flex-col gap-3 rounded-2xl p-3">
      <div className="flex justify-center">
        <IconButton color='secondary' aria-label="text"
                    onClick={_=>dispatch(actions.setFormatMode(FormatMode.text))}>
          <TextIcon/>
        </IconButton>
        <IconButton color='secondary' aria-label="border"
                    onClick={_=>dispatch(actions.setFormatMode(FormatMode.border))}>
          <BorderIcon selection={selection}/>
        </IconButton>
        <IconButton color='secondary' aria-label="fill"
                    onClick={_=>dispatch(actions.setFormatMode(FormatMode.fill))}>
          <FillIcon selection={selection}/>
        </IconButton>
        <IconButton color='secondary' aria-label="line"
                    onClick={_=>dispatch(actions.setFormatMode(FormatMode.line))}>
          <LineIcon/>
        </IconButton>
        <span className="fixed top-[97px] w-[40px] h-[2px] bg-[color:var(--main-color)]"
              style={{right: 225 - 40* formatMode}}/>
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
        {formatMode === FormatMode.text && <TargetedButtonGroup
          KEYS={Object.keys(TextTypes).filter(x => !(parseInt(x) >= 0))}
          value={TextTypes[textFontSize]}
          setValue={(value: number) => dispatch(actions.mapAction({type: 'setFormatParams', payload:{textFontSize: TextTypes[value]}}))}
        />}
        {formatMode === FormatMode.border && <TargetedButtonGroup
          KEYS={Object.keys(WidthTypes).filter(x => !(parseInt(x) >= 0))}
          value={WidthTypes[borderWidth]}
          setValue={(value: number) => dispatch(actions.mapAction({type: 'setFormatParams', payload:{borderWidth: WidthTypes[value]}}))}
        />}
        {formatMode === FormatMode.line && <>
          <TargetedButtonGroup
            KEYS={Object.keys(WidthTypes).filter(x => !(parseInt(x) >= 0))}
            value={WidthTypes[lineWidth]}
            setValue={(value: number) => dispatch(actions.mapAction({type: 'setFormatParams', payload:{lineWidth: WidthTypes[value]}}))}
          />
          <TargetedButtonGroup
            KEYS={Object.keys(LineTypes).filter(x => !(parseInt(x) >= 0))}
            value={LineTypes[lineType]}
            setValue={(value: number) => dispatch(actions.mapAction({type: 'setFormatParams', payload:{lineType: LineTypes[value]}}))}
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
