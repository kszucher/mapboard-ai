import {Flex} from "@radix-ui/themes"
import React from "react"
import {useSelector} from "react-redux"
import {RootState} from "../../reducers/EditorReducer"
import {PageState} from "../../state/Enums"
import {EditorNodeEdit} from "./EditorNodeEdit"
import {EditorNodeEditContentEquation} from "./EditorNodeEditContentEquation"
import {EditorNodeEditContentMermaid} from "./EditorNodeEditContentMermaid"
import {EditorNodeEditCreateSubMap} from "./EditorNodeEditCreateSubMap"
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
      {pageState === PageState.WS_CREATE_MAP_IN_MAP && <EditorNodeEditCreateSubMap/>}
      {pageState === PageState.WS_EDIT_CONTENT_EQUATION && <EditorNodeEditContentEquation/>}
      {pageState === PageState.WS_EDIT_CONTENT_MERMAID && <EditorNodeEditContentMermaid/>}
      <EditorNodeMove/>
    </Flex>
  )
}
