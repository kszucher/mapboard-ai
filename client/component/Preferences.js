import React, {useContext, useEffect, useState} from 'react';
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
import {checkPop, push, redraw} from "../map/Map";
import {nodeDispatch} from "../core/NodeReducer";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import DeleteIcon from '@material-ui/icons/Delete';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import SaveIcon from '@material-ui/icons/Save';



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
    const {density, colorMode, fontSize} = state;

    useEffect(() => {
        if (fontSize !== '') {
            push();
            nodeDispatch('applyFontSize', fontSize);
            redraw();
            checkPop();
        }
    }, [fontSize]);

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
                <FormControl component="fieldset" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">Font Size</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={fontSize}
                        onChange={e => dispatch({type: 'SET_FONT_SIZE', payload: e.target.value})}>
                        <MenuItem value={'h1'}>H1</MenuItem>
                        <MenuItem value={'h2'}>H2</MenuItem>
                        <MenuItem value={'h3'}>H3</MenuItem>
                        <MenuItem value={'h4'}>H4</MenuItem>
                        <MenuItem value={'h5'}>H5</MenuItem>
                        <MenuItem value={'h6'}>H6</MenuItem>
                    </Select>
                </FormControl>

                <div className={'buttons'}>
                    <IconButton aria-label="delete">
                        <UndoIcon />
                    </IconButton>
                    <IconButton aria-label="delete">
                        <RedoIcon />
                    </IconButton>
                    <IconButton aria-label="delete">
                        <SaveIcon />
                    </IconButton>
                </div>
                <div className={'buttons'}>



                    <IconButton aria-label="alarm" color="primary" >
                        {/*<AssignmentTurnedInIcon />*/}

                        {/*<i className="material-icons">cloud_upload</i>*/}
                        <span className="material-icons">alarm</span>
                    </IconButton>
                </div>
            </div>
            {/*</div>*/}
        </div>
    );
}
