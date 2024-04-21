import {FC} from 'react'
import TopologyStar from "../../assets/topology-star.svg?react"

export const EditorAppBarLeft: FC = () => {
  return (
    <div className="fixed top-0 w-[200px] h-[32px] py-1 flex items-center justify-center text-white z-50 gap-2">
      <TopologyStar/>
      <div style={{fontFamily: "Comfortaa"}} className="text-xl ">
        {'mapboard'}
      </div>
    </div>
  )
}
