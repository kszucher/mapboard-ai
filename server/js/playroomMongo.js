const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mindboard-server:3%21q.FkpzkJPTM-Q@cluster0-sg0ny.mongodb.net/test?retryWrites=true&w=majority";
const ObjectId = require('mongodb').ObjectId;

async function userFilter (collectionUsers, params) {
    let filter = [];
    switch (params.filterMode) {
        case 'all': {
            await collectionUsers.find({}).forEach( doc => {
                filter.push({
                    userId : doc._id,
                });
            });
            break;
        }
    }
    return filter;
}

async function mapFilter (collectionMaps, params) {
    let filter = [];
    switch (params.filterMode) {
        case 'all': {
            await collectionMaps.find({}).forEach(doc => {
                if (params.returnArray === 'map') {
                    filter.push(doc._id);
                }
            });
            break;
        }
        case 'filtered': {
            let dataElemField = params.condKey;
            await collectionMaps.aggregate(
                [
                    {
                        $project: {
                            data: {
                                $filter: {
                                    input: "$data",
                                    as: "dataElem",
                                    cond: {
                                        [
                                            `$${params.cond}`]: [
                                            "$$dataElem." + dataElemField,
                                            `${params.condVal}`
                                        ]
                                    }
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
                    filter.push(doc.data.link);
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
                await collectionMaps.updateOne(
                    {_id: filter[i].mapId},
                    {$set: {"MAPROPNAME" : "MAPROPVALUE"}}
                );
            }
            break;
        }
        case 'unsetMapProp': {
            for (let i = 0; i < filter.length; i++) {
                await collectionMaps.updateOne(
                    {_id: filter[i].mapId},
                    {$unset: {"MAPROPNAME" : ""}}
                );
            }
            break;
        }
        case 'setNodeProp': {
            for (let i = 0; i < filter.length; i++) {
                await collectionMaps.updateOne(
                    { _id: filter[i].mapId },
                    { $set: { "data.$[elem].NODEPROPNAME" : "NODEPROPVALUE" } },
                    { "arrayFilters": [{ "elem.path": filter[i].nodePath }], "multi": true }
                )
            }
            break;
        }
        case 'unsetNodeProp': {
            for (let i = 0; i < filter.length; i++) {
                await collectionMaps.updateOne(
                    { _id: filter[i].mapId },
                    { $unset: { "data.$[elem].NODEPROPNAME" : "" } },
                    { "arrayFilters": [{ "elem.path": filter[i].nodePath }], "multi": true }
                )
            }
            break;
        }
    }
}

async function mongoFunction(cmd) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, });
    try {
        await client.connect();
        const collectionMaps = client.db("app").collection("maps");
        const collectionUsers = client.db("app").collection("users");

        switch (cmd) {
            case 'findDeleteUnusedMaps': {
                let allMaps = await mapFilter(collectionMaps, {
                    filterMode: 'all',
                    returnArray: 'map'
                });
                let tabMaps = await collectionUsers.distinct('headerMapIdList');
                let linkedMaps = await mapFilter(collectionMaps, {
                    filterMode: 'filtered',
                    cond: 'eq',
                    condKey: 'linkType',
                    condVal: 'internal',
                    returnArray: 'nodeLink',
                })

                console.log(allMaps.length)
                console.log(tabMaps.length)
                console.log(linkedMaps.length)

                // await collectionMaps.deleteMany(
                //     {
                //         _id: {
                //             $in: deleteMaps
                //         }
                //     }
                // )
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

mongoFunction('findDeleteUnusedMaps');
