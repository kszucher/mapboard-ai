import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    formControl: {
        margin: theme.spacing(3),
    },
}));

export function StyledSelect (arg) {
    const classes = useStyles();
    return (
        <FormControl
            component="fieldset"
            className={classes.formControl}>
            <InputLabel
                id="demo-simple-select-label">
                {arg.input[0]}
            </InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={arg.input[1]}
                onChange={arg.input[2]}>
                {arg.input[3].map((name, index) =>
                    <MenuItem
                        value={name}
                        key={index}>
                        {name}
                    </MenuItem>
                )}
            </Select>
        </FormControl>
    )
}
