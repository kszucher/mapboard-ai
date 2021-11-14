const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:TNszfBws4@JQ8!t@cluster0.wbdxy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const ObjectId = require('mongodb').ObjectId;

async function mapFilter (mapsColl, params) {
    let filter = [];
    switch (params.filterMode) {
        case 'all': {
            await mapsColl.find({}).forEach(doc => {
                if (params.returnArray === 'map') {
                    filter.push(doc._id);
                }
            });
            break;
        }
        case 'mapWithoutProp': {
            await mapsColl.find({[params.prop]: null}).forEach(doc => {
                if (params.returnArray === 'map') {
                    filter.push(doc._id);
                }
            });
            break;
        }
        case 'filtered': {
            await mapsColl.aggregate(
                [
                    {
                        $project: {
                            data: {
                                $filter: {
                                    input: "$data",
                                    as: "dataElem",
                                    cond: {[`$${params.cond}`]: [`$$dataElem.${params.condKey}`, `${params.condVal}`]}
                                }
                            }
                        }
                    },
                    {
                        $unwind: {
                            path: "$data"
                        }
                    }
                ]
            ).forEach( doc => {
                if (params.returnArray === 'nodeLink') {
                    filter.push(ObjectId(doc.data.link));
                } else if (params.returnArray === 'mapNodeContent') {
                    filter.push(doc.data.content);
                } else if (params.returnArray === 'mapNodePath') {
                    filter.push({
                        mapId : doc._id,
                        nodePath: doc.data.path,
                    });
                }
            });
        }
    }
    return filter;
}

async function updateStage (params) {
    // from 4.2 there is aggregation set, aggregation unset, so this could be part of the above query!!!
    switch (updateStage) {
        case 'setMapProp': {
            for (let i = 0; i < filter.length; i++) {
                await mapsColl.updateOne(
                    {_id: filter[i].mapId},
                    {$set: {"MAPROPNAME" : "MAPROPVALUE"}}
                );
            }
            break;
        }
        case 'unsetMapProp': {
            for (let i = 0; i < filter.length; i++) {
                await mapsColl.updateOne(
                    {_id: filter[i].mapId},
                    {$unset: {"MAPROPNAME" : ""}}
                );
            }
            break;
        }
        case 'setNodeProp': {
            for (let i = 0; i < filter.length; i++) {
                await mapsColl.updateOne(
                    { _id: filter[i].mapId },
                    { $set: { "data.$[elem].NODEPROPNAME" : "NODEPROPVALUE" } },
                    { "arrayFilters": [{ "elem.path": filter[i].nodePath }], "multi": true }
                )
            }
            break;
        }
        case 'unsetNodeProp': {
            for (let i = 0; i < filter.length; i++) {
                await mapsColl.updateOne(
                    { _id: filter[i].mapId },
                    { $unset: { "data.$[elem].NODEPROPNAME" : "" } },
                    { "arrayFilters": [{ "elem.path": filter[i].nodePath }], "multi": true }
                )
            }
            break;
        }
    }
}

let db, usersColl, mapsColl, sharesColl;
async function mongoUtil(cmd) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, });
    try {
        await client.connect();
        db = client.db("app_dev")
        usersColl = db.collection("users");
        mapsColl = db.collection("maps");
        sharesColl = db.collection("shares");
        switch (cmd) {
            case 'findDeleteUnusedMaps': {
                let allMaps = await mapFilter(mapsColl, {
                    filterMode: 'all',
                    returnArray: 'map'
                });
                let tabMaps = await usersColl.distinct('tabMapIdList')
                let ownedMaps = await mapFilter(mapsColl, {
                    filterMode: 'filtered',
                    cond: 'eq',
                    condKey: 'linkType',
                    condVal: 'internal',
                    returnArray: 'nodeLink',
                })

                let mapsToKeep = [...tabMaps, ...ownedMaps];
                let mapsToDelete = difference(allMaps, mapsToKeep);

                console.log(mapsToKeep.length)
                console.log(mapsToDelete.length) // run until mapsToDelete is 0

                // await mapsColl.deleteMany({_id: {$in: mapsToDelete}})
                break;
            }
            case 'addFieldToAllMap': {
                await mapsColl.updateMany({}, {$set: {ownerUser: ObjectId('5d88c99f1935c83e84ca263d')}});
                break;
            }
            case 'removeFieldFromAllMap': {
                // await mapsColl.updateMany({}, {$set: {density:[]}}); // NORMAL VERSION
                // await mapsColl.aggregate([{$unset: "density"}, {$out: "maps"}]).toArray() // FANCY VERSION
                break;
            }
            case 'removeArrayElementFromAllMap': {
                await mapsColl.updateMany({}, {$pop: {path: 1}});
                break;
            }
            case 'pushStuff': {
                // await mapsColl.updateMany({}, {$push: {data:{$each: [{path: ['m']}], $position: 0}}})
                break;
            }
            case 'noPath': {
                let arr = await mapFilter(mapsColl, {
                    filterMode: 'mapWithoutProp',
                    prop: 'path',
                    returnArray: 'map',
                })
                for (let i = 0; i < arr.length; i++) {
                    let parent = await mapFilter(mapsColl, {
                        filterMode: 'filtered',
                        cond: 'eq',
                        condKey: 'link',
                        condVal: arr[i],
                        returnArray: 'mapNodeContent',
                    })
                    let child = (await mapsColl.findOne({_id: ObjectId(arr[i])})).data[1].content;
                    console.log(parent, child)
                }
                break;
            }
        }
    }
    catch (err) {
        console.log('error');
        console.log(err.stack);
    }
    client.close();
}

// warn: set operations require strings
const difference = (arrA, arrB) => {
    arrA = arrA.map(el=>el.toString());
    arrB = arrB.map(el=>el.toString());
    return arrA.filter(x => !arrB.includes(x)).map(el=>ObjectId(el));
}

mongoUtil('');
