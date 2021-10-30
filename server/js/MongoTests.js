const MongoQueries = require("./MongoQueries");

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mindboard-server:3%21q.FkpzkJPTM-Q@cluster0-sg0ny.mongodb.net/test?retryWrites=true&w=majority";
const ObjectId = require('mongodb').ObjectId;

let db, cUsers, cMaps, cShares;
async function mongoTests(cmd) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, });
    try {
        await client.connect();
        db = client.db("app_dev_mongo")
        cUsers = db.collection("users");
        cMaps = db.collection("maps");
        cShares = db.collection("shares");
        await cUsers.deleteMany();
        await cMaps.deleteMany();
        await cShares.deleteMany();
        let dbContent;
        switch (cmd) {
            case 'deleteMapOne':
            case 'deleteMapAll':
            {
                dbContent = {
                    users: [
                        {_id: 'user1', tabMapSelected: 1, tabMapIdList: ['map1', 'map2', 'map3']},
                        {_id: 'user2', tabMapSelected: 0, tabMapIdList: ['map2']},
                        {_id: 'user3', tabMapSelected: 3, tabMapIdList: ['map3']},
                    ],
                    maps: [
                        {_id: 'map1'},
                        {_id: 'map2'},
                        {_id: 'map3'},
                    ],
                    shares: [
                        {_id: 'share1', shareUser: 'user1', sharedMap: "map1"},
                        {_id: 'share2', shareUser: 'user1', sharedMap: "map2"},
                        {_id: 'share3', shareUser: 'user2', sharedMap: "map2"},
                        {_id: 'share4', shareUser: 'user3', sharedMap: "map3"},
                    ]
                }
                break;
            }
        }
        await cUsers.insertMany(dbContent.users);
        await cMaps.insertMany(dbContent.maps);
        await cShares.insertMany(dbContent.shares);
        switch(cmd) {
            case 'deleteMapOne': {
                await MongoQueries.deleteMapOne(cUsers, cShares, 'map2', 'user1');
                break;
            }
            case 'deleteMapAll': {
                await MongoQueries.deleteMapAll(cUsers, cShares, 'map2');

                break;
            }
        }
        let result = {
            users: await cUsers.find().toArray(),
            maps: await cMaps.find().toArray(),
            shares: await cShares.find().toArray(),
        };
        console.log(JSON.stringify(result, null, 4))
    }
    catch (err) {
        console.log('error');
        console.log(err.stack);
    }
    client.close();
}

mongoTests('deleteMapOne');
// mongoTests('deleteMapAll');
