import {Box, Button, Flex, IconButton, Select} from "@radix-ui/themes"
import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import colors from "tailwindcss/colors"
import {actions, AppDispatch, RootState} from '../../reducers/EditorReducer'
import {MR} from "../../reducers/MapReducerEnum.ts"
import {getFBorderColor, getFBorderWidth, getFFillColor, getLineColor, getLineType, getLineWidth, getSBorderColor, getSBorderWidth, getSFillColor, getTextColor, getTextFontSize, isXAR, isXAS} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {AccessType, FormatMode, LineType, TextType, WidthType} from "../../state/Enums"
import {FBorderIcon, FFillIcon, SFillIcon, SBorderIcon} from "../../assetsCustom/CustomIcons.tsx"
import LetterT from "../../assets/letter-t.svg?react"
import VectorSpline from "../../assets/vector-spline.svg?react"
import {useOpenWorkspaceQuery} from "../../api/Api.ts";
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState.ts"

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
  const { data } = useOpenWorkspaceQuery()
  const { access } = data || defaultUseOpenWorkspaceQueryState
  const disabled = [AccessType.UNAUTHORIZED, AccessType.VIEW].includes(access)
  const dispatch = useDispatch<AppDispatch>()
  const md = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))
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
            <LetterT/>
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
            <VectorSpline/>
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
                        formatMode === FormatMode.text && md(MR.setTextColor, color)
                        formatMode === FormatMode.sBorder && md(MR.setSBorderColor, color)
                        formatMode === FormatMode.fBorder && isXAR(m) && md(MR.setFBorderColor, color)
                        formatMode === FormatMode.fBorder && isXAS(m) && md(MR.setFBorderColor, color)
                        formatMode === FormatMode.sFill && md(MR.setSFillColor, color)
                        formatMode === FormatMode.fFill && md(MR.setFFillColor, color)
                        formatMode === FormatMode.line && md(MR.setLineColor, color)
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
            value={TextType[getTextFontSize(m)]}
            onValueChange={(value) => md(MR.setTextFontSize, TextType[value as keyof typeof TextType])}
          >
            <Select.Trigger />
            <Select.Content>
              {getKeys(TextType).map((el, index) => (
                <Select.Item key={index} value={el.toString()}>{el}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        }
        {formatMode === FormatMode.sBorder &&
          <Select.Root
            disabled={disabled}
            value={WidthType[getSBorderWidth(m)]}
            onValueChange={(value) => md(MR.setSBorderWidth, WidthType[value as keyof typeof WidthType])}
          >
            <Select.Trigger />
            <Select.Content>
              {getKeys(WidthType).map((el, index) => (
                <Select.Item key={index} value={el.toString()}>{el}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        }
        {formatMode === FormatMode.fBorder &&
          <Select.Root
            disabled={disabled}
            value={WidthType[getFBorderWidth(m)]}
            onValueChange={(value) => md(MR.setFBorderWidth, WidthType[value as keyof typeof WidthType])}
          >
            <Select.Trigger />
            <Select.Content>
              {getKeys(WidthType).map((el, index) => (
                <Select.Item key={index} value={el.toString()}>{el}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        }
        {formatMode === FormatMode.line &&
          <Select.Root
            disabled={disabled}
            value={WidthType[getLineWidth(m)]}
            onValueChange={(value) => md(MR.setLineWidth, WidthType[value as keyof typeof WidthType])}
          >
            <Select.Trigger />
            <Select.Content>
              {getKeys(WidthType).map((el, index) => (
                <Select.Item key={index} value={el.toString()}>{el}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        }
        {formatMode === FormatMode.line &&
          <Select.Root
            disabled={disabled}
            value={LineType[getLineType(m)]}
            onValueChange={(value) => md(MR.setLineType, LineType[value as keyof typeof LineType])}
          >
            <Select.Trigger />
            <Select.Content>
              {getKeys(LineType).map((el, index) => (
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
            formatMode === FormatMode.text && md(MR.clearText)
            formatMode === FormatMode.sBorder && md(MR.clearSBorder)
            formatMode === FormatMode.fBorder && md(MR.clearFBorder)
            formatMode === FormatMode.sFill && md(MR.clearSFill)
            formatMode === FormatMode.fFill && md(MR.clearFFill)
            formatMode === FormatMode.line && md(MR.clearLine)
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
