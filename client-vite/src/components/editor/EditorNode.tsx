import {Flex} from "@radix-ui/themes"
import React from "react"
import {EditorNodeEdit} from "./EditorNodeEdit"
import {EditorNodeInsert} from "./EditorNodeInsert"
import {EditorNodeMove} from "./EditorNodeMove"
import {EditorNodeSelect} from "./EditorNodeSelect"

export const EditorNode = () => {
  return (
    <Flex gap="1" align="center">
      <EditorNodeSelect/>
      <EditorNodeInsert/>
      <EditorNodeEdit/>
      <EditorNodeMove/>
    </Flex>
  )
}
