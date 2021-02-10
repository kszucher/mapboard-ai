import React, {useContext, useState, useEffect} from 'react';
import {Context, remoteDispatch, remoteGetState} from '../core/Store';
import '../component-css/Palette.css'
import {nodeDispatch} from "../core/NodeReducer";
import {checkPop, push, redraw} from "../map/Map";

export function Palette () {

    // https://yagisanatode.com/2019/08/06/google-apps-script-hexadecimal-color-codes-for-google-docs-sheets-and-slides-standart-palette/
    // const colorList = [
    //     ['#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff'],
    //     ['#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff'],
    //     ['#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc'],
    //     ['#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd'],
    //     ['#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc', '#8e7cc3', '#c27ba0'],
    //     ['#a61c00', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3c78d8', '#3d85c6', '#674ea7', '#a64d79'],
    //     ['#85200c', '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#1155cc', '#0b5394', '#351c75', '#741b47'],
    //     ['#5b0f00', '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#1c4587', '#073763', '#20124d', '#4c1130']
    // ];

    const colorList = [
        ['#ffffff', '#cccccc', '#000000'],
        ['#e6b8af', '#cc4125', '#85200c'],
        ['#f4cccc', '#e06666', '#990000'],
        ['#fce5cd', '#f6b26b', '#b45f06'],
        ['#fff2cc', '#ffd966', '#bf9000'],
        ['#d9ead3', '#93c47d', '#38761d'],
        ['#d0e0e3', '#76a5af', '#134f5c'],
        ['#c9daf8', '#6d9eeb', '#1155cc'],
        ['#cfe2f3', '#6fa8dc', '#0b5394'],
        ['#d9d2e9', '#8e7cc3', '#351c75'],
        ['#ead1dc', '#c27ba0', '#741b47'],
        ['#d4ebfe', '#f6e5d4', '#d4f6d4'],
        ['#990000', '#000099', '#fbfafc'],
        ['#d5802a', '#1c8e1c', '#8e1c8e'],
        ['#999999', '#bbbbbb', '#dddddd'],
    ];

    const [state, dispatch] = useContext(Context);
    const {colorMode, colorText, colorBorder, colorHighlight, colorLine} = state;


    const findSel = (color) => {
        let sel = {
            x: 0,
            y: 0,
        };
        for (let i = 0; i < colorList.length; i++) {
            for (let j = 0; j < colorList[0].length; j++) {
                if (colorList[i][j] === color) {
                    sel = {
                        x: i,
                        y: j,
                    }
                }
            }
        }
        return sel;
    };

    useEffect(() => {
        if (colorMode === 'text') {                     setSel(findSel(colorText));
        } else if (colorMode === 'border') {            setSel(findSel(colorBorder))
        } else if (colorMode === 'highlight') {         setSel(findSel(colorHighlight))
        } else if (colorMode === 'line') {              setSel(findSel(colorLine))}
    }, [colorMode]);
    useEffect(() => {
        if (colorMode === 'text' && colorText!== '') {
            setSel(findSel(colorText))
        }
    }, [colorText]);
    useEffect(() => {
        if (colorMode === 'border' && colorBorder !== '') {
            setSel(findSel(colorBorder))
        }
    }, [colorBorder]);
    useEffect(() => {
        if (colorMode === 'highlight' && colorHighlight !== '') {
            setSel(findSel(colorHighlight));
        }
    }, [colorHighlight]);
    useEffect(() => {
        if (colorMode === 'line' && colorLine !== '') {
            setSel(findSel(colorLine))
        }
    }, [colorLine]);

    const [sel, setSel] = useState({
        x: 0,
        y: 0,
    });

    const handleClick = (i, j) => {
        setSel({
            x: i,
            y: j
        });
        push();
        nodeDispatch('applyColorFromPalette', {colorMode, color:colorList[i][j]});
        redraw();
        checkPop();
    };

    return (
        <div id = 'palette'>
            <svg viewBox='0 0 140 520'>
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
