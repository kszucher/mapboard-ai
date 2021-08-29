import TextField from "@material-ui/core/TextField";
import React from "react";

export default function StyledInput (arg) {
    const {open, value, label, type, onChange, autoFocus} = arg;
    return (
        open && <TextField
            variant="outlined"
            fullWidth
            type={type}
            autoComplete={type}
            label={label}
            value={value}
            onChange={onChange}
            autoFocus={autoFocus}
        />
    )
}
