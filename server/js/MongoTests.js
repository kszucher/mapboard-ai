const MongoQueries = require("./MongoQueries");

const isEqual = (obj1, obj2) => {
    return JSON.stringify(obj1)===JSON.stringify(obj2)
}

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://admin:${encodeURIComponent('TNszfBws4@JQ8!t')}@cluster0.wbdxy.mongodb.net`;

let db, usersColl, mapsColl, sharesColl;
async function mongoTests(cmd) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, });
    try {
        await client.connect();
        db = client.db("app_dev_mongo")
        usersColl = db.collection("users");
        mapsColl = db.collection("maps");
        sharesColl = db.collection("shares");
        await usersColl.deleteMany();
        await mapsColl.deleteMany();
        await sharesColl.deleteMany();
        let dbContent;
        switch (cmd) {
            case 'deleteMapOne':
            case 'deleteMapAll':
            {
                dbContent = {
                    users: [
                        {_id: 'user1', breadcrumbMapIdList: ['map2'], tabMapSelected: 1, tabMapIdList: ['map1', 'map2', 'map3']},
                        {_id: 'user2', breadcrumbMapIdList: ['map2'], tabMapSelected: 0, tabMapIdList: ['map2']},
                        {_id: 'user3', breadcrumbMapIdList: ['map1'], tabMapSelected: 3, tabMapIdList: ['map3']},
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
        await usersColl.insertMany(dbContent.users);
        await mapsColl.insertMany(dbContent.maps);
        await sharesColl.insertMany(dbContent.shares);
        switch(cmd) {
            case 'deleteMapOne': {
                await MongoQueries.deleteMapOne(usersColl, sharesColl, 'map2', 'user1');
                break;
            }
            case 'deleteMapAll': {
                await MongoQueries.deleteMapAll(usersColl, sharesColl, 'map2');

                break;
            }
        }
        let result = {
            users: await usersColl.find().toArray(),
            maps: await mapsColl.find().toArray(),
            shares: await sharesColl.find().toArray(),
        };
        let resultExpected
        if (cmd === 'deleteMapOne') {
            resultExpected = {
                "users": [
                    { "_id": "user1", "breadcrumbMapIdList": ["map1"], "tabMapSelected": 0, "tabMapIdList": ["map1", "map3"] },
                    { "_id": "user2", "breadcrumbMapIdList": ["map2"], "tabMapSelected": 0, "tabMapIdList": ["map2"] },
                    { "_id": "user3", "breadcrumbMapIdList": ["map1"], "tabMapSelected": 3, "tabMapIdList": ["map3"] }
                ],
                "maps": [
                    { "_id": "map1" },
                    { "_id": "map2" },
                    { "_id": "map3" }
                ],
                "shares": [
                    { "_id": "share1", "shareUser": "user1", "sharedMap": "map1" },
                    { "_id": "share3", "shareUser": "user2", "sharedMap": "map2" },
                    { "_id": "share4", "shareUser": "user3", "sharedMap": "map3" }
                ]
            }
        }
        if (cmd === 'deleteMapAll') {
            resultExpected = {
                "users": [
                    { "_id": "user1", "breadcrumbMapIdList": ["map1"], "tabMapSelected": 0, "tabMapIdList": ["map1", "map3"] },
                    { "_id": "user2", "breadcrumbMapIdList": [null], "tabMapSelected": 0, "tabMapIdList": [] },
                    { "_id": "user3", "breadcrumbMapIdList": ["map1"], "tabMapSelected": 3, "tabMapIdList": ["map3"] }
                ],
                "maps": [
                    { "_id": "map1" },
                    { "_id": "map2" },
                    { "_id": "map3" }
                ],
                "shares": [
                    { "_id": "share1", "shareUser": "user1", "sharedMap": "map1" },
                    { "_id": "share4", "shareUser": "user3", "sharedMap": "map3" }
                ]
            }

        }
        // console.log(JSON.stringify(result, null, 4))
        if (isEqual(result, resultExpected)) {
            console.log(cmd, 'TEST PASSED')
        } else {
            console.log(cmd, 'TEST FAILED')
        }
    }
    catch (err) {
        console.log('error');
        console.log(err.stack);
    }
    client.close();
}

async function allTest () {
    await mongoTests('deleteMapOne');
    await mongoTests('deleteMapAll');
}

allTest()
