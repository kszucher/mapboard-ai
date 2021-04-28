import React, {useContext, useState, useEffect} from 'react';
import {Context} from '../core/Store';
import StyledButton from "../component-styled/StyledButton";

const colorList = [
    ['#D3EBCE', '#ECFDDF', '#FDFFEB', '#FFECD6', '#FED3D0', '#FED3D0'],
    ['#EFEFEF', '#DEDEE8', '#F3F0E0', '#E4EADE', '#DCE5E6', '#DCE5E6'],
    ['#9086A6', '#E0C1D2', '#EFF0ED', '#9DD4C9', '#75A3BA', '#75A3BA'],
    ['#A0D7D9', '#FBE7A3', '#F4CBA1', '#F8FDDF', '#AE99BF', '#AE99BF'],
    ['#1C5D6C', '#70A18F', '#B7CFAE', '#EDDDCF', '#B25C6D', '#B25C6D'],
    ['#B2CFC9', '#95BABD', '#9292B0', '#F6A7A7', '#FFD6C9', '#FFD6C9'],
    ['#04A4B5', '#30BFBF', '#56D3CB', '#EEEE99', '#EBD295', '#EBD295'],
    ['#285588', '#E36273', '#FCC40F', '#ECE7C7', '#A8875E', '#A8875E'],
    ['#605E85', '#6CCC86', '#F7D36F', '#FD7780', '#994D80', '#994D80'],
    ['#B4C2D6', '#BFE3DA', '#F5FCDC', '#FEFFF7', '#C0DDBE', '#C0DDBE'],
    ['#FFD6DE', '#E8CEE3', '#C7BAE1', '#BBD3EC', '#ECE4C5', '#ECE4C5'],
    ['#391F19', '#B68E63', '#F2DFA9', '#E58119', '#746839', '#746839'],
];

export function Palette () {
    const [state, dispatch] = useContext(Context);
    const {colorMode, colorLine, colorText, colorNode, colorBranch, paletteVisible} = state;
    const [sel, setSel] = useState({x: 0, y: 0});

    const closePalette =        () => dispatch({type: 'CLOSE_PALETTE'});
    const formatColorChange =   (c) => dispatch({type: 'FORMAT_COLOR_CHANGE', payload: c});

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
        switch (colorMode) {
            case 'line':    setSel(findSel(colorLine)); break;
            case 'text':    setSel(findSel(colorText)); break;
            case 'node':    setSel(findSel(colorNode)); break;
            case 'branch':  setSel(findSel(colorBranch)); break;
        }
    }, [colorMode]);

    useEffect(() => {if (colorMode === 'line'   && colorLine !== '')   setSel(findSel(colorLine))},   [colorLine]);
    useEffect(() => {if (colorMode === 'text'   && colorText!== '')    setSel(findSel(colorText))},   [colorText]);
    useEffect(() => {if (colorMode === 'node'   && colorNode !== '')   setSel(findSel(colorNode))},   [colorNode]);
    useEffect(() => {if (colorMode === 'branch' && colorBranch !== '') setSel(findSel(colorBranch))}, [colorBranch]);

    const handleClick = (i, j) => {
        setSel({x: i, y: j});
        formatColorChange(colorList[i][j]);
    };

    const o = 32;
    const r = 12;
    const xWidth = o * colorList[0].length;
    // const xWidth = 180;
    const yWidth = o * colorList.length;

    console.log(xWidth)

    return (
        <div style={{
            position: 'fixed',
            top: 48*8,
            right: 0,
            width: xWidth + 'px',
            height: yWidth + 'px',
            backgroundColor: 'rgba(251,250,252,1)',
            paddingTop: 12,
            paddingLeft: 12,
            paddingRight: 12,
            paddingBottom: 12,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            borderColor: '#dddddd',
            borderRight: 0,
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
