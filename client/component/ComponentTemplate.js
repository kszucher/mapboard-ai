import React, {useContext, useEffect} from 'react';
import {Context} from '../core/Store';

export function ComponentTemplate () {
    const [state, dispatch] = useContext(Context);

    useEffect(() => {

    }, []);

    const temp = () => {

    } ;

    return (
        <div id = 'component-template'>
        </div>
    );
}
