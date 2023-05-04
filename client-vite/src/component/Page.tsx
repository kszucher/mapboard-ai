import React, {FC, useEffect} from 'react'
import {useSelector} from "react-redux"
import {RootState} from "../editor/EditorReducer";
import {Auth} from "./Auth"
import {PageState} from "../core/Enums";
import {getEquationDim, getTextDim} from "./MapDivUtils";
import {Editor} from "./Editor";

export const Page: FC = () => {
  const pageState = useSelector((state: RootState) => state.editor.pageState)

  useEffect(()=> {
    getTextDim('Test', 12)
    getEquationDim('\\[Test\\]')
  }, [])

  return (
    <div id="page">
      {pageState === PageState.AUTH && <Auth/>}
      {pageState!== PageState.AUTH && <Editor/>}
    </div>
  )
}
