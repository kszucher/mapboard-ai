import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

export default function StyledButton(arg) {
    switch (arg.version) {
        case 'icon': {
            const {action, icon} = arg
            return (
                <IconButton color='secondary' onClick={action}>
                    <span className="material-icons">{icon}</span>
                </IconButton>
            )
        }
        case 'shortOutlined': {
            const {name, action} = arg;
            const classes = useStyles();
            return (
                <div className={classes.root}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={action}>
                        {name}
                    </Button>
                </div>
            );
        }
        case 'longContained': {
            const {name, action, disabled} = arg;
            return (
                <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    color="primary"
                    disabled={disabled}
                    onClick={action}>
                    {name}
                </Button>
            )
        }
        default: return(<></>)
    }

}
