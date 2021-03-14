import IconButton from "@material-ui/core/IconButton";
import React from "react";
import {createMuiTheme} from "@material-ui/core/styles";
import {MuiThemeProvider} from "@material-ui/core";

export function StyledButton (arg) {
    return (
        <IconButton color={arg.input[2] ? 'primary' : 'secondary'} onClick={arg.input[0]}>
            <span className="material-icons">{arg.input[1]}</span>
        </IconButton>
    )
}
