import React, {FC, ReactNode} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Button, ButtonGroup} from '@mui/material'
import colors from "tailwindcss/colors"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {mSelector} from "../../state/EditorState"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {actions, AppDispatch, RootState} from '../../reducers/EditorReducer'
import {AccessTypes, FormatMode, LineTypes, TextTypes, WidthTypes} from "../../state/Enums"
import {getFBorderColor, getFBorderWidth, getFFillColor, getLineColor, getLineType, getLineWidth, getSBorderColor, getSBorderWidth, getSFillColor, getTextColor, getTextFontSize, getX, isXR, isXS} from "../../selectors/MapSelector"

const TextIcon = () => (
  <g>
    <path stroke="none" fill="none" d="M0 0h24v24H0z"></path>
    <path d="M6 4h12M12 4v16"></path>
  </g>
)

const VectorSplineIcon = () => (
  <g>
    <path stroke="none" fill="none" d="M0 0h24v24H0z"></path>
    <path fill="none" d="M17 4a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1zM3 18a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1zM17 5C10.373 5 5 10.373 5 17"></path>
  </g>
)

const SFillIcon = () => (
  <g>
    <path fill="currentColor" d="M6 7.2h12c2.4 0 3.6 1.2 3.6 3.6v2.4c0 2.4-1.2 3.6-3.6 3.6H6c-2.4 0-3.6-1.2-3.6-3.6v-2.4c0-2.4 1.2-3.6 3.6-3.6z"></path>
  </g>
)

const SBorderIcon = () => (
  <g>
    <path fill="none" d="M6 7.2h12c2.4 0 3.6 1.2 3.6 3.6v2.4c0 2.4-1.2 3.6-3.6 3.6H6c-2.4 0-3.6-1.2-3.6-3.6v-2.4c0-2.4 1.2-3.6 3.6-3.6z"></path>
  </g>
)

const FFillIcon = () => (
  <g>
    <path fill="currentColor" d="M15.6 3.6H18c2.4 0 3.6 1.2 3.6 3.6v9.6c0 2.4-1.2 3.6-3.6 3.6h-2.4c-2.4 0-9.6-4.8-12-4.8-2.4 0-2.4-7.2 0-7.2s9.6-4.8 12-4.8z"></path>
  </g>
)

const FBorderIcon = () => (
  <g>
    <path fill="none" d="M15.6 3.6H18c2.4 0 3.6 1.2 3.6 3.6v9.6c0 2.4-1.2 3.6-3.6 3.6h-2.4c-2.4 0-9.6-4.8-12-4.8-2.4 0-2.4-7.2 0-7.2s9.6-4.8 12-4.8z"></path>
  </g>
)

const IconButton = ({colorMode, disabled, selected = false, onClick, children} : {colorMode: string, disabled: boolean, selected?:boolean, onClick: Function, children: ReactNode}) => (
  <button
    type="button"
    className="text-white focus:outline-none font-medium rounded-full text-sm p-2 text-center inline-flex items-center dark:hover:bg-gray-700"
    disabled={disabled}
    onClick={() => onClick()}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      stroke={colorMode === 'dark' ? (selected? colors.purple[600] : "#ffffff") : '#000000'}
      color={colorMode === 'dark' ? (selected? colors.purple[600] : "#ffffff") : '#000000'}
      fill={'none'}
      opacity={disabled ? '25%' : '100%'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24">
      ({children})
    </svg>
    <span className="sr-only">Icon description</span>
  </button>
)

const getKeys = (type: object) => Object.keys(type).filter(xn => !(parseInt(xn) >= 0))

export const Formatter: FC = () => {
  const o = 32
  const r = 12
  const {gray, neutral, red, amber, lime, emerald, cyan, blue, violet, fuchsia, rose} = colors
  const colorList = [gray, neutral, red, amber, lime, emerald, cyan, blue, violet, fuchsia, rose].map(c => [50, 200, 400, 700, 800, 950].map(index => c[index.toString() as keyof typeof c]))
  const width = o * colorList[0].length
  const height = o * colorList.length
  const formatMode = useSelector((state: RootState) => state.editor.formatMode)
  const m = useSelector((state:RootState) => mSelector(state))
  const access = useSelector((state: RootState) => state.editor.access)
  const disabled = [AccessTypes.UNAUTHORIZED, AccessTypes.VIEW].includes(access)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div className="dark:bg-zinc-800 bg-zinc-50 border-r-0 border-2 dark:border-neutral-700 fixed w-[224px] top-[80px] right-0 flex flex-col gap-3 rounded-l-lg p-3 z-50">
      <div className="flex justify-center">
        <IconButton colorMode={colorMode} disabled={disabled} selected={formatMode == FormatMode.sFill} onClick={() => {dispatch(actions.setFormatMode(FormatMode.sFill))}}><SFillIcon/></IconButton>
        <IconButton colorMode={colorMode} disabled={disabled} selected={formatMode == FormatMode.fFill} onClick={() => {dispatch(actions.setFormatMode(FormatMode.fFill))}}><FFillIcon/></IconButton>
        <IconButton colorMode={colorMode} disabled={disabled} selected={formatMode == FormatMode.text} onClick={() => {dispatch(actions.setFormatMode(FormatMode.text))}}><TextIcon/></IconButton>
      </div>
      <div className="flex justify-center">
        <IconButton colorMode={colorMode} disabled={disabled} selected={formatMode == FormatMode.sBorder} onClick={() => {dispatch(actions.setFormatMode(FormatMode.sBorder))}}><SBorderIcon/></IconButton>
        <IconButton colorMode={colorMode} disabled={disabled} selected={formatMode == FormatMode.fBorder} onClick={() => {dispatch(actions.setFormatMode(FormatMode.fBorder))}}><FBorderIcon/></IconButton>
        <IconButton colorMode={colorMode} disabled={disabled} selected={formatMode == FormatMode.line} onClick={() => {dispatch(actions.setFormatMode(FormatMode.line))}}><VectorSplineIcon/></IconButton>
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
                        if (formatMode === FormatMode.text) return getTextColor(m)
                        if (formatMode === FormatMode.sBorder) return getSBorderColor(m)
                        if (formatMode === FormatMode.fBorder) return getFBorderColor(m)
                        if (formatMode === FormatMode.sFill) return getSFillColor(m)
                        if (formatMode === FormatMode.fFill) return getFFillColor(m)
                        if (formatMode === FormatMode.line) return getLineColor(m)
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
                        formatMode === FormatMode.line && dispatch(actions.mapAction({type: 'setLineColor', payload: color}))
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
              <Button key={idx} style={{backgroundColor: name === TextTypes[getTextFontSize(m)] ? 'var(--button-color)' : ''}} onClick={() => {
                dispatch(actions.mapAction({type: 'setTextFontSize', payload: TextTypes[name as keyof typeof TextTypes]}))
              }}>{name}
              </Button>
            )}
          </ButtonGroup>
        }
        {formatMode === FormatMode.sBorder &&
          <ButtonGroup className="targeted-button-group" disabled={disabled} variant="text" color="primary">
            {getKeys(WidthTypes).map((name, idx) =>
              <Button key={idx} style={{backgroundColor: name === WidthTypes[getX(m).selection === 's' ? getSBorderWidth(m) : getFBorderWidth(m)] ? 'var(--button-color)' : ''}} onClick={() => {
                dispatch(actions.mapAction({type: 'setSBorderWidth', payload: WidthTypes[name as keyof typeof WidthTypes]}))
              }}>{name}
              </Button>
            )}
          </ButtonGroup>
        }
        {formatMode === FormatMode.fBorder &&
          <ButtonGroup className="targeted-button-group" disabled={disabled} variant="text" color="primary">
            {getKeys(WidthTypes).map((name, idx) =>
              <Button key={idx} style={{backgroundColor: name === WidthTypes[getX(m).selection === 's' ? getSBorderWidth(m) : getFBorderWidth(m)] ? 'var(--button-color)' : ''}} onClick={() => {
                dispatch(actions.mapAction({type: 'setFBorderWidth', payload: WidthTypes[name as keyof typeof WidthTypes]}))
              }}>{name}
              </Button>
            )}
          </ButtonGroup>
        }
        {formatMode === FormatMode.line && <>
          <ButtonGroup className="targeted-button-group" disabled={disabled} variant="text" color="primary">
            {getKeys(WidthTypes).map((name, idx) =>
              <Button key={idx} style={{backgroundColor: name === WidthTypes[getLineWidth(m)] ? 'var(--button-color)' : ''}} onClick={() => {
                dispatch(actions.mapAction({type: 'setLineWidth', payload: WidthTypes[name as keyof typeof WidthTypes]}))
              }}>{name}
              </Button>
            )}
          </ButtonGroup>
          <ButtonGroup className="targeted-button-group" disabled={disabled} variant="text" color="primary">
            {getKeys(LineTypes).map((name, idx) =>
              <Button key={idx} style={{backgroundColor: name === LineTypes[getLineType(m)] ? 'var(--button-color)' : ''}} onClick={() => {
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
