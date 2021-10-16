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
                        {_id: 1, tabMapIdList: ['amap', 'bmap']},
                        {_id: 2, tabMapIdList: ['bmap']},
                        {_id: 3, tabMapIdList: ['cmap']},
                    ],
                    maps: [
                        {_id: 1, name: "amap"},
                        {_id: 2, name: "bmap"},
                        {_id: 3, name: "cmap"},
                    ],
                    shares: [
                        {_id: 1, shareUser: 1, sharedMap: "amap"},
                        {_id: 2, shareUser: 1, sharedMap: "bmap"},
                        {_id: 3, shareUser: 2, sharedMap: "bmap"},
                        {_id: 4, shareUser: 3, sharedMap: "cmap"},
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
                // https://mongoplayground.net/p/izkTA3B8cfJ

                // tehát azon usereket akarom megfosztani a shared maptól, akik az adott remove maphoz tartoznak eh

                // NAJA itt addig jáccok holnap amíg nemmegy

                /*

                $lookup: {
                    from: 'shares',
                    let: {},
                    pipeline: [
                        $match: {
                            // sharedMap === mapIdRemove
                        }
                        // és akkor ebből valahogy ebből kiszedni csak a shareUser mezőt
                    ]
                }


                // valahogy a szűrés vége ID listát kéne kinyerni, és erre a listára csinálni valamit...
                // hogy lesz id listám???


                $project ???

                */




                break;
            }
        }
        let result = [
            await collectionUsers.find().toArray(),
            await collectionMaps.find().toArray(),
            await collectionShares.find().toArray(),
        ];
        console.log(result)
    }
    catch (err) {
        console.log('error');
        console.log(err.stack);
    }
    client.close();
}

mongoPlayground('deleteMapDeleteShare');
