export const mapNodePropChange = {
    start: (cml, propName, propValue) => {
        mapNodePropChange.propName = propName;
        mapNodePropChange.propValue = propValue;
        mapNodePropChange.iterate(cml);
    },

    iterate: (cm) => {
        cm[mapNodePropChange.propName]  = mapNodePropChange.propValue;

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                mapNodePropChange.iterate(cm.c[i][j]);
            }
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            mapNodePropChange.iterate(cm.s[i]);
        }
    }
};
