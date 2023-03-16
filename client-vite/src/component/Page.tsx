import React, {FC, useEffect} from 'react'
import {RootStateOrAny, useSelector} from "react-redux"
import {Auth} from "./Auth"
import {PageState} from "../core/Enums";
import {getEquationDim, getTextDim} from "./MapDivUtils";
import {Editor} from "./Editor";

export const Page: FC = () => {
  const pageState = useSelector((state: RootStateOrAny) => state.editor.pageState)

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
