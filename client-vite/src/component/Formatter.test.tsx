import {render, screen,} from "@testing-library/react"
import user from "@testing-library/user-event"
import {Provider} from "react-redux"
import {Formatter} from "./Formatter"
import { describe, it } from 'vitest'
import {actions, MapRight, store} from "../core/EditorFlow";
import React from "react";
import {TextTypes} from "../core/DefaultProps";

describe("Formatter test", () => {
  test("should work", async () => {
    store.dispatch(actions.parseRespPayload({mapRight: MapRight.EDIT})) // allow buttons to be pressed
    const {} = render(
      <Provider store={store}>
        <Formatter/>
      </Provider>,
    )

    await user.click(screen.getByRole('button', {name: /h1/i}))
    expect(store.getState().node.textFontSize).toEqual(TextTypes.h1)

    await user.click(screen.getByRole('button', {name: /h2/i}))
    expect(store.getState().node.textFontSize).toEqual(TextTypes.h2)
  })})

// https://stackoverflow.com/questions/68731656/how-to-test-a-redux-action-that-dispatch-other-action
