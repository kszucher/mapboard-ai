import TextField from "@material-ui/core/TextField";
import React from "react";
import {Box} from "@material-ui/core";

export default function StyledInput (arg) {
    const {value, label, type, onChange, autoFocus} = arg;
    return (
        <Box width={'75%'} mt={8}>
            <TextField
                variant="outlined"
                fullWidth
                type={type}
                autoComplete={type}
                label={label}
                value={value}
                onChange={onChange}
                autoFocus={autoFocus}
            />
        </Box>
    )
}
