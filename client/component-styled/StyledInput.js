import TextField from "@material-ui/core/TextField";
import React from "react";

export default function StyledInput (arg) {
    const {label, type, onChange, autoFocus} = arg;
    return (
        <TextField
            variant="outlined"
            fullWidth
            type={type}
            autoComplete={type}
            label={label}
            onChange={onChange}
            autoFocus={autoFocus}
        />
    )
}
