const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mindboard-server:3%21q.FkpzkJPTM-Q@cluster0-sg0ny.mongodb.net/test?retryWrites=true&w=majority";
const ObjectId = require('mongodb').ObjectId;

async function mapFilter (cMaps, params) {
    let filter = [];
    switch (params.filterMode) {
        case 'all': {
            await cMaps.find({}).forEach(doc => {
                if (params.returnArray === 'map') {
                    filter.push(doc._id);
                }
            });
            break;
        }
        case 'mapWithoutProp': {
            await cMaps.find({[params.prop]: null}).forEach(doc => {
                if (params.returnArray === 'map') {
                    filter.push(doc._id);
                }
            });
            break;
        }
        case 'filtered': {
            await cMaps.aggregate(
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
                await cMaps.updateOne(
                    {_id: filter[i].mapId},
                    {$set: {"MAPROPNAME" : "MAPROPVALUE"}}
                );
            }
            break;
        }
        case 'unsetMapProp': {
            for (let i = 0; i < filter.length; i++) {
                await cMaps.updateOne(
                    {_id: filter[i].mapId},
                    {$unset: {"MAPROPNAME" : ""}}
                );
            }
            break;
        }
        case 'setNodeProp': {
            for (let i = 0; i < filter.length; i++) {
                await cMaps.updateOne(
                    { _id: filter[i].mapId },
                    { $set: { "data.$[elem].NODEPROPNAME" : "NODEPROPVALUE" } },
                    { "arrayFilters": [{ "elem.path": filter[i].nodePath }], "multi": true }
                )
            }
            break;
        }
        case 'unsetNodeProp': {
            for (let i = 0; i < filter.length; i++) {
                await cMaps.updateOne(
                    { _id: filter[i].mapId },
                    { $unset: { "data.$[elem].NODEPROPNAME" : "" } },
                    { "arrayFilters": [{ "elem.path": filter[i].nodePath }], "multi": true }
                )
            }
            break;
        }
    }
}

let db, cUsers, cMaps, cShares;
async function mongoUtil(cmd) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, });
    try {
        await client.connect();
        db = client.db("app_dev")
        cUsers = db.collection("users");
        cMaps = db.collection("maps");
        cShares = db.collection("shares");
        switch (cmd) {
            case 'findDeleteUnusedMaps': {
                let allMaps = await mapFilter(cMaps, {
                    filterMode: 'all',
                    returnArray: 'map'
                });
                let tabMaps = await cUsers.distinct('tabMapIdList')
                let ownedMaps = await mapFilter(cMaps, {
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

                // await cMaps.deleteMany({_id: {$in: mapsToDelete}})
                break;
            }
            case 'addFieldToAllMap': {
                await cMaps.updateMany({}, {$set: {ownerUser: ObjectId('5d88c99f1935c83e84ca263d')}});
                break;
            }
            case 'removeFieldFromAllMap': {
                // await cMaps.updateMany({}, {$set: {density:[]}}); // NORMAL VERSION
                // await cMaps.aggregate([{$unset: "density"}, {$out: "maps"}]).toArray() // FANCY VERSION
                break;
            }
            case 'removeArrayElementFromAllMap': {
                await cMaps.updateMany({}, {$pop: {path: 1}});
                break;
            }
            case 'pushStuff': {
                // await cMaps.updateMany({}, {$push: {data:{$each: [{path: ['m']}], $position: 0}}})
                break;
            }
            case 'noPath': {
                let arr = await mapFilter(cMaps, {
                    filterMode: 'mapWithoutProp',
                    prop: 'path',
                    returnArray: 'map',
                })
                for (let i = 0; i < arr.length; i++) {
                    let parent = await mapFilter(cMaps, {
                        filterMode: 'filtered',
                        cond: 'eq',
                        condKey: 'link',
                        condVal: arr[i],
                        returnArray: 'mapNodeContent',
                    })
                    let child = (await cMaps.findOne({_id: ObjectId(arr[i])})).data[1].content;
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
