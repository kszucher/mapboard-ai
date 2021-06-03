const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mindboard-server:3%21q.FkpzkJPTM-Q@cluster0-sg0ny.mongodb.net/test?retryWrites=true&w=majority";
const ObjectId = require('mongodb').ObjectId;

async function userFilter (collectionUsers, params) {
    let filter = [];
    switch (params.filterMode) {
        case 'all': {
            // todo: gather maps from headermaplists for notdelete
        }
    }
}

async function mapFilter (collectionMaps, params) {
    let filter = [];
    switch (params.filterMode) {
        case 'all': {
            await collectionMaps.find({}).forEach( doc => {
                filter.push({
                    _id : doc._id,
                });
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
                                        [`$${params.cond}`]: [
                                            "$$dataElem." + dataElemField,
                                            `${params.condVal}`
                                        ]}
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
                filter.push({
                    mapId : doc._id,
                    nodePath: doc.data['path'],
                    nodeValue : doc.data[dataElemField]
                });
            });
        }
    }
    return filter;
}

async function updateStage (params) {
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
            // note: unable to use aggregation unset from mongodb v4.2, as mongodb free tier only supports mongodb 4.0
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
                let mapsAll =                       await mapFilter(collectionMaps, {filterMode: 'all'});
                let mapsFilteredLinkTypeInternal =  await mapFilter(collectionMaps, {filterMode: 'filtered', cond: 'eq', condKey: 'linkType', condVal: 'internal'})
                console.log(mapsAll.length);
                console.log(mapsFilteredLinkTypeInternal.length);
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
