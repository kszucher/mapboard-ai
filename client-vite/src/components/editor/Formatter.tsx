import {Box, Button, Flex, IconButton, Select} from "@radix-ui/themes"
import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import colors from "tailwindcss/colors"
import {actions, AppDispatch, RootState} from '../../reducers/EditorReducer'
import {getFBorderColor, getFBorderWidth, getFFillColor, getLineColor, getLineType, getLineWidth, getSBorderColor, getSBorderWidth, getSFillColor, getTextColor, getTextFontSize, isXR, isXS} from "../../selectors/MapSelector"
import {mSelector} from "../../state/EditorState"
import {AccessTypes, FormatMode, LineTypes, TextTypes, WidthTypes} from "../../state/Enums"
import {FBorderIcon, FFillIcon, LetterTIcon, SFillIcon, SBorderIcon, VectorSplineIcon} from "../assets/Icons"

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
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div className="dark:bg-zinc-800 bg-zinc-50 border-r-0 border-2 dark:border-neutral-700 fixed w-[240px] top-[80px] right-0 flex flex-col gap-3 rounded-l-lg p-3 z-50">
      <Flex gap="3" align="center" justify="center">
        <Box p={formatMode === FormatMode.sFill ? "0" : "1"}>
          <IconButton variant={formatMode === FormatMode.sFill ? "solid" : "ghost"} onClick={() => dispatch(actions.setFormatMode(FormatMode.sFill))}>
            <SFillIcon/>
          </IconButton>
        </Box>
        <Box p={formatMode === FormatMode.fFill ? "0" : "1"}>
          <IconButton variant={formatMode === FormatMode.fFill ? "solid" : "ghost"} onClick={() => dispatch(actions.setFormatMode(FormatMode.fFill))}>
            <FFillIcon/>
          </IconButton>
        </Box>
        <Box p={formatMode === FormatMode.text ? "0" : "1"}>
          <IconButton variant={formatMode === FormatMode.text ? "solid" : "ghost"} onClick={() => dispatch(actions.setFormatMode(FormatMode.text))}>
            <LetterTIcon/>
          </IconButton>
        </Box>
      </Flex>
      <Flex gap="3" align="center" justify="center">
        <Box p={formatMode === FormatMode.sBorder ? "0" : "1"}>
          <IconButton variant={formatMode === FormatMode.sBorder ? "solid" : "ghost"} onClick={() => dispatch(actions.setFormatMode(FormatMode.sBorder))}>
            <SBorderIcon/>
          </IconButton>
        </Box>
        <Box p={formatMode === FormatMode.fBorder ? "0" : "1"}>
          <IconButton variant={formatMode === FormatMode.fBorder ? "solid" : "ghost"} onClick={() => dispatch(actions.setFormatMode(FormatMode.fBorder))}>
            <FBorderIcon/>
          </IconButton>
        </Box>
        <Box p={formatMode === FormatMode.line ? "0" : "1"}>
          <IconButton variant={formatMode === FormatMode.line ? "solid" : "ghost"} onClick={() => dispatch(actions.setFormatMode(FormatMode.line))}>
            <VectorSplineIcon/>
          </IconButton>
        </Box>
      </Flex>
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
          <Select.Root
            disabled={disabled}
            value={TextTypes[getTextFontSize(m)]}
            onValueChange={(value) => dispatch(actions.mapAction({type: 'setTextFontSize', payload: TextTypes[value as keyof typeof TextTypes]}))}>
            <Select.Trigger />
            <Select.Content>
              {getKeys(TextTypes).map((el, index) => (
                <Select.Item key={index} value={el.toString()}>{el}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        }
        {formatMode === FormatMode.sBorder &&
          <Select.Root
            disabled={disabled}
            value={WidthTypes[getSBorderWidth(m)]}
            onValueChange={(value) => dispatch(actions.mapAction({type: 'setSBorderWidth', payload: WidthTypes[value as keyof typeof WidthTypes]}))}>
            <Select.Trigger />
            <Select.Content>
              {getKeys(WidthTypes).map((el, index) => (
                <Select.Item key={index} value={el.toString()}>{el}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        }
        {formatMode === FormatMode.fBorder &&
          <Select.Root
            disabled={disabled}
            value={WidthTypes[getFBorderWidth(m)]}
            onValueChange={(value) => dispatch(actions.mapAction({type: 'setFBorderWidth', payload: WidthTypes[value as keyof typeof WidthTypes]}))}>
            <Select.Trigger />
            <Select.Content>
              {getKeys(WidthTypes).map((el, index) => (
                <Select.Item key={index} value={el.toString()}>{el}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        }
        {formatMode === FormatMode.line &&
          <Select.Root
            disabled={disabled}
            value={WidthTypes[getLineWidth(m)]}
            onValueChange={(value) => dispatch(actions.mapAction({type: 'setLineWidth', payload: WidthTypes[value as keyof typeof WidthTypes]}))}>
            <Select.Trigger />
            <Select.Content>
              {getKeys(WidthTypes).map((el, index) => (
                <Select.Item key={index} value={el.toString()}>{el}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        }
        {formatMode === FormatMode.line &&
          <Select.Root
            disabled={disabled}
            value={LineTypes[getLineType(m)]}
            onValueChange={(value) => dispatch(actions.mapAction({type: 'setLineType', payload: LineTypes[value as keyof typeof LineTypes]}))}>
            <Select.Trigger />
            <Select.Content>
              {getKeys(LineTypes).map((el, index) => (
                <Select.Item key={index} value={el.toString()}>{el}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        }
      </div>
      <div className="flex flex-row justify-center">
        <Button
          variant="outline"
          onClick={() => {
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
        <Button variant="solid" color="gray" onClick={() => dispatch(actions.closeFormatter())}>{'CLOSE'}</Button>
      </div>
    </div>
  )
}
