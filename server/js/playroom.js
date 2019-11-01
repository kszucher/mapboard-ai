const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mindboard-server:3%21q.FkpzkJPTM-Q@cluster0-sg0ny.mongodb.net/test?retryWrites=true&w=majority";
const ObjectId = require('mongodb').ObjectId;

async function mongoFunction() {
    const client = new MongoClient(uri, { useNewUrlParser: true });

    try {
        await client.connect();

        const collectionMaps =      client.db("app").collection("maps");
        const collectionUsers =     client.db("app").collection("users");

        let filter = [];

        // FIND STAGE
        filterOp = '';
        switch (filterOp) {
            case 'allDoc': {
                await collectionMaps.find({}).forEach( doc => {
                    filter.push({
                        _id : doc._id,
                    });
                });
                break;
            }
            case 'existingNodeProp': {
                let dataElemField = 'NODEPROPNAME';
                await collectionMaps.aggregate(
                    [
                        {
                            $project: {
                                data: {
                                    $filter: {
                                        input: "$data",
                                        as: "dataElem",
                                        cond: {
                                            $ifNull: [
                                                "$$dataElem." + dataElemField,
                                                false
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

        // console.log(filter);
        console.log(filter.length);

        // MODIFY STAGE
        modifyOp = '';
        switch (modifyOp) {
            case 'unsetMapProp': {
                for (let i = 0; i < filter.length; i++) {
                    await collectionMaps.updateOne(
                        {_id: filter[i]._id},
                        {$unset: {'MAPROPNAME' : ""}}
                        );
                }
                // note: unable to use aggregation unset from mongodb v4.2, as mongodb free tier only supports mongodb 4.0
                break;
            }
            case 'unsetNodeProp': {
                for (let i = 0; i < filter.length; i++) {
                    await collectionMaps.updateOne(
                        { _id: filter[i]._id },
                        { "arrayFilters": [{ "elem.path": filter[i].path }], "multi": true },
                    { $unset: { "data.$[elem].NODEPROPNAME" : "" } }
                    )
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

mongoFunction();
