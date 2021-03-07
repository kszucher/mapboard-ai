import React, {useContext, useEffect} from 'react';
import {Context} from '../core/Store';

export function NodeMoveVis () {
    const [state, dispatch] = useContext(Context);

    useEffect(() => {

    }, []);

    const temp = () => {

    } ;

    return (
        <div id = 'template'>
            <svg viewBox='0 0 400 300'>
                {colorList.map((iEl, i) => (
                    iEl.map((jEl, j) => (
                        <circle
                            cx={40 + j * 32}
                            cy={40 + i * 32}
                            r={12}
                            key={'key' + i * 10 + j}
                            fill={jEl}
                            stroke={(i === sel.x && j === sel.y) ? '#9040b8' : 'none'}
                            strokeWidth = {"2%"}
                            onClick={()=>handleClick(i, j)}
                        />))))}
            </svg>
        </div>
    );
}
