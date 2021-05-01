import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';

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

export default function StyledButtonGroup(arg) {
    const {name, value, action, valueList} = arg;
    const classes = useStyles();
    return (
        <div  className={classes.root}>
            <ButtonGroup size="small" variant="text" color="primary" aria-label="text primary button group">
                {valueList.map((name, index) =>
                    <Button onClick={e=>action(valueList[index])} key={index}>{name}</Button>
                )}
            </ButtonGroup>
        </div>
    );
}
