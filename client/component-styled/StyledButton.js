import React from 'react';
import Button from '@material-ui/core/Button';

export default function StyledButton(arg) {
    const {name} = arg;
    return (
        <Button
            {...arg}
            color="primary">
            {name}
        </Button>
    )
}
