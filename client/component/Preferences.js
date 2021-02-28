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
    const {density, colorMode, fontSize} = state;

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
                    <InputLabel id="demo-simple-select-label">Map Alignment</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={density}
                        onChange={e => dispatch({type: 'SET_DENSITY', payload: e.target.value})}>
                        <MenuItem value={'small'}>Adaptive</MenuItem>
                        <MenuItem value={'large'}>Symmetrical</MenuItem>
                    </Select>
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
                <div className={'buttons'}>
                    <IconButton onClick={e => dispatch({type: 'SET_MAP_ACTION', payload: 'undo'})}>
                        <span className="material-icons">undo</span>
                    </IconButton>
                    <IconButton onClick={e => dispatch({type: 'SET_MAP_ACTION', payload: 'redo'})}>
                        <span className="material-icons">redo</span>
                    </IconButton>
                    <IconButton onClick={e => dispatch({type: 'SET_MAP_ACTION', payload: 'save'})}>
                        <span className="material-icons">save</span>
                    </IconButton>
                </div>
                <div className={'buttons'}>
                    <IconButton onClick={e => dispatch({type: 'SET_MAP_ACTION', payload: 'cut'})}>
                        <span className="material-icons">content_cut</span>
                    </IconButton>
                    <IconButton onClick={e => dispatch({type: 'SET_MAP_ACTION', payload: 'copy'})}>
                        <span className="material-icons">content_copy</span>
                    </IconButton>
                    <IconButton onClick={e => dispatch({type: 'SET_MAP_ACTION', payload: 'paste'})}>
                        <span className="material-icons">content_paste</span>
                    </IconButton>
                </div>
                <div className={'buttons'}>
                    <IconButton >
                        <span className="material-icons">grid_on</span>
                    </IconButton>
                    <IconButton onClick={e => dispatch({type: 'SET_MAP_ACTION', payload: 'task'})}>
                        <span className="material-icons">assignment_turned_in</span>
                    </IconButton>
                    <IconButton onClick={e => dispatch({type: 'SET_MAP_ACTION', payload: 'formatColorReset'})}>
                        <span className="material-icons">format_color_reset</span>
                    </IconButton>
                </div>
            </div>
            {/*</div>*/}
        </div>
    );
}
