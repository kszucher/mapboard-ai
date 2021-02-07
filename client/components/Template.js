import React, {useContext, useEffect} from 'react';
import {Context} from "../core/Store";

export function Template () {
    const [state, dispatch] = useContext(Context);

    return (
        <div id = 'template'>

        </div>
    );
}
