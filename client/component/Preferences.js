import React, {useContext} from 'react';
import {Context} from "../core/Store";
import {Palette} from "./Palette";
import '../component-css/Preferences.css'
import makeStyles from "@material-ui/core/styles/makeStyles";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";

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
    const {density, alignment, fontSize, colorMode, mouseMode} = state;

    const setDensity =        e => dispatch({type: 'SET_DENSITY',     payload: e.target.value});
    const setAlignment =      e => dispatch({type: 'SET_ALIGNMENT',   payload: e.target.value});
    const setFontSize =       e => dispatch({type: 'SET_FONT_SIZE',   payload: e.target.value});
    const setColorMode =      e => dispatch({type: 'SET_COLOR_MODE',  payload: e.target.value});
    const setMouseMode =      e => dispatch({type: 'SET_MOUSE_MODE',  payload: e.target.value});

    const undo =              _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'undo'});
    const redo =              _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'redo'});
    const save =              _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'save'});
    const cut =               _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'cut'});
    const copy =              _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'copy'});
    const paste =             _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'paste'});
    const task =              _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'task'});
    const formatColorReset =  _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'formatColorReset'});

    return (
        <div id = 'preferencesContainer'>
            <div id = 'preferences'>
                <MaterialSelector input = {['Mouse Mode Out',   mouseMode,  setMouseMode,   ['select', 'drag']]}/>
                <MaterialSelector input = {['Map Density',      density,    setDensity,     ['small', 'large']]}/>
                <MaterialSelector input = {['Map Alignment',    alignment,  setAlignment,   ['adaptive', 'symmetrical']]}/>
                <MaterialSelector input = {['Font Size',        fontSize,   setFontSize,    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']]}/>
                <MaterialSelector input = {['Color Mode',       colorMode,  setColorMode,   ['text', 'border', 'highlight', 'line']]}/>

                <Palette/>

                <div className={'buttons'}>
                    <MaterialButton input = {[undo, 'undo']}/>
                    <MaterialButton input = {[redo, 'redo']}/>
                    <MaterialButton input = {[save, 'save']}/>
                </div>
                <div className={'buttons'}>
                    <MaterialButton input = {[cut, 'content_cut']}/>
                    <MaterialButton input = {[copy, 'content_copy']}/>
                    <MaterialButton input = {[paste, 'content_paste']}/>
                </div>
                <div className={'buttons'}>
                    <MaterialButton input = {[task, 'assignment_turned_in']}/>
                    <MaterialButton input = {[formatColorReset, 'format_color_reset']}/>
                </div>
            </div>
        </div>
    );
}

const MaterialSelector = (arg) => {
    const classes = useStyles();
    return (
        <FormControl component="fieldset" className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">{arg.input[0]}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={arg.input[1]}
                onChange={arg.input[2]}>
                {arg.input[3].map((name, index) =>
                    <MenuItem value={name} key={index}>{name}</MenuItem>
                )}
            </Select>
        </FormControl>
    )
};

const MaterialButton = (arg) => {
    return (
        <IconButton onClick={arg.input[0]}>
            <span className="material-icons">{arg.input[1]}</span>
        </IconButton>
    )
};
