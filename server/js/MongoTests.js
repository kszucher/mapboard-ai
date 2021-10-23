const MongoQueries = require("./MongoQueries");

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mindboard-server:3%21q.FkpzkJPTM-Q@cluster0-sg0ny.mongodb.net/test?retryWrites=true&w=majority";
const ObjectId = require('mongodb').ObjectId;

let db, collectionUsers, collectionMaps, collectionShares;
async function mongoTests(cmd) {
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
            case 'deleteMapFromUsersFromSharesOne':
            case 'deleteMapFromUsersFromSharesMany':
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
        await collectionUsers.insertMany(dbContent.users);
        await collectionMaps.insertMany(dbContent.maps);
        await collectionShares.insertMany(dbContent.shares);
        switch(cmd) {
            case 'deleteMapFromUsersFromSharesOne': {
                await MongoQueries.deleteMapFromUsers(collectionUsers, 'map2', {_id: 'user2'});
                await MongoQueries.deleteMapFromShares(collectionShares, 'map2', {shareUser: 'user2'});
                break;
            }
            case 'deleteMapFromUsersFromSharesMany': {
                await MongoQueries.deleteMapFromUsers(collectionUsers, 'map2');
                await MongoQueries.deleteMapFromShares(collectionShares, 'map2');
                break;
            }
        }
        let result = {
            users: await collectionUsers.find().toArray(),
            maps: await collectionMaps.find().toArray(),
            shares: await collectionShares.find().toArray(),
        };
        console.log(JSON.stringify(result, null, 4))
    }
    catch (err) {
        console.log('error');
        console.log(err.stack);
    }
    client.close();
}

mongoTests('deleteMapFromUsersFromSharesOne');
// mongoTests('deleteMapFromUsersFromSharesMany');
