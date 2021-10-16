const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mindboard-server:3%21q.FkpzkJPTM-Q@cluster0-sg0ny.mongodb.net/test?retryWrites=true&w=majority";
const ObjectId = require('mongodb').ObjectId;

const genIdU = (id) => {return ObjectId('5f17dc2309ce612aa8580' + id)}
const genIdS = (id) => {return ObjectId('5f17dc2309ce612aa8581' + id)}

let db, collectionUsers, collectionMaps, collectionShares;
async function mongoPlayground(cmd) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, });
    try {
        await client.connect();
        db = client.db("app_dev_mongo")
        collectionMaps = db.collection("maps");
        collectionUsers = db.collection("users");
        collectionShares = db.collection("shares");
        switch (cmd) {
            case 'deleteMapDeleteShare': {
                const dbContent = {
                    users: [
                        {_id: genIdU('001'), tabMapIdList: ['amap', 'bmap']},
                        {_id: genIdU('002'), tabMapIdList: ['bmap']},
                        {_id: genIdU('003'), tabMapIdList: ['cmap']}
                    ],
                    maps: [],
                    shares: [
                        {_id: genIdS('001'), shareUser: genIdU('001'), sharedMap: "amap"},
                        {_id: genIdS('002'), shareUser: genIdU('001'), sharedMap: "bmap"},
                        {_id: genIdS('003'), shareUser: genIdU('002'), sharedMap: "bmap"},
                        {_id: genIdS('004'), shareUser: genIdU('003'), sharedMap: "cmap"},
                    ]
                }
                // collectionMaps.insertMany(dbContent.maps);
                collectionUsers.insertMany(dbContent.users);
                collectionShares.insertMany(dbContent.shares);



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
    }
    catch (err) {
        console.log('error');
        console.log(err.stack);
    }
    client.close();
}

mongoPlayground('deleteMapDeleteShare');
