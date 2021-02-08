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

    const [colorMode, setColorMode] = useState('text');

    const [state, dispatch] = useContext(Context);

    const {density, isPaletteVisible} = state;

    return (
        <div id = 'preferencesContainer'>
            <div id = 'preferences'>

                <div className={classes.root}>
                    <FormControl component="fieldset" className={classes.formControl}>
                        <FormLabel component="legend">Map Density</FormLabel>
                        <RadioGroup
                            aria-label="mapDensity"
                            name="mapDensity"
                            value={density}
                            onChange={e => dispatch({type: 'SET_DENSITY', payload: e.target.value})}>
                            <FormControlLabel
                                value="small"
                                control={<Radio />}
                                label="Small" />
                            <FormControlLabel
                                value="large"
                                control={<Radio />}
                                label="Large" />
                        </RadioGroup>
                        <FormLabel component="legend">Colors</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isPaletteVisible}
                                        onChange={e => dispatch({type: 'SET_IS_PALETTE_VISIBLE', payload: e.target.checked})}
                                        name="paletteSwitch" />}
                                label="Palette"/>
                        </FormGroup>
                        {/*<Select*/}
                        {/*    labelId="demo-simple-select-label"*/}
                        {/*    id="demo-simple-select"*/}
                        {/*    value={colorMode}*/}
                        {/*    onChange={event => setColorMode(event.target.value)}>*/}
                        {/*    <MenuItem value={'text'}>Text</MenuItem>*/}
                        {/*    <MenuItem value={'border'}>Border</MenuItem>*/}
                        {/*    <MenuItem value={'highlight'}>Highlight</MenuItem>*/}
                        {/*    <MenuItem value={'line'}>Line</MenuItem>*/}
                        {/*</Select>*/}
                        <RadioGroup
                            aria-label="colorModes"
                            name="colorModes"
                            value={colorMode}
                            onChange={event => setColorMode(event.target.value)}>
                            <FormControlLabel value="text" control={<Radio />} label="Text" />
                            <FormControlLabel value="border" control={<Radio />} label="Border" />
                            <FormControlLabel value="highlight" control={<Radio />} label="Highlight" />
                            <FormControlLabel value="line" control={<Radio />} label="Line" />
                        </RadioGroup>

                    </FormControl>
                </div>
            </div>
        </div>
    );
}
