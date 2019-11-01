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
            case 'existingProp': {
                let dataElemField = 'ilink';
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
                        updateId : doc._id,
                        updatePath: doc.data['path'],
                        updateOldIlink : doc.data[dataElemField]
                    });
                });
            }
        }

        console.log(filter);

        modifyOp = '';
        switch (modifyOp) {
            case 'silly': {
                for (let i = 0; i < filter.length; i++) {

                    let newId = await collectionMaps.findOne({
                        "id": filter[i].updateOldIlink
                    });

                    let newIdReal = newId._id;

                    // https://stackoverflow.com/questions/4669178/how-to-update-multiple-array-elements-in-mongodb/46054172#46054172
                    await collectionMaps.updateOne(
                        { "_id":  ObjectId(filter[i].updateId) },
                        { "$set": { "data.$[elem].ilink": newIdReal } },
                        { "arrayFilters": [{ "elem.path": filter[i].updatePath }], "multi": true }
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
