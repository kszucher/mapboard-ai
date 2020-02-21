export const mapPrint = {
    start: (cml) => {
        mapPrint.str = '';
        mapPrint.iterate(cml);
        console.log(mapPrint.str)
    },

    iterate: (cm) => {
        mapPrint.str += ('\n' + '\t'.repeat(cm.path.length) + cm.content);

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            mapPrint.iterate(cm.s[i]);
        }
    }
};
