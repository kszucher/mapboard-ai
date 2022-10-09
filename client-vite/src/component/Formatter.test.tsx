import {render, screen,} from "@testing-library/react"
import user from "@testing-library/user-event"
import {Provider} from "react-redux"
import {Formatter} from "./Formatter"
import { describe, it } from 'vitest'
import {actions, MapRight, store} from "../core/EditorFlow";
import React from "react";
import {TextTypes, WidthTypes} from "../core/DefaultProps";
import {colorList} from "../core/Colors";

describe("Formatter test", () => {

  beforeEach(() => {
    store.dispatch(actions.parseRespPayload({
      mapRight: MapRight.EDIT,
      node: {
        density: undefined,
        alignment: undefined,
        selection: undefined,
        lineWidth: undefined,
        lineType: undefined,
        lineColor: colorList[0][0],
        borderWidth: undefined,
        borderColor: colorList[0][1],
        fillColor: undefined,
        textFontSize: undefined,
        textColor: colorList[0][2],
        taskStatus: undefined,
      }
    }))
    const {} = render(
      <Provider store={store}>
        <Formatter/>
      </Provider>,
    )
  })

  test('text', async () => {
    await user.click(screen.getByRole('button', {name: 'text'}))

    // textFontSize
    await user.click(screen.getByRole('button', {name: /h1/i}))
    expect(store.getState().node.textFontSize).toEqual(TextTypes.h1)

    await user.click(screen.getByRole('button', {name: /h2/i}))
    expect(store.getState().node.textFontSize).toEqual(TextTypes.h2)

    await user.click(screen.getByRole('button', {name: /h3/i}))
    expect(store.getState().node.textFontSize).toEqual(TextTypes.h3)

    await user.click(screen.getByRole('button', {name: /h4/i}))
    expect(store.getState().node.textFontSize).toEqual(TextTypes.h4)

    await user.click(screen.getByRole('button', {name: 't'}))
    expect(store.getState().node.textFontSize).toEqual(TextTypes.t)

    // textColor
    expect(store.getState().node.textColor).toEqual(colorList[0][2])

    await user.click(screen.getByLabelText(colorList[1][2]))
    expect(store.getState().node.textColor).toEqual(colorList[1][2])

    await user.click(screen.getByRole('button', {name: 'RESET'}))
    expect(store.getState().node.textColor).toEqual('clear')
    expect(store.getState().node.textFontSize).toEqual('clear')
  })

  test('border', async () => {
    await user.click(screen.getByRole('button', {name: 'border'}))

    // borderWidth
    await user.click(screen.getByRole('button', {name: 'w1'}))
    expect(store.getState().node.borderWidth).toEqual(WidthTypes.w1)

    await user.click(screen.getByRole('button', {name: 'w2'}))
    expect(store.getState().node.borderWidth).toEqual(WidthTypes.w2)

    await user.click(screen.getByRole('button', {name: 'w3'}))
    expect(store.getState().node.borderWidth).toEqual(WidthTypes.w3)

    // borderColor
    expect(store.getState().node.borderColor).toEqual(colorList[0][1])

    await user.click(screen.getByLabelText(colorList[1][1]))
    expect(store.getState().node.borderColor).toEqual(colorList[1][1])

  })
})

// https://stackoverflow.com/questions/68731656/how-to-test-a-redux-action-that-dispatch-other-action
