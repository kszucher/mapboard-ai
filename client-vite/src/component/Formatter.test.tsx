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

// ok it is now very clear what I need to do
// - setNodeParamsNoTrigger parametrically --> this will change redux, but WON'T update map
// - now I can see if the UI loads the correct things
// - also, I can trigger ui changes, and see if the state values will be updated accordingly
// - this is simple, but the point of testing is making stuff simple --> inspecting if clicks result in state changes
// - believe me, this is a GOOD exercise to get the BASIC syntax, and to click on and inspect on things programmatically

// https://stackoverflow.com/questions/68731656/how-to-test-a-redux-action-that-dispatch-other-action


// let's say that I am putting mapStack into redux, that I can do...
