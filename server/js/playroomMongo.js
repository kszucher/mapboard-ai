const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mindboard-server:3%21q.FkpzkJPTM-Q@cluster0-sg0ny.mongodb.net/test?retryWrites=true&w=majority";
const ObjectId = require('mongodb').ObjectId;

async function filterStage (collectionMaps, params) {
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
            let dataElemField = 'linkType';
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
                    _id : doc._id,
                    path: doc.data['path'],
                    value : doc.data[dataElemField]
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
                    {_id: filter[i]._id},
                    {$set: {"MAPROPNAME" : "MAPROPVALUE"}}
                );
            }
            break;
        }
        case 'unsetMapProp': {
            for (let i = 0; i < filter.length; i++) {
                await collectionMaps.updateOne(
                    {_id: filter[i]._id},
                    {$unset: {"MAPROPNAME" : ""}}
                );
            }
            // note: unable to use aggregation unset from mongodb v4.2, as mongodb free tier only supports mongodb 4.0
            break;
        }
        case 'setNodeProp': {
            for (let i = 0; i < filter.length; i++) {
                await collectionMaps.updateOne(
                    { _id: filter[i]._id },
                    { $set: { "data.$[elem].NODEPROPNAME" : "NODEPROPVALUE" } },
                    { "arrayFilters": [{ "elem.path": filter[i].path }], "multi": true }
                )
            }
            break;
        }
        case 'unsetNodeProp': {
            for (let i = 0; i < filter.length; i++) {
                await collectionMaps.updateOne(
                    { _id: filter[i]._id },
                    { $unset: { "data.$[elem].NODEPROPNAME" : "" } },
                    { "arrayFilters": [{ "elem.path": filter[i].path }], "multi": true }
                )
            }
            break;
        }
    }
}

async function mongoFunction(cmd) {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    try {
        await client.connect();
        const collectionMaps =      client.db("app").collection("maps");
        const collectionUsers =     client.db("app").collection("users");

        switch (cmd) {
            case 'findDeleteUnusedMaps': {
                let maps = await filterStage(collectionMaps, {filterMode: 'all'});
                console.log(maps.length);
                let mapsThatHaveInternalLink = await filterStage(collectionMaps, {filterMode: 'filtered', cond: 'eq', condVal: 'internal'})
                console.log(mapsThatHaveInternalLink.length);
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
