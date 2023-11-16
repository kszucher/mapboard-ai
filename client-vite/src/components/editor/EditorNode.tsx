import {Flex} from "@radix-ui/themes"
import React from "react"
import {useSelector} from "react-redux"
import {RootState} from "../../reducers/EditorReducer"
import {PageState} from "../../state/Enums"
import {EditorNodeEdit} from "./EditorNodeEdit"
import {EditorNodeInsert} from "./EditorNodeInsert"
import {EditorNodeInsertTable} from "./EditorNodeInsertTable"
import {EditorNodeMove} from "./EditorNodeMove"
import {EditorNodeSelect} from "./EditorNodeSelect"

export const EditorNode = () => {
  const pageState = useSelector((state: RootState) => state.editor.pageState)
  return (
    <Flex gap="1" align="center">
      <EditorNodeSelect/>
      <EditorNodeInsert/>
      {pageState === PageState.WS_CREATE_TABLE && <EditorNodeInsertTable/>}
      <EditorNodeEdit/>
      <EditorNodeMove/>
    </Flex>
  )
}
