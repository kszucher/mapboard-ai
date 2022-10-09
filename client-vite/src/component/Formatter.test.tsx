import {render, screen,} from "@testing-library/react"
import user from "@testing-library/user-event"
import {Provider} from "react-redux"
import {Formatter} from "./Formatter"
import { describe, it } from 'vitest'
import {actions, store} from "../core/EditorFlow";
import React from "react";
import {colorList} from "../core/Colors";
import {LineTypes, MapRight, TextTypes, WidthTypes} from "../core/Types";

describe("Formatter test", () => {
  beforeEach(() => {
    store.dispatch(actions.parseRespPayload({
      mapRight: MapRight.EDIT,
      node: {
        density: undefined,
        alignment: undefined,
        selection: undefined,
        lineWidth: WidthTypes.w1,
        lineType: LineTypes.bezier,
        lineColor: colorList[0][0],
        borderWidth: WidthTypes.w1,
        borderColor: colorList[0][0],
        fillColor: colorList[0][0],
        textFontSize: TextTypes.h1,
        textColor: colorList[0][0],
        taskStatus: undefined,
      }
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

    expect(store.getState().node).toEqual({
      density: undefined,
      alignment: undefined,
      selection: undefined,
      lineWidth: WidthTypes.w2,
      lineType: LineTypes.edge,
      lineColor: colorList[0][1],
      borderWidth: WidthTypes.w2,
      borderColor: colorList[0][1],
      fillColor: colorList[0][1],
      textFontSize: TextTypes.h2,
      textColor: colorList[0][1],
      taskStatus: undefined,
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

    expect(store.getState().node).toEqual({
      density: undefined,
      alignment: undefined,
      selection: undefined,
      lineWidth: 'clear',
      lineType: 'clear',
      lineColor: 'clear',
      borderWidth: 'clear',
      borderColor: 'clear',
      fillColor: 'clear',
      textFontSize: 'clear',
      textColor: 'clear',
      taskStatus: undefined,
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
