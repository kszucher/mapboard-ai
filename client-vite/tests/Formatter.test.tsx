import {render, screen,} from "@testing-library/react"
import user from "@testing-library/user-event"
import {Provider} from "react-redux"
import {Formatter} from "../src/component/Formatter"
import { describe, it } from 'vitest'
import {actions, getMap, store} from "../src/core/EditorFlow";
import {colorList} from "../src/core/Colors";
import {FormatMode, LineTypes, MapRight, TextTypes, WidthTypes} from "../src/core/Types";
import {reCalc} from "../src/core/MapFlow";
import {mapAssembly} from "../src/map/MapAssembly";
import {nodeProps} from "../src/core/DefaultProps";

describe("Formatter test", () => {
  beforeEach(() => {
    const testMap = mapAssembly([
      {path: ['g'], density: 'small'},
      {path: ['r', 0], content: 'Features'},
      {path: ['r', 0, 'd', 0]},
      {path: ['r', 0, 'd', 0, 's', 0], content: 'Texts', selected: 1},
      {path: ['r', 0, 'd', 1]},
    ])
    store.dispatch(actions.parseRespPayload({
      formatMode: FormatMode.text,
      mapRight: MapRight.EDIT,
      mapStackDataIndex: 0,
      mapStackData: [reCalc(testMap, testMap)],
    }))
    const {} = render(
      <Provider store={store}>
        <Formatter/>
      </Provider>,
    )
  })
  test('set', async () => {
    await user.click(screen.getByRole('button', {name: 'text'}))
    await user.click(screen.getByLabelText(colorList[0][1]))
    await user.click(screen.getByRole('button', {name: 'h2'}))
    await user.click(screen.getByRole('button', {name: 'border'}))
    await user.click(screen.getByLabelText(colorList[0][1]))
    await user.click(screen.getByRole('button', {name: 'w2'}))
    await user.click(screen.getByRole('button', {name: 'fill'}))
    await user.click(screen.getByLabelText(colorList[0][1]))
    await user.click(screen.getByRole('button', {name: 'line'}))
    await user.click(screen.getByLabelText(colorList[0][1]))
    await user.click(screen.getByRole('button', {name: 'w2'}))
    await user.click(screen.getByRole('button', {name: 'edge'}))

    const m = getMap()
    const { nc } = m.g
    expect(nc).toEqual({
      selection: nodeProps.saveOptional['selection'],
      lineWidth: WidthTypes.w2,
      lineType: LineTypes.edge,
      lineColor: colorList[0][1],
      borderWidth: WidthTypes.w2,
      borderColor: colorList[0][1],
      fillColor: colorList[0][1],
      textFontSize: TextTypes.h2,
      textColor: colorList[0][1],
      taskStatus: nodeProps.saveOptional['taskStatus'],
    })
  })
  test('reset', async () => {
    await user.click(screen.getByRole('button', {name: 'text'}))
    await user.click(screen.getByRole('button', {name: 'RESET'}))
    await user.click(screen.getByRole('button', {name: 'border'}))
    await user.click(screen.getByRole('button', {name: 'RESET'}))
    await user.click(screen.getByRole('button', {name: 'fill'}))
    await user.click(screen.getByRole('button', {name: 'RESET'}))
    await user.click(screen.getByRole('button', {name: 'line'}))
    await user.click(screen.getByRole('button', {name: 'edge'}))
    await user.click(screen.getByRole('button', {name: 'RESET'}))

    const m = getMap()
    const { nc } = m.g
    expect(nc).toEqual({
      selection: nodeProps.saveOptional['selection'],
      lineWidth: nodeProps.saveOptional['lineWidth'],
      lineType: nodeProps.saveOptional['lineType'],
      lineColor: nodeProps.saveOptional['lineColor'],
      borderWidth: nodeProps.saveOptional['sBorderWidth'],
      borderColor: nodeProps.saveOptional['sBorderColor'],
      fillColor: nodeProps.saveOptional['sFillColor'],
      textFontSize: nodeProps.saveOptional['textFontSize'],
      textColor: nodeProps.saveOptional['textColor'],
      taskStatus: nodeProps.saveOptional['taskStatus'],
    })
  })

  test('color change', async () => {
    const element = screen.getByLabelText(colorList[0][2])
    expect(element.getAttribute('stroke')).toEqual('none')
    await user.click(element)
    expect(element.getAttribute('stroke')).toEqual('#9040b8')
  })
})

// https://stackoverflow.com/questions/68731656/how-to-test-a-redux-action-that-dispatch-other-action
