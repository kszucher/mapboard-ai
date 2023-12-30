import {FC} from 'react'

export const EditorAppBarLeft: FC = () => {
  return (
    <div className="fixed top-0 w-[200px] h-[40px] py-1 flex items-center justify-center bg-gradient-to-r from-purple-900 to-purple-700 text-white z-50 rounded-r-lg">
      <h5 style={{fontFamily: "Comfortaa"}} className="text-xl dark:text-white">mapboard</h5>
    </div>
  )
}
