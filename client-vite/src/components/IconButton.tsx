import React, {ReactNode} from "react"

export const IconButton = ({colorMode, disabled, onClick, children} : {colorMode: string, disabled: boolean, onClick: Function, children: ReactNode}) => (
  <button
    type="button"
    className="text-white focus:outline-none font-medium rounded-full text-sm p-2 text-center inline-flex items-center dark:hover:bg-gray-700"
    disabled={disabled}
    onClick={() => onClick()}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke={colorMode === 'dark' ? "#ffffff" : '#000000'}
      opacity={disabled ? '25%' : '100%'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24">
      ({children})
    </svg>
    <span className="sr-only">Icon description</span>
  </button>
)
