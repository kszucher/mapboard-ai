import {render, screen} from "@testing-library/react"
import {Provider} from "react-redux"
import {Formatter} from "./Formatter"
import { describe, it } from 'vitest'
import {store} from "../core/EditorFlow";
import React from "react";

describe("Formatter test", () => {
  test("should work", () => {
    const {} = render(
      <Provider store={store}>
        <Formatter/>
      </Provider>,
    )
  })})

// click through the ui element and check if redux changes accordingly
// https://stackoverflow.com/questions/68731656/how-to-test-a-redux-action-that-dispatch-other-action
