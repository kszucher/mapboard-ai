import React, {useContext, useState} from 'react';
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Switch from "@material-ui/core/Switch";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import {Context} from "../core/Store";
import '../component-css/Preferences.css'
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {Palette} from "./Palette";
import {MuiThemeProvider} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    formControl: {
        margin: theme.spacing(3),
    },
}));

export function Preferences () {
    const classes = useStyles();
    const [state, dispatch] = useContext(Context);
    const {density, isPaletteVisible, colorMode} = state;
    return (
        <div id = 'preferencesContainer'>
            <div id = 'preferences'>
                {/*<div className={classes.root}>*/}
                    <FormControl component="fieldset" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Map Density</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={density}
                            onChange={e => dispatch({type: 'SET_DENSITY', payload: e.target.value})}>
                            <MenuItem value={'small'}>Small</MenuItem>
                            <MenuItem value={'large'}>Large</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl component="fieldset" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Color</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={colorMode}
                            onChange={e => dispatch({type: 'SET_COLOR_MODE', payload: e.target.value})}>
                            <MenuItem value={'text'}>Text</MenuItem>
                            <MenuItem value={'border'}>Border</MenuItem>
                            <MenuItem value={'highlight'}>Highlight</MenuItem>
                            <MenuItem value={'line'}>Line</MenuItem>
                        </Select>
                        <Palette/>
                    </FormControl>
                </div>
            {/*</div>*/}
        </div>
    );
}
