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
        let dbContent;
        switch (cmd) {
            case 'deleteMapOne':
            case 'deleteMapAll':
                dbContent = {
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
                break
            case 'deleteFrameTest1': dbContent = {
                maps: [ {_id: 'map1', dataPlayback: ['frame1', 'frame2', 'frame3'], frameSelected: 0 } ] }; break
            case 'deleteFrameTest2': dbContent = {
                maps: [ {_id: 'map1', dataPlayback: ['frame1', 'frame2', 'frame3'], frameSelected: 1 } ] }; break
            case 'deleteFrameTest3': dbContent = {
                maps: [ {_id: 'map1', dataPlayback: ['frame1', 'frame2', 'frame3'], frameSelected: 2 } ] }; break
            case 'deleteFrameTest4': dbContent = {
                maps: [ {_id: 'map1', dataPlayback: ['frame1'], frameSelected: 0 } ] }; break
        }
        if(dbContent.hasOwnProperty('users')) {await users.insertMany(dbContent.users)}
        if(dbContent.hasOwnProperty('maps')) {await maps.insertMany(dbContent.maps)}
        if(dbContent.hasOwnProperty('shares')) {await shares.insertMany(dbContent.shares)}
        switch(cmd) {
            case 'deleteMapOne': await MongoQueries.deleteMapOne(users, shares, 'map2', 'user1'); break
            case 'deleteMapAll': await MongoQueries.deleteMapAll(users, shares, 'map2'); break
            case 'deleteFrameTest1':  await MongoQueries.deleteFrame(maps, 'map1'); break
            case 'deleteFrameTest2':  await MongoQueries.deleteFrame(maps, 'map1'); break
            case 'deleteFrameTest3':  await MongoQueries.deleteFrame(maps, 'map1'); break
            case 'deleteFrameTest4':  await MongoQueries.deleteFrame(maps, 'map1'); break
        }
        let result = {}
        if (dbContent.hasOwnProperty('users')) { result.users = await users.find().toArray() }
        if (dbContent.hasOwnProperty('maps')) { result.maps = await maps.find().toArray() }
        if (dbContent.hasOwnProperty('shares')) { result.shares = await shares.find().toArray() }
        let resultExpected = {}
        switch (cmd) {
            case 'deleteMapOne':
                resultExpected = {
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
                resultExpected = {
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
            case 'deleteFrameTest1': resultExpected = {
                maps: [ {_id: 'map1', dataPlayback: ['frame2', 'frame3'], frameSelected: 0 } ] }; break
            case 'deleteFrameTest2': resultExpected = {
                maps: [ {_id: 'map1', dataPlayback: ['frame1', 'frame3'], frameSelected: 0 } ] }; break
            case 'deleteFrameTest3': resultExpected = {
                maps: [ {_id: 'map1', dataPlayback: ['frame1', 'frame2'], frameSelected: 1 } ] }; break
            case 'deleteFrameTest4': resultExpected = {
                maps: [ {_id: 'map1', dataPlayback: [], frameSelected: null } ] }; break
        }
        if (isEqual(result, resultExpected)) {
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
    await mongoTests('deleteMapOne')
    await mongoTests('deleteMapAll')
    await mongoTests('deleteFrameTest1')
    await mongoTests('deleteFrameTest2')
    await mongoTests('deleteFrameTest3')
    await mongoTests('deleteFrameTest4')
}

allTest()
