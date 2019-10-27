const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mindboard-server:3%21q.FkpzkJPTM-Q@cluster0-sg0ny.mongodb.net/test?retryWrites=true&w=majority";
const ObjectId = require('mongodb').ObjectId;

async function mongoFunction() {
    const client = new MongoClient(uri, { useNewUrlParser: true });

    try {
        await client.connect();

        const collectionMaps =      client.db("app").collection("maps1v1");
        const collectionUsers =     client.db("app").collection("users");



        let temp = [];


        // find doc "_id", where a given node prop exists
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

            temp.push({
                updateId : doc._id,
                updatePath: doc.data['path'],
                updateOldIlink : doc.data[dataElemField]
            })

            console.log(doc._id);
            console.log(doc.data['path']);
            console.log(doc.data[dataElemField]);
        });

        // TODO: végigmegyek a listán, és egyrészt lekérem a megfelelő _id-t, majd egy új updateOne művelettel frissítem is



        for (let i = 0; i < temp.length; i++) {

            let newId = await collectionMaps.findOne({
                "id": temp[i].updateOldIlink
            });

            let newIdReal = newId._id;

            console.log(newIdReal)


            // https://stackoverflow.com/questions/4669178/how-to-update-multiple-array-elements-in-mongodb/46054172#46054172
            await collectionMaps.updateOne(
                { "_id":  ObjectId(temp[i].updateId) },
                { "$set": { "data.$[elem].ilink": newIdReal } },
                { "arrayFilters": [{ "elem.path": temp[i].updatePath }], "multi": true }
            )


        }


    }

    catch (err) {
        console.log('error');
        console.log(err.stack);
    }
    client.close();
}

mongoFunction();
