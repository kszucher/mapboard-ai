const MongoQueries = require("./MongoQueries");

const isEqual = (obj1, obj2) => {
    return JSON.stringify(obj1)===JSON.stringify(obj2)
}

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://admin:${encodeURIComponent('TNszfBws4@JQ8!t')}@cluster0.wbdxy.mongodb.net`;

let db, users, maps, shares
async function mongoTests(cmd) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, });
    try {
        await client.connect();
        db = client.db("app_dev_mongo")
        users = db.collection("users")
        maps = db.collection("maps")
        shares = db.collection("shares")
        await users.deleteMany({})
        await maps.deleteMany({})
        await shares.deleteMany({})
        let dbOriginal
        let dbExpected
        switch (cmd) {
            case 'deleteMapOne':
                dbOriginal = {
                    users: [
                        {_id: 'user1', breadcrumbMapIdList: ['map2'], tabMapIdList: ['map1', 'map2', 'map3']},
                        {_id: 'user2', breadcrumbMapIdList: ['map2'], tabMapIdList: ['map2']},
                        {_id: 'user3', breadcrumbMapIdList: ['map1'], tabMapIdList: ['map3']},
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
                dbExpected = {
                    "users": [
                        { "_id": "user1", "breadcrumbMapIdList": ["map1"], "tabMapIdList": ["map1", "map3"] },
                        { "_id": "user2", "breadcrumbMapIdList": ["map2"], "tabMapIdList": ["map2"] },
                        { "_id": "user3", "breadcrumbMapIdList": ["map1"], "tabMapIdList": ["map3"] }
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
                break
            case 'deleteMapAll':
                dbOriginal = {
                    users: [
                        {_id: 'user1', breadcrumbMapIdList: ['map2'], tabMapIdList: ['map1', 'map2', 'map3']},
                        {_id: 'user2', breadcrumbMapIdList: ['map2'], tabMapIdList: ['map2']},
                        {_id: 'user3', breadcrumbMapIdList: ['map1'], tabMapIdList: ['map3']},
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
                dbExpected = {
                    "users": [
                        { "_id": "user1", "breadcrumbMapIdList": ["map1"], "tabMapIdList": ["map1", "map3"] },
                        { "_id": "user2", "breadcrumbMapIdList": [], "tabMapIdList": [] },
                        { "_id": "user3", "breadcrumbMapIdList": ["map1"], "tabMapIdList": ["map3"] }
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
                break
            case 'deleteFrameTest1':
                dbOriginal = { maps: [ {_id: 'map1', dataPlayback: ['frame1', 'frame2', 'frame3'], frameSelected: 0 } ] }
                dbExpected = { maps: [ {_id: 'map1', dataPlayback: ['frame2', 'frame3'], frameSelected: 0 } ] }
                break
            case 'deleteFrameTest2':
                dbOriginal = { maps: [ {_id: 'map1', dataPlayback: ['frame1', 'frame2', 'frame3'], frameSelected: 1 } ] }
                dbExpected = { maps: [ {_id: 'map1', dataPlayback: ['frame1', 'frame3'], frameSelected: 0 } ] }
                break
            case 'deleteFrameTest3':
                dbOriginal = { maps: [ {_id: 'map1', dataPlayback: ['frame1', 'frame2', 'frame3'], frameSelected: 2 } ] }
                dbExpected = { maps: [ {_id: 'map1', dataPlayback: ['frame1', 'frame2'], frameSelected: 1 } ] }
                break
            case 'deleteFrameTest4':
                dbOriginal = { maps: [ {_id: 'map1', dataPlayback: ['frame1'], frameSelected: 0 } ] }
                dbExpected = { maps: [ {_id: 'map1', dataPlayback: [], frameSelected: null } ] }
                break
            case 'moveUpMapInTabTest1':
                dbOriginal = { users: [ {_id: 'user1', tabMapIdList: ['mapKeep1', 'mapMove', 'mapKeep2'] } ] }
                dbExpected = { users: [ {_id: 'user1', tabMapIdList: ['mapMove', 'mapKeep1', 'mapKeep2'] } ] }
                break
            case 'moveUpMapInTabTest2':
                dbOriginal = { users: [ {_id: 'user1', tabMapIdList: ['mapMove', 'mapKeep1', 'mapKeep2'] } ] }
                dbExpected = { users: [ {_id: 'user1', tabMapIdList: ['mapMove', 'mapKeep1', 'mapKeep2'] } ] }
                break
            case 'moveDownMapInTabTest1':
                dbOriginal = { users: [ {_id: 'user1', tabMapIdList: ['mapKeep1', 'mapMove', 'mapKeep2'] } ] }
                dbExpected = { users: [ {_id: 'user1', tabMapIdList: ['mapKeep1', 'mapKeep2', 'mapMove'] } ] }
                break
            case 'moveDownMapInTabTest2':
                dbOriginal = { users: [ {_id: 'user1', tabMapIdList: ['mapKeep1', 'mapKeep2', 'mapMove'] } ] }
                dbExpected = { users: [ {_id: 'user1', tabMapIdList: ['mapKeep1', 'mapKeep2', 'mapMove'] } ] }
                break
        }
        if(dbOriginal.hasOwnProperty('users')) {await users.insertMany(dbOriginal.users)}
        if(dbOriginal.hasOwnProperty('maps')) {await maps.insertMany(dbOriginal.maps)}
        if(dbOriginal.hasOwnProperty('shares')) {await shares.insertMany(dbOriginal.shares)}
        switch(cmd) {
            case 'deleteMapOne': await MongoQueries.deleteMapOne(users, shares, 'map2', 'user1'); break
            case 'deleteMapAll': await MongoQueries.deleteMapAll(users, shares, 'map2'); break
            case 'deleteFrameTest1':  await MongoQueries.deleteFrame(maps, 'map1'); break
            case 'deleteFrameTest2':  await MongoQueries.deleteFrame(maps, 'map1'); break
            case 'deleteFrameTest3':  await MongoQueries.deleteFrame(maps, 'map1'); break
            case 'deleteFrameTest4':  await MongoQueries.deleteFrame(maps, 'map1'); break
            case 'moveUpMapInTabTest1': await MongoQueries.moveUpMapInTab(users, 'user1', 'mapMove'); break
            case 'moveUpMapInTabTest2': await MongoQueries.moveUpMapInTab(users, 'user1', 'mapMove'); break
            case 'moveDownMapInTabTest1': await MongoQueries.moveDownMapInTab(users, 'user1', 'mapMove'); break
            case 'moveDownMapInTabTest2': await MongoQueries.moveDownMapInTab(users, 'user1', 'mapMove'); break
        }
        let result = {}
        if (dbOriginal.hasOwnProperty('users')) { result.users = await users.find().toArray() }
        if (dbOriginal.hasOwnProperty('maps')) { result.maps = await maps.find().toArray() }
        if (dbOriginal.hasOwnProperty('shares')) { result.shares = await shares.find().toArray() }
        if (isEqual(result, dbExpected)) {
            console.log(cmd, 'TEST PASSED')
        } else {
            console.log(cmd, 'TEST FAILED')
            console.log(JSON.stringify(result, null, 4))
        }
    }
    catch (err) {
        console.log('error');
        console.log(err.stack);
    }
    client.close();
}

async function allTest () {
    // await mongoTests('deleteMapOne')
    // await mongoTests('deleteMapAll')
    // await mongoTests('deleteFrameTest1')
    // await mongoTests('deleteFrameTest2')
    // await mongoTests('deleteFrameTest3')
    // await mongoTests('deleteFrameTest4')
    await mongoTests('moveUpMapInTabTest1')
    await mongoTests('moveUpMapInTabTest2')
    await mongoTests('moveDownMapInTabTest1')
    await mongoTests('moveDownMapInTabTest2')
}

allTest()
