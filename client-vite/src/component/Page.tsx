import React, {FC, useEffect} from 'react'
import {useSelector} from "react-redux"
import {RootState} from "../core/EditorReducer"
import {Landing} from "./Landing"
import {PageState} from "../state/Enums"
import {getEquationDim, getTextDim} from "./MapDivUtils"
import {Editor} from "./Editor"

export const Page: FC = () => {
  const pageState = useSelector((state: RootState) => state.editor.pageState)

  useEffect(()=> {
    getTextDim('Test', 12)
    getEquationDim('\\[Test\\]')
  }, [])

  return (
    <>
      {pageState === PageState.AUTH && <Landing/>}
      {pageState!== PageState.AUTH && <Editor/>}
    </>
  )
}
