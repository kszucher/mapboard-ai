import {copy, subsasgn} from "../core/Utils";

export function mapAssembly(dataLinear) {
    let dataNested = {};
    for (let i = 0; i < dataLinear.length; i++) {
        subsasgn(dataNested, copy(dataLinear[i].path), copy(dataLinear[i]));
        if (i === 0) {
            dataNested.r.d = [{},{}];
            // STORE IN MONGO ONCE WORKING

            // save always
            dataNested.m = {
                alignment: 'left',
                density: 'large',

                sLineDeltaXDefault: 0,
                padding: 0,
                defaultH: 0,

                taskConfigN: 4,
                taskConfigGap: 4,
                margin: 32,
            }

            // save never
            let {density} = dataNested.m;
            Object.assign(dataNested.m, {
                mapWidth: 0,
                mapHeight: 0,
                sLineDeltaXDefault: density === 'large' ? 30 : 20,
                padding: density === 'large' ? 8 : 3,
                defaultH: density === 'large' ? 30 : 20, // 30 = 14 + 2*8, 20 = 14 + 2*3
                taskConfigD: density === 'large' ? 24 : 20,
            })

            let {taskConfigN, taskConfigGap, taskConfigD} = dataNested.m;
            Object.assign(dataNested.m, {
                taskConfigWidth: taskConfigN * taskConfigD + (taskConfigN - 1) * taskConfigGap,
            })
        }
    }
    // console.log(dataNested)
    return dataNested;
}
