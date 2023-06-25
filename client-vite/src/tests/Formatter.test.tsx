import {render, screen,} from "@testing-library/react"
import user from "@testing-library/user-event"
import {Provider} from "react-redux"
import {Formatter} from "../component/Formatter"
import { describe, it } from 'vitest'
import {actions, store} from "../core/EditorReducer"
import {colorList} from "../component/Colors"
import {FormatMode, LineTypes, AccessTypes, TextTypes, WidthTypes} from "../state/Enums"
import {getMap} from "../state/EditorState"
import {nSaveOptional} from "../state/MapProps"

describe("Formatter test", () => {
  // beforeEach(() => {
  //   const testMap = mapAssembly([
  //     {path: ['g'], density: 'small'},
  //     {path: ['r', 0], content: 'Features'},
  //     {path: ['r', 0, 'd', 0]},
  //     {path: ['r', 0, 'd', 0, 's', 0], content: 'Texts', selected: 1},
  //     {path: ['r', 0, 'd', 1]},
  //   ])
  //   // TODO use the latest appropriate action from EditorFlow
  //   // store.dispatch(actions.parseRespPayload({
  //   //   formatMode: FormatMode.text,
  //   //   access: AccessTypes.EDIT,
  //   //   mapListIndex: 0,
  //   //   mapList: [reCalc(testMap, testMap)],
  //   // }))
  //   const {} = render(
  //     <Provider store={store}>
  //       <Formatter/>
  //     </Provider>,
  //   )
  // })
  // test('set', async () => {
  //   await user.click(screen.getByRole('button', {name: 'text'}))
  //   await user.click(screen.getByLabelText(colorList[0][1]))
  //   await user.click(screen.getByRole('button', {name: 'h2'}))
  //   await user.click(screen.getByRole('button', {name: 'border'}))
  //   await user.click(screen.getByLabelText(colorList[0][1]))
  //   await user.click(screen.getByRole('button', {name: 'w2'}))
  //   await user.click(screen.getByRole('button', {name: 'fill'}))
  //   await user.click(screen.getByLabelText(colorList[0][1]))
  //   await user.click(screen.getByRole('button', {name: 'line'}))
  //   await user.click(screen.getByLabelText(colorList[0][1]))
  //   await user.click(screen.getByRole('button', {name: 'w2'}))
  //   await user.click(screen.getByRole('button', {name: 'edge'}))
  //
  //   const ml = getMap()
  //   const m = mapAssembly(ml) as M
  //   const { nc } = m.g
  //   expect(nc).toEqual({
  //     selection: nSaveOptional.selection,
  //     lineWidth: WidthTypes.w2,
  //     lineType: LineTypes.edge,
  //     lineColor: colorList[0][1],
  //     borderWidth: WidthTypes.w2,
  //     borderColor: colorList[0][1],
  //     fillColor: colorList[0][1],
  //     textFontSize: TextTypes.h2,
  //     textColor: colorList[0][1],
  //     taskStatus: nSaveOptional.taskStatus,
  //   })
  // })
  // test('reset', async () => {
  //   await user.click(screen.getByRole('button', {name: 'text'}))
  //   await user.click(screen.getByRole('button', {name: 'RESET'}))
  //   await user.click(screen.getByRole('button', {name: 'border'}))
  //   await user.click(screen.getByRole('button', {name: 'RESET'}))
  //   await user.click(screen.getByRole('button', {name: 'fill'}))
  //   await user.click(screen.getByRole('button', {name: 'RESET'}))
  //   await user.click(screen.getByRole('button', {name: 'line'}))
  //   await user.click(screen.getByRole('button', {name: 'edge'}))
  //   await user.click(screen.getByRole('button', {name: 'RESET'}))
  //
  //   const m = getMap()
  //   const { nc } = m.g
  //   expect(nc).toEqual({
  //     selection: nSaveOptional.selection,
  //     lineWidth: nSaveOptional.lineWidth,
  //     lineType: nSaveOptional.lineType,
  //     lineColor: nSaveOptional.lineColor,
  //     borderWidth: nSaveOptional.sBorderWidth,
  //     borderColor: nSaveOptional.sBorderColor,
  //     fillColor: nSaveOptional.sFillColor,
  //     textFontSize: nSaveOptional.textFontSize,
  //     textColor: nSaveOptional.textColor,
  //     taskStatus: nSaveOptional.taskStatus,
  //   })
  // })
  //
  // test('color change', async () => {
  //   const element = screen.getByLabelText(colorList[0][2])
  //   expect(element.getAttribute('stroke')).toEqual('none')
  //   await user.click(element)
  //   expect(element.getAttribute('stroke')).toEqual('#9040b8')
  // })
})

// https://stackoverflow.com/questions/68731656/how-to-test-a-redux-action-that-dispatch-other-action
