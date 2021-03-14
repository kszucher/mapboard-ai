import IconButton from "@material-ui/core/IconButton";
import React from "react";

export function StyledButton (arg) {
    return (
        <IconButton onClick={arg.input[0]}>
            <span className="material-icons">{arg.input[1]}</span>
        </IconButton>
    )
}
