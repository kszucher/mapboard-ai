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
    {iconName === 'CirclePlus' &&
      <g>
        <path stroke="none" d="M0 0h24v24H0z"></path>
        <path d="M12 5v14M5 12h14"></path>
      </g>
    }
    {iconName === 'Sparkle' &&
      <g>
        <path stroke="none" d="M0 0h24v24H0z"></path>
        <path d="M16 18a2 2 0 012 2 2 2 0 012-2 2 2 0 01-2-2 2 2 0 01-2 2zm0-12a2 2 0 012 2 2 2 0 012-2 2 2 0 01-2-2 2 2 0 01-2 2zM9 18a6 6 0 016-6 6 6 0 01-6-6 6 6 0 01-6 6 6 6 0 016 6z"></path>
      </g>
    }
    {iconName === 'TableExport' &&
      <g>
        <path stroke="none" d="M0 0h24v24H0z"></path>
        <path d="M12.5 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v7.5M3 10h18M10 3v18M16 19h6M19 16l3 3-3 3"></path>
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
    {iconName === 'TablePlus' &&
      <g>
        <path stroke="none" d="M0 0h24v24H0z"></path>
        <path d="M12.5 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v7.5M3 10h18M10 3v18M16 19h6M19 16v6"></path>
      </g>
    }
    {iconName === 'FileUpload' &&
      <g>
        <path stroke="none" d="M0 0h24v24H0z"></path>
        <path d="M14 3v4a1 1 0 001 1h4"></path>
        <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2zM12 11v6"></path>
        <path d="M9.5 13.5L12 11l2.5 2.5"></path>
      </g>
    }
    {iconName === 'FileText' &&
      <g>
        <path stroke="none" d="M0 0h24v24H0z"></path>
        <path d="M14 3v4a1 1 0 001 1h4"></path>
        <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2zM9 9h1M9 13h6M9 17h6"></path>
      </g>
    }
  </svg>
)

// https://tabler-icons.io/
// https://svg2jsx.com/
