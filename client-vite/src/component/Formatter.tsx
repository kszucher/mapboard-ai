import React, {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Button, ButtonGroup, IconButton} from '@mui/material'
import {mSelector} from "../state/EditorState"
import {FBorderIcon, FFillIcon, LineIcon, SBorderIcon, SFillIcon, TextIcon} from './MuiSvgIcons'
import {colorList} from './Colors'
import {actions, AppDispatch, RootState} from '../reducers/EditorReducer'
import {AccessTypes, FormatMode, LineTypes, TextTypes, WidthTypes} from "../state/Enums"
import {getPropXA, getX, isXR, isXS} from "../reducers/MapUtils"

const getKeys = (type: object) => Object.keys(type).filter(xn => !(parseInt(xn) >= 0))

export const Formatter: FC = () => {
  const o = 32
  const r = 12
  const width = o * colorList[0].length
  const height = o * colorList.length
  const formatMode = useSelector((state: RootState) => state.editor.formatMode)
  const m = useSelector((state:RootState) => mSelector(state))
  const xn = getX(m)
  const access = useSelector((state: RootState) => state.editor.access)
  const disabled = [AccessTypes.UNAUTHORIZED, AccessTypes.VIEW].includes(access)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div className="_bg fixed w-[224px] top-[80px] right-0 flex flex-col gap-3 rounded-l-lg p-3 z-50">
      <div className="flex justify-center">
        <IconButton color='secondary' onClick={() => {dispatch(actions.setFormatMode(FormatMode.text))}}><TextIcon isSelected={formatMode == FormatMode.text}/></IconButton>
        <IconButton color='secondary' onClick={() => {dispatch(actions.setFormatMode(FormatMode.sBorder))}}><SBorderIcon isSelected={formatMode == FormatMode.sBorder}/></IconButton>
        <IconButton color='secondary' onClick={() => {dispatch(actions.setFormatMode(FormatMode.fBorder))}}><FBorderIcon isSelected={formatMode == FormatMode.fBorder} /></IconButton>
      </div>
      <div className="flex justify-center">
        <IconButton color='secondary' onClick={() => {dispatch(actions.setFormatMode(FormatMode.line))}}><LineIcon isSelected={formatMode == FormatMode.line}/></IconButton>
        <IconButton color='secondary' onClick={() => {dispatch(actions.setFormatMode(FormatMode.sFill))}}><SFillIcon isSelected={formatMode == FormatMode.sFill}/></IconButton>
        <IconButton color='secondary' onClick={() => {dispatch(actions.setFormatMode(FormatMode.fFill))}}><FFillIcon isSelected={formatMode == FormatMode.fFill}/></IconButton>
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
                        if (formatMode === FormatMode.text) return getPropXA(m, 'textColor')
                        if (formatMode === FormatMode.sBorder) return getPropXA(m, 'sBorderColor')
                        if (formatMode === FormatMode.fBorder) return getPropXA(m, 'fBorderColor')
                        if (formatMode === FormatMode.sFill) return getPropXA(m, 'sFillColor')
                        if (formatMode === FormatMode.fFill) return getPropXA(m, 'fFillColor')
                        if (formatMode === FormatMode.line) return getPropXA(m, 'lineColor')
                      })() ? '#9040b8' : 'none'}
                      strokeWidth={"2%"}
                      onClick={() => {
                        const color = colorList[i][j]
                        formatMode === FormatMode.text && dispatch(actions.mapAction({type: 'setTextColor', payload: color}))
                        formatMode === FormatMode.sBorder && dispatch(actions.mapAction({type: 'setSBorderColor', payload: color}))
                        formatMode === FormatMode.fBorder && isXR(m) && dispatch(actions.mapAction({type: 'setFBorderColor', payload: color}))
                        formatMode === FormatMode.fBorder && isXS(m) && dispatch(actions.mapAction({type: 'setFBorderColor', payload: color}))
                        formatMode === FormatMode.sFill && dispatch(actions.mapAction({type: 'setSFillColor', payload: color}))
                        formatMode === FormatMode.fFill && dispatch(actions.mapAction({type: 'setFFillColor', payload: color}))
                        formatMode === FormatMode.line && dispatch(actions.mapAction({type: 'setSLineColor', payload: color}))
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
        {formatMode === FormatMode.text &&
          <ButtonGroup className="targeted-button-group" disabled={disabled} variant="text" color="primary">
            {getKeys(TextTypes).map((name, idx) =>
              <Button key={idx} style={{backgroundColor: name === TextTypes[getPropXA(m, 'textFontSize') as number || 0] ? 'var(--button-color)' : ''}} onClick={() => {
                dispatch(actions.mapAction({type: 'setTextFontSize', payload: TextTypes[name as keyof typeof TextTypes]}))
              }}>{name}
              </Button>
            )}
          </ButtonGroup>
        }
        {formatMode === FormatMode.sBorder &&
          <ButtonGroup className="targeted-button-group" disabled={disabled} variant="text" color="primary">
            {getKeys(WidthTypes).map((name, idx) =>
              <Button key={idx} style={{backgroundColor: name === WidthTypes[xn.selection === 's' ? getPropXA(m, 'sBorderWidth') as number || 0 : getPropXA(m, 'fBorderWidth') as number || 0] ? 'var(--button-color)' : ''}} onClick={() => {
                dispatch(actions.mapAction({type: 'setSBorderWidth', payload: WidthTypes[name as keyof typeof WidthTypes]}))
              }}>{name}
              </Button>
            )}
          </ButtonGroup>
        }
        {formatMode === FormatMode.fBorder &&
          <ButtonGroup className="targeted-button-group" disabled={disabled} variant="text" color="primary">
            {getKeys(WidthTypes).map((name, idx) =>
              <Button key={idx} style={{backgroundColor: name === WidthTypes[xn.selection === 's' ? getPropXA(m, 'sBorderWidth') as number || 0 : getPropXA(m, 'fBorderWidth') as number || 0] ? 'var(--button-color)' : ''}} onClick={() => {
                dispatch(actions.mapAction({type: 'setFBorderWidth', payload: WidthTypes[name as keyof typeof WidthTypes]}))
              }}>{name}
              </Button>
            )}
          </ButtonGroup>
        }
        {formatMode === FormatMode.line && <>
          <ButtonGroup className="targeted-button-group" disabled={disabled} variant="text" color="primary">
            {getKeys(WidthTypes).map((name, idx) =>
              <Button key={idx} style={{backgroundColor: name === WidthTypes[getPropXA(m, 'lineWidth') as number || 0] ? 'var(--button-color)' : ''}} onClick={() => {
                dispatch(actions.mapAction({type: 'setLineWidth', payload: WidthTypes[name as keyof typeof WidthTypes]}))
              }}>{name}
              </Button>
            )}
          </ButtonGroup>
          <ButtonGroup className="targeted-button-group" disabled={disabled} variant="text" color="primary">
            {getKeys(LineTypes).map((name, idx) =>
              <Button key={idx} style={{backgroundColor: name === LineTypes[getPropXA(m, 'lineType') as number || 0] ? 'var(--button-color)' : ''}} onClick={() => {
                dispatch(actions.mapAction({type: 'setLineType', payload: LineTypes[name as keyof typeof LineTypes]}))
              }}>{name}
              </Button>
            )}
          </ButtonGroup>
        </>
        }
      </div>
      <div className="flex flex-row justify-center">
        <Button color="primary" variant='outlined' onClick={() => {
          formatMode === FormatMode.text && dispatch(actions.mapAction({type: 'clearText', payload: null}))
          formatMode === FormatMode.sBorder && dispatch(actions.mapAction({type: 'clearSBorder', payload: null}))
          formatMode === FormatMode.fBorder && dispatch(actions.mapAction({type: 'clearFBorder', payload: null}))
          formatMode === FormatMode.sFill && dispatch(actions.mapAction({type: 'clearSFill', payload: null}))
          formatMode === FormatMode.fFill && dispatch(actions.mapAction({type: 'clearFFill', payload: null}))
          formatMode === FormatMode.line && dispatch(actions.mapAction({type: 'clearLine', payload: null}))
        }}>
          {'RESET'}
        </Button>
      </div>
      <div className="flex flex-row justify-center">
        <Button color="primary" variant='outlined' onClick={() => dispatch(actions.closeFormatter())}>{'CLOSE'}</Button>
      </div>
    </div>
  )
}
