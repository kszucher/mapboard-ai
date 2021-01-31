import React, {useContext, useState} from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText";

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

    const [checked, setChecked] = useState(true);


    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const error = ()=>{}

    return (
        <div id = 'preferencesContainer'>
            <div id = 'preferences'>

                <div className={classes.root}>
                    <FormControl component="fieldset" className={classes.formControl}>
                        <FormLabel component="legend">Assign responsibility</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={checked} onChange={handleChange} name="gilad" />}
                                label="Gilad Gray"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={checked} onChange={handleChange} name="jason" />}
                                label="Jason Killian"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={checked} onChange={handleChange} name="antoine" />}
                                label="Antoine Llorca"
                            />
                        </FormGroup>
                        <FormHelperText>Be careful</FormHelperText>
                    </FormControl>
                    {/*<FormControl required error={error} component="fieldset" className={classes.formControl}>*/}
                    {/*    <FormLabel component="legend">Pick two</FormLabel>*/}
                    {/*    <FormGroup>*/}
                    {/*        <FormControlLabel*/}
                    {/*            control={<Checkbox checked={checked} onChange={handleChange} name="gilad" />}*/}
                    {/*            label="Gilad Gray"*/}
                    {/*        />*/}
                    {/*        <FormControlLabel*/}
                    {/*            control={<Checkbox checked={checked} onChange={handleChange} name="jason" />}*/}
                    {/*            label="Jason Killian"*/}
                    {/*        />*/}
                    {/*        <FormControlLabel*/}
                    {/*            control={<Checkbox checked={checked} onChange={handleChange} name="antoine" />}*/}
                    {/*            label="Antoine Llorca"*/}
                    {/*        />*/}
                    {/*    </FormGroup>*/}
                    {/*    <FormHelperText>You can display an error</FormHelperText>*/}
                    {/*</FormControl>*/}
                </div>

            </div>
        </div>
    );
}
