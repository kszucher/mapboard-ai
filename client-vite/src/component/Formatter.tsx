import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Button, ButtonGroup, IconButton} from '@mui/material'
import {mapActionResolver} from "../core/MapActionResolver"
import {mSelector} from "../state/EditorState"
import {BorderIcon, FillIcon, LineIcon, TextIcon} from './MuiSvgIcons'
import {colorList} from './Colors'
import {actions, AppDispatch, RootState} from '../core/EditorReducer'
import {AccessTypes, FormatMode, LineTypes, TextTypes, WidthTypes} from "../state/Enums"
import {getPropXA, getX} from "../core/MapUtils"

const getKeys = (type: object) => Object.keys(type).filter(nx => !(parseInt(nx) >= 0))

export const Formatter: FC = () => {
  const o = 32
  const r = 12
  const width =  o * colorList[0].length
  const height = o * colorList.length
  const formatMode = useSelector((state: RootState) => state.editor.formatMode)
  const m = useSelector((state:RootState) => mSelector(state))
  const nx = getX(m)
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
        }}><BorderIcon selection={nx.selection}/>
        </IconButton>
        <IconButton color='secondary' aria-label="fill" onClick={() => {
          dispatch(actions.setFormatMode(FormatMode.fill))
        }}><FillIcon selection={nx.selection}/>
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
                        if (formatMode === FormatMode.border) return nx.selection === 's' ? getPropXA(m, 'sBorderColor') : getPropXA(m, 'fBorderColor')
                        if (formatMode === FormatMode.fill) return nx.selection === 's' ? getPropXA(m, 'sFillColor') : getPropXA(m, 'fFillColor')
                        if (formatMode === FormatMode.line) return getPropXA(m, 'lineColor')
                      })() ? '#9040b8' : 'none'}
                      strokeWidth={"2%"}
                      onClick={() => {
                        const color = colorList[i][j]
                        if (formatMode === FormatMode.text) {
                          dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'setTextColor', color)))
                        } else if (formatMode === FormatMode.border) {
                          dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'setBorderColor', color)))
                        } else if (formatMode === FormatMode.fill) {
                          dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'setFillColor', color)))
                        } else if (formatMode === FormatMode.line) {
                          dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'setLineColor', color)))
                        }
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
              <Button key={idx} style={{backgroundColor: name === TextTypes[getPropXA(m, 'textFontSize') as number || 0] ? 'var(--button-color)' : ''}} onClick={() =>
                dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'setTextFontSize', TextTypes[name as keyof typeof TextTypes])))
              }>{name}
              </Button>
            )}
          </ButtonGroup>
        }
        {formatMode === FormatMode.border &&
          <ButtonGroup className="targeted-button-group" disabled={disabled} variant="text" color="primary">
            {getKeys(WidthTypes).map((name, idx) =>
              <Button key={idx} style={{backgroundColor: name === WidthTypes[nx.selection === 's' ? getPropXA(m, 'sBorderWidth') as number || 0 : getPropXA(m, 'fBorderWidth') as number || 0] ? 'var(--button-color)' : ''}} onClick={() =>
                dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'setBorderWidth', WidthTypes[name as keyof typeof WidthTypes])))
              }>{name}
              </Button>
            )}
          </ButtonGroup>
        }
        {formatMode === FormatMode.line && <>
          <ButtonGroup className="targeted-button-group" disabled={disabled} variant="text" color="primary">
            {getKeys(WidthTypes).map((name, idx) =>
              <Button key={idx} style={{backgroundColor: name === WidthTypes[getPropXA(m, 'lineWidth') as number || 0] ? 'var(--button-color)' : ''}} onClick={() =>
                dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'setLineWidth', WidthTypes[name as keyof typeof WidthTypes])))
              }>{name}
              </Button>
            )}
          </ButtonGroup>

          <ButtonGroup className="targeted-button-group" disabled={disabled} variant="text" color="primary">
            {getKeys(LineTypes).map((name, idx) =>
              <Button key={idx} style={{backgroundColor: name === LineTypes[getPropXA(m, 'lineType') as number || 0] ? 'var(--button-color)' : ''}} onClick={() =>
                dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'setLineType', LineTypes[name as keyof typeof LineTypes])))
              }>{name}
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
            if (formatMode === FormatMode.text)
              dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'clearText', null)))
            else if (formatMode === FormatMode.border)
              dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'clearBorder', null)))
            else if (formatMode === FormatMode.fill)
              dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'clearFill', null)))
            else if (formatMode === FormatMode.line)
              dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'clearLine', null)))
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
