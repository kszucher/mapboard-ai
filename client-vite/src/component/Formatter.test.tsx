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
        borderWidth: WidthTypes.w1,
        borderColor: colorList[0][1],
        fillColor: undefined,
        textFontSize: TextTypes.h1,
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
    await user.click(screen.getByRole('button', {name: /h2/i}))
    expect(store.getState().node.textFontSize).toEqual(TextTypes.h2)

    // textColor
    const element = screen.getByLabelText(colorList[1][2])
    expect(element.getAttribute('stroke')).toEqual('none')
    await user.click(element)
    expect(element.getAttribute('stroke')).toEqual('#9040b8')
    expect(store.getState().node.textColor).toEqual(colorList[1][2])

    // reset
    await user.click(screen.getByRole('button', {name: 'RESET'}))
    expect(store.getState().node.textColor).toEqual('clear')
    expect(store.getState().node.textFontSize).toEqual('clear')
    // TODO may figure out how to select ALL to see NONE has the stroke attribute
  })

  test('border', async () => {
    await user.click(screen.getByRole('button', {name: 'border'}))

    // borderWidth
    await user.click(screen.getByRole('button', {name: 'w2'}))
    expect(store.getState().node.borderWidth).toEqual(WidthTypes.w2)

    // borderColor
    await user.click(screen.getByLabelText(colorList[1][1]))
    expect(store.getState().node.borderColor).toEqual(colorList[1][1])

    // reset

  })
})

// https://stackoverflow.com/questions/68731656/how-to-test-a-redux-action-that-dispatch-other-action
