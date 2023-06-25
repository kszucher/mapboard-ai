import React from "react"

export const MapSvgIcon = ({iconName} : {iconName : string}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="#ffffff"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="icon icon-tabler icon-tabler-square-rounded-plus"
    viewBox="0 0 24 24"
  >
    {iconName === 'CirclePlusIcon' &&
      <g>
        <path stroke="none" d="M0 0h24v24H0z"></path>
        <path d="M12 5v14M5 12h14"></path>
      </g>
    }
    {iconName === 'SparkleIcon' &&
      <g>
        <path stroke="none" d="M0 0h24v24H0z"></path>
        <path d="M16 18a2 2 0 012 2 2 2 0 012-2 2 2 0 01-2-2 2 2 0 01-2 2zm0-12a2 2 0 012 2 2 2 0 012-2 2 2 0 01-2-2 2 2 0 01-2 2zM9 18a6 6 0 016-6 6 6 0 01-6-6 6 6 0 01-6 6 6 6 0 016 6z"></path>
      </g>
    }
    {iconName === 'TableIcon' &&
      <g>
        <path stroke="none" d="M0 0h24v24H0z"></path>
        <path fill="#ffffff" stroke="none" d="M4 11h4a1 1 0 011 1v8a1 1 0 01-1 1H6a3 3 0 01-2.995-2.824L3 18v-6a1 1 0 011-1zM21 12v6a3 3 0 01-2.824 2.995L18 21h-6a1 1 0 01-1-1v-8a1 1 0 011-1h8a1 1 0 011 1zM18 3a3 3 0 012.995 2.824L21 6v2a1 1 0 01-1 1h-8a1 1 0 01-1-1V4a1 1 0 011-1h6zM9 4v4a1 1 0 01-1 1H4a1 1 0 01-1-1V6a3 3 0 012.824-2.995L6 3h2a1 1 0 011 1z"></path>
      </g>
    }
    {iconName === 'RowInsertBottom' &&
      <g>
        <path stroke="none" d="M0 0h24v24H0z"></path>
        <path d="M20 6v4a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h14a1 1 0 011 1zM12 15v4M14 17h-4"></path>
      </g>
    }
    {iconName === 'RowInsertTop' &&
      <g>
        <path stroke="none" d="M0 0h24v24H0z"></path>
        <path d="M4 18v-4a1 1 0 011-1h14a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1zM12 9V5M10 7h4"></path>
      </g>
    }
    {iconName === 'ColumnInsertRight' &&
      <g>
        <path stroke="none" d="M0 0h24v24H0z"></path>
        <path d="M6 4h4a1 1 0 011 1v14a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1zM15 12h4M17 10v4"></path>
      </g>
    }
    {iconName === 'ColumnInsertLeft' &&
      <g>
        <path stroke="none" d="M0 0h24v24H0z"></path>
        <path d="M14 4h4a1 1 0 011 1v14a1 1 0 01-1 1h-4a1 1 0 01-1-1V5a1 1 0 011-1zM5 12h4M7 10v4"></path>
      </g>
    }
  </svg>
)

// https://tabler-icons.io/
// https://svg2jsx.com/
