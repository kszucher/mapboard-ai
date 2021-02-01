import React, {useContext, useState} from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Divider from "@material-ui/core/Divider";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import CropFreeIcon from '@material-ui/icons/CropFree';


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

    return (
        <div id = 'preferencesContainer'>
            <div id = 'preferences'>

                <div className={classes.root}>
                    <FormControl component="fieldset" className={classes.formControl}>
                        <FormLabel component="legend">Map Density</FormLabel>
                        <RadioGroup aria-label="mapDensity" name="mapDensity" value={'Small'} onChange={handleChange}>
                            <FormControlLabel value="Small" control={<Radio />} label="Small" />
                            <FormControlLabel value="Large" control={<Radio />} label="Large" />
                        </RadioGroup>
                        <FormLabel component="legend">View</FormLabel>
                        <FormGroup>
                            <FormControlLabel control={<Switch checked={checked} onChange={handleChange} name="gilad" />} label="Locked"/>
                            <FormControlLabel control={<Switch checked={checked} onChange={handleChange} name="jason" />} label="Centered"/>
                        </FormGroup>
                    </FormControl>

                    {/*import CropFreeIcon from '@material-ui/icons/CropFree';*/}
                </div>

            </div>
        </div>
    );
}
