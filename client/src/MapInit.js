import {mapMem}                                             from "./Map";
import {props, so, sn}                                      from "./Node"
import {copy, shallowCopy} from "./Utils"

class MapInit {
    start() {
        let cm = mapMem.data.s[0];
        this.iterate(cm);
    }

    iterate(cm) {
        // saveOptional
        for (let i = 0; i < so.length; i++) {
            let currProperty = so[i];

            if (cm.hasOwnProperty(so[i])) {
                // use ONLY when you adjust node settings, otherwise it will negatively impact performance
                // let currPropertyCopy = copy(cm[currProperty]);
                // delete cm[currProperty];
                // cm[currProperty] = currPropertyCopy;
            }
            else {
                if (['s', 'c', 'path'].includes(currProperty)) {
                    cm[currProperty] = copy(props.saveOptional[currProperty]);
                }
                else {
                    cm[currProperty] = shallowCopy(props.saveOptional[currProperty]);
                }
            }
        }

        // saveNever
        for (let i = 0; i < sn.length; i++) {
            let currProperty = sn[i];

            // initAlways
            if (currProperty === 'taskStatusInherited' && cm.hasOwnProperty('taskStatusInherited')) {
                // do not init
            } else if (currProperty === 'id' && cm.hasOwnProperty('id')) {
                // do not init
            } else if (currProperty === 'isDivAssigned' && cm.hasOwnProperty('isDivAssigned')) {
                // do not init
            } else if (currProperty === 'isTextAssigned' && cm.hasOwnProperty('isTextAssigned')) {
                // do not init
            } else if (currProperty === 'isLinkAssigned' && cm.hasOwnProperty('isLinkAssigned')) {
                // do not init
            } else if (currProperty === 'isPicAssigned' && cm.hasOwnProperty('isPicAssigned')) {
                // do not init
            } else if (currProperty === 'isEquationAssigned' && cm.hasOwnProperty('isEquationAssigned')) {
                // do not init
            } else if (currProperty === 'editTrigger' && cm.hasOwnProperty('editTrigger')) {
                // do not init
            }
            else {
                // initOnce
                cm[currProperty] = shallowCopy(props.saveNever[currProperty])
            }
        }

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                this.iterate(cm.c[i][j]);
            }
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            this.iterate(cm.s[i]);
        }
    }
}

export let mapInit = new MapInit();
