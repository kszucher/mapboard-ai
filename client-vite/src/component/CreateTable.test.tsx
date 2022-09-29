import {render} from "@testing-library/react"
import {Provider} from "react-redux"
import {CreateTable} from "./CreateTable"
import { describe, it } from 'vitest'
import {store} from "../core/EditorFlow";
import React from "react";

describe("CreateTable test", () => {
  test("should work", () => {
    const {} = render(
      <Provider store={store}>
        <CreateTable/>
      </Provider>,
    )
  })
})
