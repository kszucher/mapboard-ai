import {render} from "@testing-library/react"
import {CreateTable} from "./CreateTable"
import { describe, it } from 'vitest'


describe("CreateTable test", () => {
  test("should work", () => {
    const {} = render(<CreateTable/>)
  })
})
