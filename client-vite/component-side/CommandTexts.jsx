import {useSelector, useDispatch} from "react-redux";
import {MAP_RIGHTS} from "../core/EditorFlow";
import StyledButtonGroup from "../component-styled/StyledButtonGroup";
import { getColors } from '../core/Colors'

const setClear = arr => arr.reduce((o, key) => ({ ...o, [key]: 'clear'}), {})

export function CommandTexts () {
    const {UNAUTHORIZED, VIEW} = MAP_RIGHTS
    const FORMAT_MODE_TYPES = ['line', 'border', 'fill', 'text']
    const LINE_WIDTH_TYPES = ['w1', 'w2', 'w3']
    const LINE_TYPE_TYPES = ['bezier', 'edge']
    const BORDER_WIDTH_TYPES = ['w1', 'w2', 'w3']
    const FONT_SIZE_TYPES = ['h1', 'h2', 'h3', 'h4', 't']

    const colorMode = useSelector(state => state.colorMode)
    const {MAP_BACKGROUND} = getColors(colorMode)
    const formatMode = useSelector(state => state.formatMode)
    const mapRight = useSelector(state => state.mapRight)
    const disabled = [UNAUTHORIZED, VIEW].includes(mapRight)
    const lineWidth = {[1]: 'w1', [2]: 'w2', [3]: 'w3'}[useSelector(state => state.node.lineWidth)]
    const lineType = {['b']: 'bezier', ['e']: 'edge'}[useSelector(state => state.node.lineType)]
    const borderWidth = {[1]: 'w1', [2]: 'w2', [3]: 'w3'}[useSelector(state => state.node.borderWidth)]
    const textFontSize = {[36]: 'h1', [24]: 'h2', [18]: 'h3', [16]: 'h4', [14]: 't'}[useSelector(state => state.node.textFontSize)]
    const taskStatus = useSelector(state => state.node.taskStatus)

    const dispatch = useDispatch()
    const openPalette = e => dispatch({type: 'OPEN_PALETTE', payload: e})
    const setNodeParam = obj => dispatch({type: 'SET_NODE_PARAMS', payload: obj })
    const setLineWidth = value => setNodeParam({lineWidth: {['w1']: 1, ['w2']: 2, ['w3']: 3}[value]})
    const setLineType = value => setNodeParam({lineType: {['bezier']: 'b', ['edge']: 'e'}[value]})
    const setBorderWidth = value => setNodeParam({borderWidth: {['w1']: 1, ['w2']: 2, ['w3']: 3}[value]})
    const setTextFontSize = value => setNodeParam({textFontSize: {['h1']: 36, ['h2']: 24, ['h3']: 18, ['h4']: 16, ['t']: 14}[value]})
    const toggleTask = _ => setNodeParam({taskStatus: taskStatus === -1 ? 'setTask' : 'clearTask'})
    const resetFormat = _ => setNodeParam(setClear(['lineType', 'lineWidth', 'lineColor', 'borderWidth', 'borderColor', 'fillColor', 'textColor', 'textFontSize']))
    const resetLine = _ => setNodeParam(setClear(['lineType', 'lineWidth', 'lineColor']))
    const resetBorder = _ => setNodeParam(setClear(['borderWidth', 'borderColor']))
    const resetFill = _ => setNodeParam(setClear(['fillColor']))
    const resetText = _ => setNodeParam(setClear(['textColor', 'textFontSize']))
    const createMapInMap = _ => dispatch({type: 'CREATE_MAP_IN_MAP'})

    return (
        <div style={{
            position: 'fixed',
            right: 0, top: 96, width: 216,
            backgroundColor: MAP_BACKGROUND,
            paddingTop: 6, paddingBottom: 6,
            borderTopLeftRadius: 16, borderBottomLeftRadius: 16,
            borderRight: 0,
            borderColor: MAP_BACKGROUND,
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingLeft: 12, paddingRight: 12 }}>
                {/*<StyledButtonGroup open={true} valueList={['NODE', 'BRANCH']} value={'NODE'} action={_=>{}} disabled={disabled}/>*/}
                <StyledButtonGroup open={true} valueList={FORMAT_MODE_TYPES} value={formatMode} action={openPalette} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === '' } valueList={['reset format']} value={''} action={resetFormat} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === 'line'} valueList={['reset line']} value={''} action={resetLine} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === 'border'} valueList={['reset border']} value={''} action={resetBorder} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === 'fill'} valueList={['reset fill']} value={''} action={resetFill} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === 'text'} valueList={['reset text']} value={''} action={resetText} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === 'line'} valueList={LINE_WIDTH_TYPES} value={lineWidth} action={setLineWidth} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === 'line'} valueList={LINE_TYPE_TYPES} value={lineType} action={setLineType} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === 'border'} valueList={BORDER_WIDTH_TYPES} value={borderWidth} action={setBorderWidth} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === 'text'} valueList={FONT_SIZE_TYPES} value={textFontSize} action={setTextFontSize} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === ''} valueList={['convert to task']} value={''} action={toggleTask} disabled={disabled}/>
                <StyledButtonGroup open={formatMode === ''} valueList={['convert to submap']} value={''} action={createMapInMap} disabled={disabled}/>
            </div>
        </div>
    )
}
