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
            case 'replaceBreadcrumbsTest': {
                dbOriginal = { users: [ {_id: 'user1', breadcrumbMapIdList: ['map1', 'map2', 'map3'] } ] }
                dbExpected = { users: [ {_id: 'user1', breadcrumbMapIdList: ['mapNew'] } ] }
                break
            }
            case 'appendBreadcrumbsTest': {
                dbOriginal = { users: [ {_id: 'user1', breadcrumbMapIdList: ['map1', 'map2', 'map3'] } ] }
                dbExpected = { users: [ {_id: 'user1', breadcrumbMapIdList: ['map1', 'map2', 'map3', 'mapNew'] } ] }
                break
            }
            case 'sliceBreadcrumbsTest': {
                dbOriginal = { users: [ {_id: 'user1', breadcrumbMapIdList: ['map1', 'map2', 'map3', 'map4'] } ] }
                dbExpected = { users: [ {_id: 'user1', breadcrumbMapIdList: ['map1', 'map2'] } ] }
                break
            }
            case 'deleteMapFromUsersTest':
                dbOriginal = {
                    users: [
                        {_id: 'user1', breadcrumbMapIdList: ['map1'], tabMapIdList: ['map1', 'mapShared']},
                        {_id: 'user2', breadcrumbMapIdList: ['mapShared'], tabMapIdList: ['map1', 'mapShared']},
                        {_id: 'user3', breadcrumbMapIdList: ['mapShared'], tabMapIdList: ['mapShared']},
                    ],
                }
                dbExpected = {
                    users: [
                        { _id: 'user1', breadcrumbMapIdList: ['map1'], tabMapIdList: ['map1'] },
                        { _id: 'user2', breadcrumbMapIdList: ['map1'], tabMapIdList: ['map1'] },
                        { _id: 'user3', breadcrumbMapIdList: [], tabMapIdList: [] },
                    ],
                }
                break
            case 'deleteMapFromSharesTest': {
                dbOriginal = { shares: [{_id: 'shareOther', ownerUser: 'ownerUser', shareUser: 'userOther', sharedMap: 'mapShared'} ] }
                dbExpected = { shares: [] }
                break
            }
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
            case 'openPrevFrameTest1': {
                dbOriginal = { maps: [ { _id: 'map1', dataPlayback: ['f1', 'f2'], frameSelected: 1 } ] }
                dbExpected = { maps: [ { _id: 'map1', dataPlayback: ['f1', 'f2'], frameSelected: 0 } ] }
                break
            }
            case 'openPrevFrameTest2': {
                dbOriginal = { maps: [ { _id: 'map1', dataPlayback: ['f1', 'f2'], frameSelected: 0 } ] }
                dbExpected = { maps: [ { _id: 'map1', dataPlayback: ['f1', 'f2'], frameSelected: 0 } ] }
                break
            }
            case 'openNextFrameTest1': {
                dbOriginal = { maps: [ { _id: 'map1', dataPlayback: ['f1', 'f2'], frameSelected: 0 } ] }
                dbExpected = { maps: [ { _id: 'map1', dataPlayback: ['f1', 'f2'], frameSelected: 1 } ] }
                break
            }
            case 'openNextFrameTest2': {
                dbOriginal = { maps: [ { _id: 'map1', dataPlayback: ['f1', 'f2'], frameSelected: 1 } ] }
                dbExpected = { maps: [ { _id: 'map1', dataPlayback: ['f1', 'f2'], frameSelected: 1 } ] }
                break
            }
            case 'importFrameTest': {
                dbOriginal = { maps: [ { _id: 'map1', data: ['o1', 'o2'], dataPlayback: [['f1', 'f2']], frameSelected: 0 } ] }
                dbExpected = { maps: [ { _id: 'map1', data: ['o1', 'o2'], dataPlayback: [['f1', 'f2'], ['o1', 'o2']], frameSelected: 1 } ] }
                break
            }
            case 'duplicateFrameTest': {
                dbOriginal = { maps: [ { _id: 'map1', dataPlayback: [['fa', 'fa'], ['fb', 'fb'], ['fc', 'fc']], frameSelected: 1 } ] }
                dbExpected = { maps: [ { _id: 'map1', dataPlayback: [['fa', 'fa'], ['fb', 'fb'], ['fb', 'fb'], ['fc', 'fc']], frameSelected: 2 } ] }
                break
            }
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
        }
        if(dbOriginal.hasOwnProperty('users')) {await users.insertMany(dbOriginal.users)}
        if(dbOriginal.hasOwnProperty('maps')) {await maps.insertMany(dbOriginal.maps)}
        if(dbOriginal.hasOwnProperty('shares')) {await shares.insertMany(dbOriginal.shares)}
        switch(cmd) {
            case 'replaceBreadcrumbsTest': await MongoQueries.replaceBreadcrumbs(users, 'user1', 'mapNew' ); break
            case 'appendBreadcrumbsTest': await MongoQueries.appendBreadcrumbs(users, 'user1', 'mapNew' ); break
            case 'sliceBreadcrumbsTest': await MongoQueries.sliceBreadcrumbs(users, 'user1', 1 ); break
            case 'deleteMapFromUsersTest': await MongoQueries.deleteMapFromUsers(users, { tabMapIdList: 'mapShared'} ); break
            case 'deleteMapFromSharesTest': await MongoQueries.deleteMapFromShares(shares, { sharedMap: 'mapShared'} ); break
            case 'moveUpMapInTabTest1': await MongoQueries.moveUpMapInTab(users, 'user1', 'mapMove'); break
            case 'moveUpMapInTabTest2': await MongoQueries.moveUpMapInTab(users, 'user1', 'mapMove'); break
            case 'moveDownMapInTabTest1': await MongoQueries.moveDownMapInTab(users, 'user1', 'mapMove'); break
            case 'moveDownMapInTabTest2': await MongoQueries.moveDownMapInTab(users, 'user1', 'mapMove'); break
            case 'openPrevFrameTest1': await MongoQueries.openPrevFrame(maps, 'map1'); break
            case 'openPrevFrameTest2': await MongoQueries.openPrevFrame(maps, 'map1'); break
            case 'openNextFrameTest1': await MongoQueries.openNextFrame(maps, 'map1'); break
            case 'openNextFrameTest2': await MongoQueries.openNextFrame(maps, 'map1'); break
            case 'importFrameTest': await MongoQueries.importFrame(maps, 'map1'); break
            case 'duplicateFrameTest': await MongoQueries.duplicateFrame(maps, 'map1'); break
            case 'deleteFrameTest1':  await MongoQueries.deleteFrame(maps, 'map1'); break
            case 'deleteFrameTest2':  await MongoQueries.deleteFrame(maps, 'map1'); break
            case 'deleteFrameTest3':  await MongoQueries.deleteFrame(maps, 'map1'); break
            case 'deleteFrameTest4':  await MongoQueries.deleteFrame(maps, 'map1'); break
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

    await mongoTests('replaceBreadcrumbsTest')
    await mongoTests('appendBreadcrumbsTest')
    await mongoTests('sliceBreadcrumbsTest')

    // await mongoTests('deleteMapFromUsersTest')
    // await mongoTests('deleteMapFromSharesTest')

    // await mongoTests('moveUpMapInTabTest1')
    // await mongoTests('moveUpMapInTabTest2')
    // await mongoTests('moveDownMapInTabTest1')
    // await mongoTests('moveDownMapInTabTest2')


    // await mongoTests('openPrevFrameTest1')
    // await mongoTests('openPrevFrameTest2')
    // await mongoTests('openNextFrameTest1')
    // await mongoTests('openNextFrameTest2')

    // await mongoTests('importFrameTest')

    // await mongoTests('duplicateFrameTest')

    // await mongoTests('deleteFrameTest1')
    // await mongoTests('deleteFrameTest2')
    // await mongoTests('deleteFrameTest3')
    // await mongoTests('deleteFrameTest4')
}

allTest()
