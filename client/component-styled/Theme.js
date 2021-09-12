import {createTheme} from "@material-ui/core/styles";

export const muiTheme = createTheme({
    props: {
        // Name of the component
        MuiButtonBase: {
            // The properties to apply
            disableRipple: true // No more ripple, on the whole application!
        }
    },
    // https://material.io/resources/color/#!/?view.left=0&view.right=0&primary.color=5f0a87&secondary.color=FAFAFA&primary.text.color=ffffff&secondary.text.color=000000
    palette: {
        primary: {
            light: '#9040b8',
            main: '#5f0a87',
            dark: '#2e0059',
            contrastText: '#fbfafc',
        },
        secondary: {
            light: '#9040b8',
            main: '#5f0a87',
            dark: '#2e0059',
            contrastText: '#fbfafc',
        },
    },

    spacing: 2,

    typography: {
        fontFamily: 'Comfortaa',
    },
});
