import IconButton from "@material-ui/core/IconButton";
import React from "react";
import {createMuiTheme} from "@material-ui/core/styles";
import {MuiThemeProvider} from "@material-ui/core";

export function StyledIconButton (arg) {

    const name = arg.input[0];
    const currValue = arg.input[1];
    const action =  arg.input[2];

    return (
        <IconButton color={action ? 'primary' : 'secondary'} onClick={name}>
            <span className="material-icons">{currValue}</span>
        </IconButton>
    )
}
