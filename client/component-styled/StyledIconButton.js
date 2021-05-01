import IconButton from "@material-ui/core/IconButton";
import React from "react";

export function StyledIconButton (arg) {
    const {action, icon} = arg
    return (
        <IconButton color='secondary' onClick={action}>
            <span className="material-icons">{icon}</span>
        </IconButton>
    )
}
