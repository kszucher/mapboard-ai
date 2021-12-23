import React from 'react';
import IconButton from "@material-ui/core/IconButton";

export default function StyledIconButton(arg) {
    const {icon} = arg
    return (
        <IconButton
            {...arg}
            color='secondary'>
            <span
                className="material-icons">
                {icon}
            </span>
        </IconButton>
    )
}
