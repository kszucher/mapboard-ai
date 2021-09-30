export const mapPrint = {
    start: (cml) => {
        mapPrint.str = '';
        mapPrint.entryLength = cml.path.length;
        mapPrint.iterate(cml);
        console.log(mapPrint.str)
    },

    iterate: (cm) => {
        let indentationCount = cm.path.length - mapPrint.entryLength;
        mapPrint.str += ('  '.repeat(indentationCount));
        mapPrint.str += cm.content.replace(/<br\s*[\/]?>/gi, '\n' + '  '.repeat(indentationCount));
        mapPrint.str += '\n';
        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            mapPrint.iterate(cm.s[i]);
        }
    }
};
