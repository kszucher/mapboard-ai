import React, {useContext, useState, useEffect} from 'react';
import {Context} from '../core/Store';
import {nodeDispatch} from "../core/NodeFlow";
import {checkPop, push, redraw} from "../core/MapFlow";
import StyledButton from "../component-styled/StyledButton";

const colorList = [
    ['#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff', '#d4ebfe', '#f6e5d4', '#d4f6d4'],
    ['#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc', '#990000', '#000099', '#fbfafc'],
    ['#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc', '#8e7cc3', '#c27ba0', '#d5802a', '#1c8e1c', '#8e1c8e'],
    ['#85200c', '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#1155cc', '#0b5394', '#351c75', '#741b47', '#999999', '#bbbbbb', '#dddddd'],
];

export function Palette () {
    const [state, dispatch] = useContext(Context);
    const {colorMode, colorText, colorHighlight, colorLine, colorCellFrame, paletteVisible} = state;
    const [sel, setSel] = useState({x: 0, y: 0});

    const closePalette = () => dispatch({type: 'CLOSE_PALETTE'});

    const setOk = () => {
        closePalette()
    };
    const setCancel = () => {
        closePalette()
    };

    const findSel = (color) => {
        let sel = {x: 0, y: 0};
        for (let i = 0; i < colorList.length; i++) {
            for (let j = 0; j < colorList[0].length; j++) {
                if (colorList[i][j] === color) {
                    sel = {x: i, y: j}
                }
            }
        }
        return sel;
    };

    useEffect(() => {
        if (colorMode === 'text')               setSel(findSel(colorText));
        else if (colorMode === 'highlight')     setSel(findSel(colorHighlight))
        else if (colorMode === 'line')          setSel(findSel(colorLine))
        else if (colorMode === 'cellFrame')     setSel(findSel(colorCellFrame))
    }, [colorMode]);

    useEffect(() => {if (colorMode === 'text'       && colorText!== '')       setSel(findSel(colorText))},      [colorText]);
    useEffect(() => {if (colorMode === 'highlight'  && colorHighlight !== '') setSel(findSel(colorHighlight))}, [colorHighlight]);
    useEffect(() => {if (colorMode === 'line'       && colorLine !== '')      setSel(findSel(colorLine))},      [colorLine]);
    useEffect(() => {if (colorMode === 'cellFrame'  && colorCellFrame !== '') setSel(findSel(colorCellFrame))}, [colorCellFrame]);

    const handleClick = (i, j) => {
        setSel({x: i, y: j});
        push();
        nodeDispatch('applyColorFromPalette', {colorMode, color:colorList[i][j]});
        redraw();
        checkPop();
    };

    const o = 32;
    const r = 12;
    const xWidth = o * colorList[0].length;
    const yWidth = o * colorList.length;

    return (
        <div style={{
            position: 'fixed',
            bottom: '106px',
            right: '10px',
            width: xWidth + 'px',
            height: yWidth + 'px',
            backgroundColor: 'rgba(251,250,252,1)',
            borderRadius: '16px',
            paddingTop: '10px',
            paddingLeft: '10px',
            paddingRight: '10px',
            paddingBottom: '50px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#dddddd',
            visibility: paletteVisible? 'visible':'hidden'
        }}>
            <svg viewBox={`0 0 ${xWidth} ${yWidth}`}>
                {colorList.map((iEl, i) => (iEl.map((jEl, j) => (
                    <circle
                        cx={o/2 + j*o}
                        cy={o/2 + i*o}
                        r={r}
                        key={'key' + i*10 + j}
                        fill={jEl}
                        stroke={(i === sel.x && j === sel.y) ? '#9040b8' : 'none'}
                        strokeWidth = {"2%"}
                        onClick={()=>handleClick(i, j)}
                    />))))}
            </svg>
            <div style={{
                display: "flex",
                flexDirection: 'row',
                justifyContent: 'center'
            }}>
                <StyledButton input = {['OK', setOk]}/>
                <StyledButton input = {['Cancel', setCancel]}/>
            </div>
        </div>
    );
}
