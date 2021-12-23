import TextField from "@material-ui/core/TextField";
import React from "react";

export default function StyledInput (arg) {
    const {type} = arg;
    return (
        <TextField
            {...arg}
            variant="outlined"
            fullWidth
            autoComplete={type}
        />
    )
}
