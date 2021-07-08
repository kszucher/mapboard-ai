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
                taskConfigD: 24,
                taskConfigGap: 4,

                margin: 32,



            }

            // save never
            let {taskConfigN, taskConfigD, taskConfigGap} = dataNested.m;
            Object.assign(dataNested.m, {
                taskConfigWidth: taskConfigN * taskConfigD + (taskConfigN - 1) * taskConfigGap,
                mapWidth: 0,
                mapHeight: 0,
            })
        }
    }
    // console.log(dataNested)
    return dataNested;
}
