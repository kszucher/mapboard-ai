import {FC} from 'react'
import TopologyStar from "../../assets/topology-star.svg?react"

export const EditorAppBarLeft: FC = () => {
  return (
    <div className="fixed top-0 w-[192px] h-[32px] py-1 flex items-center justify-center text-white z-50 gap-2 bg-gradient-to-r from-violet-700 to-violet-700 rounded-r-2xl">
      <TopologyStar/>
      <div style={{fontFamily: "Comfortaa"}} className="text-xl ">
        {'mapboard'}
      </div>
    </div>
  )
}
