import {makeStyles} from "@material-ui/core/styles";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import React from "react";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

export default function StyledButtonGroup (arg) {
    const {open, valueList, value, action, size, disabled, valueListDisabled} = arg;
    const classes = useStyles();
    return (
        open && <div className={classes.root}>
            <ButtonGroup
                disabled={disabled || false}
                size={size || 'small'}
                variant="text"
                color="primary"
                aria-label="text primary button group"
            >
                {valueList.map((name, index) =>
                    <Button
                        disabled={valueListDisabled && valueListDisabled[index] || false}
                        style ={{backgroundColor: value === valueList[index]? '#eeeaf2':''}}
                        onClick={e=>action(valueList[index])}
                        key={index}>
                        {name}
                    </Button>
                )}
            </ButtonGroup>
        </div>
    );
}
