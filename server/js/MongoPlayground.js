const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mindboard-server:3%21q.FkpzkJPTM-Q@cluster0-sg0ny.mongodb.net/test?retryWrites=true&w=majority";
const ObjectId = require('mongodb').ObjectId;

let db, collectionUsers, collectionMaps, collectionShares;
async function mongoPlayground(cmd) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, });
    try {
        await client.connect();
        db = client.db("app_dev_mongo")
        collectionUsers = db.collection("users");
        collectionMaps = db.collection("maps");
        collectionShares = db.collection("shares");
        await collectionUsers.deleteMany();
        await collectionMaps.deleteMany();
        await collectionShares.deleteMany();
        let dbContent;
        switch (cmd) {
            case 'deleteMapDeleteShare': {
                dbContent = {
                    users: [
                        {_id: 'u1', tabMapSelected: 2, tabMapIdList: ['m1', 'm2']},
                        {_id: 'u2', tabMapSelected: 1, tabMapIdList: ['m2']},
                        {_id: 'u3', tabMapSelected: 1, tabMapIdList: ['m3']},
                    ],
                    maps: [
                        {_id: 'm1'},
                        {_id: 'm2'},
                        {_id: 'm3'},
                    ],
                    shares: [
                        {_id: 's1', shareUser: 'u1', sharedMap: "m1"},
                        {_id: 's2', shareUser: 'u1', sharedMap: "m2"},
                        {_id: 's3', shareUser: 'u2', sharedMap: "m2"},
                        {_id: 's4', shareUser: 'u3', sharedMap: "m3"},
                    ]
                }
                break;
            }
        }
        await collectionUsers.insertMany(dbContent.users);
        await collectionMaps.insertMany(dbContent.maps);
        await collectionShares.insertMany(dbContent.shares);
        switch(cmd) {
            case 'deleteMapDeleteShare': {
                // https://stackoverflow.com/questions/9224841/add-a-new-field-to-a-collection-with-value-of-an-existing-field/9225033
                // https://stackoverflow.com/questions/10712751/mongodb-how-can-i-find-all-documents-that-arent-referenced-by-a-document-from/39555871



                // let result = await collectionUsers.aggregate([
                //     {
                //         $lookup: {
                //             from: 'shares',
                //             let: {user_id: "$_id"},
                //             pipeline: [
                //                 {
                //                     $match: {
                //                         $expr: {
                //                             $and: [
                //                                 {$eq: ['$sharedMap', 'm2']},
                //                                 {$eq: ["$shareUser", '$$user_id']},
                //                             ]
                //                         },
                //                     }
                //                 },
                //                 {
                //                     $count: "found"
                //                 },
                //
                //
                //             ],
                //             as: 'shouldDeleteSomething'
                //         },
                //     },
                //     {
                //         $unwind: {
                //             path:'$shouldDeleteSomething',
                //             preserveNullAndEmptyArrays: true // ha merge van, akkor nem fontos hogy ez is legyen
                //         }
                //     },
                // ]).toArray();


                // TODO elerni azt, hogy ahol a tabMapIdList tartalmazza a mapToRemove-ot, ott az kitorlodjon, plusz okosan kezelni a tabMapIdList-et
                // https://docs.mongodb.com/manual/tutorial/update-documents-with-aggregation-pipeline/
                let result = await collectionUsers.updateMany(
                    {},
                    []
                )

                // console.log(result)
                console.log(JSON.stringify(result, null, 4))
                break;
            }
        }
        let result = {
            users: await collectionUsers.find().toArray(),
            maps: await collectionMaps.find().toArray(),
            shares: await collectionShares.find().toArray(),
        };
        // console.log(result)
        // console.log(JSON.stringify(result, null, 4))
    }
    catch (err) {
        console.log('error');
        console.log(err.stack);
    }
    client.close();
}

mongoPlayground('deleteMapDeleteShare');
