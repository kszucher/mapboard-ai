export const mapPrint = {
    start: (cml) => {
        mapPrint.str = '';
        mapPrint.entryLength = cml.path.length;
        mapPrint.iterate(cml);
        console.log(mapPrint.str)
    },

    iterate: (cm) => {
        mapPrint.str += ('  '.repeat(cm.path.length - mapPrint.entryLength) + cm.content + '\n');

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            mapPrint.iterate(cm.s[i]);
        }
    }
};
