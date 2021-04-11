import IconButton from "@material-ui/core/IconButton";
import React from "react";

export function StyledIconButton (arg) {
    return (
        <IconButton color='secondary' onClick={arg.action}>
            <span className="material-icons">{arg.icon}</span>
        </IconButton>
    )
}
