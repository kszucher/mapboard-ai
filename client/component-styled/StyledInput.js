import TextField from "@material-ui/core/TextField";
import React from "react";

export default function StyledInput (arg) {
    const {open, type} = arg;
    return (
        open && <TextField
            {...arg}
            variant="outlined"
            fullWidth
            autoComplete={type}
        />
    )
}
