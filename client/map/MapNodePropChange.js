export const mapNodePropChange = {
    start: (cml, propName, propValue) => {
        this.propName = propName;
        this.propValue = propValue;
        this.iterate(cml);
    },

    iterate: (cm) => {
        cm[this.propName]  = this.propValue;

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
};
