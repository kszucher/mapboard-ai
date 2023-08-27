import {createTheme, PaletteMode} from "@mui/material"

export const getMuiTheme = (colorMode: string) => createTheme({
  palette: {
    mode: colorMode as PaletteMode,
    primary: {
      main: colorMode === 'light' ? '#002045' : '#dddddd',
    },
    secondary: {
      main: colorMode === 'light' ? '#002045' : '#dddddd',
    },
  },
  spacing: 2,
  typography: {
    fontFamily: 'Comfortaa',
  },
})
