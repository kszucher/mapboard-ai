import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Button, ButtonGroup, IconButton} from '@mui/material'
import {mSelector} from "../state/EditorState"
import {BorderIcon, FillIcon, LineIcon, TextIcon} from './MuiSvgIcons'
import {colorList} from './Colors'
import {actions, AppDispatch, RootState} from '../core/EditorReducer'
import {AccessTypes, FormatMode, LineTypes, TextTypes, WidthTypes} from "../state/Enums"
import {getPropXA, getX} from "../core/MapUtils"

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
    <div className="_bg fixed w-[216px] top-[80px] right-[47px] flex flex-col gap-3 rounded-lg p-3 z-50">
      <div className="flex justify-center">
        <IconButton color='secondary' aria-label="text" onClick={() => {
          dispatch(actions.setFormatMode(FormatMode.text))
        }}><TextIcon/>
        </IconButton>
        <IconButton color='secondary' aria-label="border" onClick={() => {
          dispatch(actions.setFormatMode(FormatMode.border))
        }}><BorderIcon selection={xn.selection}/>
        </IconButton>
        <IconButton color='secondary' aria-label="fill" onClick={() => {
          dispatch(actions.setFormatMode(FormatMode.fill))
        }}><FillIcon selection={xn.selection}/>
        </IconButton>
        <IconButton color='secondary' aria-label="line" onClick={() => {
          dispatch(actions.setFormatMode(FormatMode.line))
        }}><LineIcon/>
        </IconButton>
        <span className="fixed top-[82px] w-[40px] h-[2px] bg-[color:var(--main-color)]" style={{right: 196 - 40* formatMode}}/>
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
                        if (formatMode === FormatMode.border && xn.selection === 's') return getPropXA(m, 'sBorderColor')
                        if (formatMode === FormatMode.border && xn.selection === 'f') return getPropXA(m, 'fBorderColor')
                        if (formatMode === FormatMode.fill && xn.selection === 's') return getPropXA(m, 'sFillColor')
                        if (formatMode === FormatMode.fill && xn.selection === 'f') return getPropXA(m, 'fFillColor')
                        if (formatMode === FormatMode.line) return getPropXA(m, 'lineColor')
                      })() ? '#9040b8' : 'none'}
                      strokeWidth={"2%"}
                      onClick={() => {
                        const color = colorList[i][j]
                        formatMode === FormatMode.text && xn.selection === 's' && dispatch(actions.mapAction({type: 'setTextColorS', payload: color}))
                        formatMode === FormatMode.text && xn.selection === 'f' && dispatch(actions.mapAction({type: 'setTextColorF', payload: color}))
                        formatMode === FormatMode.border && xn.selection === 's' && dispatch(actions.mapAction({type: 'setBorderColorS', payload: color}))
                        formatMode === FormatMode.border && xn.selection === 'f' && dispatch(actions.mapAction({type: 'setBorderColorF', payload: color}))
                        formatMode === FormatMode.fill && xn.selection === 's' && dispatch(actions.mapAction({type: 'setFillColorS', payload: color}))
                        formatMode === FormatMode.fill && xn.selection === 'f' && dispatch(actions.mapAction({type: 'setFillColorF', payload: color}))
                        formatMode === FormatMode.line && xn.selection === 's' && dispatch(actions.mapAction({type: 'setLineColorS', payload: color}))
                        formatMode === FormatMode.line && xn.selection === 'f' && dispatch(actions.mapAction({type: 'setLineColorF', payload: color}))
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
                xn.selection === 's' && dispatch(actions.mapAction({type: 'setTextFontSizeS', payload: TextTypes[name as keyof typeof TextTypes]}))
                xn.selection === 'f' && dispatch(actions.mapAction({type: 'setTextFontSizeF', payload: TextTypes[name as keyof typeof TextTypes]}))
              }}>{name}
              </Button>
            )}
          </ButtonGroup>
        }
        {formatMode === FormatMode.border &&
          <ButtonGroup className="targeted-button-group" disabled={disabled} variant="text" color="primary">
            {getKeys(WidthTypes).map((name, idx) =>
              <Button key={idx} style={{backgroundColor: name === WidthTypes[xn.selection === 's' ? getPropXA(m, 'sBorderWidth') as number || 0 : getPropXA(m, 'fBorderWidth') as number || 0] ? 'var(--button-color)' : ''}} onClick={() => {
                xn.selection === 's' && dispatch(actions.mapAction({type: 'setBorderWidthS', payload: WidthTypes[name as keyof typeof WidthTypes]}))
                xn.selection === 'f' && dispatch(actions.mapAction({type: 'setBorderWidthF', payload: WidthTypes[name as keyof typeof WidthTypes]}))
              }}>{name}
              </Button>
            )}
          </ButtonGroup>
        }
        {formatMode === FormatMode.line && <>
          <ButtonGroup className="targeted-button-group" disabled={disabled} variant="text" color="primary">
            {getKeys(WidthTypes).map((name, idx) =>
              <Button key={idx} style={{backgroundColor: name === WidthTypes[getPropXA(m, 'lineWidth') as number || 0] ? 'var(--button-color)' : ''}} onClick={() => {
                xn.selection === 's' && dispatch(actions.mapAction({type: 'setLineWidthS', payload: WidthTypes[name as keyof typeof WidthTypes]}))
                xn.selection === 'f' && dispatch(actions.mapAction({type: 'setLineWidthF', payload: WidthTypes[name as keyof typeof WidthTypes]}))
              }}>{name}
              </Button>
            )}
          </ButtonGroup>

          <ButtonGroup className="targeted-button-group" disabled={disabled} variant="text" color="primary">
            {getKeys(LineTypes).map((name, idx) =>
              <Button key={idx} style={{backgroundColor: name === LineTypes[getPropXA(m, 'lineType') as number || 0] ? 'var(--button-color)' : ''}} onClick={() => {
                xn.selection === 's' && dispatch(actions.mapAction({type: 'setLineTypeS', payload: LineTypes[name as keyof typeof LineTypes]}))
                xn.selection === 'f' && dispatch(actions.mapAction({type: 'setLineTypeF', payload: LineTypes[name as keyof typeof LineTypes]}))
              }}>{name}
              </Button>
            )}
          </ButtonGroup>
        </>
        }
      </div>
      <div className="flex flex-row justify-center">
        <Button
          color="primary"
          variant='outlined'
          onClick={() => {
            formatMode === FormatMode.text && getX(m).selection === 's' && dispatch(actions.mapAction({type: 'clearTextS', payload: null}))
            formatMode === FormatMode.text && getX(m).selection === 'f' && dispatch(actions.mapAction({type: 'clearTextF', payload: null}))
            formatMode === FormatMode.border && getX(m).selection === 's' && dispatch(actions.mapAction({type: 'clearBorderS', payload: null}))
            formatMode === FormatMode.border && getX(m).selection === 'f' && dispatch(actions.mapAction({type: 'clearBorderF', payload: null}))
            formatMode === FormatMode.fill &&  getX(m).selection === 's' && dispatch(actions.mapAction({type: 'clearFillS', payload: null}))
            formatMode === FormatMode.fill &&  getX(m).selection === 'f' && dispatch(actions.mapAction({type: 'clearFillF', payload: null}))
            formatMode === FormatMode.line &&  getX(m).selection === 's' && dispatch(actions.mapAction({type: 'clearLineS', payload: null}))
            formatMode === FormatMode.line &&  getX(m).selection === 'f' && dispatch(actions.mapAction({type: 'clearLineF', payload: null}))
          }}>
          {'RESET'}
        </Button>
      </div>
      <div className="flex flex-row justify-center">
        <Button
          color="primary"
          variant='outlined'
          onClick={() => dispatch(actions.toggleFormatterVisible())}
        >{'CLOSE'}
        </Button>
      </div>
    </div>
  )
}
