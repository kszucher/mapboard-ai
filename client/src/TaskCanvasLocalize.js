import {isMouseInsideRectangle}                                 from "./Utils";
import {mapref}                                                 from "./Map";
import {clearStructSelection}                                   from "./NodeSelect";
import {sphereLut, sphereRadius}                                from "./TaskCanvasVisualize"

export function taskCanvasLocalize() {
    let retVal = false;
    for (let i = 0; i < sphereLut.length; i++) {
        let currSphere = sphereLut[i];
        if (isMouseInsideRectangle(currSphere.centerX, currSphere.centerY, sphereRadius*2, sphereRadius*2)) {
            let cm = mapref(currSphere.path);

            clearStructSelection();

            cm.selected = 1;
            cm.taskStatus = currSphere.column;
            cm.taskStatusInherited = -1;

            retVal = true;
        }
    }
    return retVal;
}
