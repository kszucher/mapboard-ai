const MongoQueries = require("./MongoQueries");
const { mergeBase, mergeMutationA, mergeMutationB, mergeResult } = require('./MongoTestsMerge')
const { baseUri } = require('./MongoSecret')

const isEqual = (obj1, obj2) => {
  return JSON.stringify(obj1)===JSON.stringify(obj2)
}

const MongoClient = require('mongodb').MongoClient;

const getMultiMapMultiSource = (mapArray) => {
  const multiSource = { dataFrames: mapArray, dataHistory: mapArray }
  return { maps: [ { _id: 'map1', ...multiSource }, { _id: 'map2', ...multiSource } ] }
}

let db, users, maps, shares
async function mongoTests(cmd) {
  const client = new MongoClient(baseUri, { useNewUrlParser: true, useUnifiedTopology: true, });
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
    let argument
    let dbExpected
    switch (cmd) {
      case 'nameLookupTest': { // WARNING: depends on the structure of map: {m: {}, r:{}}
        dbOriginal = {
          users: [ {_id: 'user1', anyMapIdList: ['map1', 'map2', 'map4', 'map3'] } ],
          maps:  [
            { _id: 'map1', dataHistory: [ [ { }, { content: 'mapName1' } ] ] },
            { _id: 'map2', dataHistory: [ [ { }, { content: 'mapName2' } ] ] },
            { _id: 'map3', dataHistory: [ [ { }, { content: 'mapName3' } ] ] },
            { _id: 'map4', dataHistory: [ [ { }, { content: 'mapName4' } ] ] },
          ]
        }
        dbExpected = ['mapName1', 'mapName2', 'mapName4', 'mapName3']
        break
      }
      case 'getUserSharesTest': { // WARNING: depends on the structure of map: {m: {}, r:{}}
        dbOriginal = {
          users: [
            { _id: 'user1', email: 'user1@mail.com' },
            { _id: 'user2', email: 'user2@mail.com' },
          ],
          maps: [
            { _id: 'map1', dataHistory: [ [ { }, { content: 'mapName1' } ] ] },
            { _id: 'map2', dataHistory: [ [ { }, { content: 'mapName2' } ] ] },
            { _id: 'map3', dataHistory: [ [ { }, { content: 'mapName3' } ] ] },
            { _id: 'map4', dataHistory: [ [ { }, { content: 'mapName4' } ] ] },
          ],
          shares: [
            { _id: 'share1', access: 'view', status: 'accepted', ownerUser: 'user1', shareUser: 'user2', sharedMap: 'map1' },
            { _id: 'share2', access: 'edit', status: 'accepted', ownerUser: 'user1', shareUser: 'user2', sharedMap: 'map2' },
            { _id: 'share3', access: 'view', status: 'accepted', ownerUser: 'user2', shareUser: 'user1', sharedMap: 'map3' },
            { _id: 'share4', access: 'edit', status: 'accepted', ownerUser: 'user2', shareUser: 'user1', sharedMap: 'map4' }
          ]
        }
        dbExpected = {
          shareDataExport: [
            { _id: 'share1', access: 'view', status: 'accepted', shareUserEmail: 'user2@mail.com', sharedMapName: 'mapName1' },
            { _id: 'share2', access: 'edit', status: 'accepted', shareUserEmail: 'user2@mail.com', sharedMapName: 'mapName2' }
          ],
          shareDataImport: [
            { _id: 'share3', access: 'view', status: 'accepted', ownerUserEmail: 'user2@mail.com', sharedMapName: 'mapName3' },
            { _id: 'share4', access: 'edit', status: 'accepted', ownerUserEmail: 'user2@mail.com', sharedMapName: 'mapName4' }
          ]
        }
        break
      }
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
        dbOriginal = { shares: [ {_id: 'shareOther', ownerUser: 'ownerUser', shareUser: 'userOther', sharedMap: 'mapShared'} ] }
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
        dbOriginal = { maps: [ { _id: 'map1', dataFrames: ['f1', 'f2'], frameSelected: 1 } ] }
        dbExpected = { maps: [ { _id: 'map1', dataFrames: ['f1', 'f2'], frameSelected: 0 } ] }
        break
      }
      case 'openPrevFrameTest2': {
        dbOriginal = { maps: [ { _id: 'map1', dataFrames: ['f1', 'f2'], frameSelected: 0 } ] }
        dbExpected = { maps: [ { _id: 'map1', dataFrames: ['f1', 'f2'], frameSelected: 0 } ] }
        break
      }
      case 'openNextFrameTest1': {
        dbOriginal = { maps: [ { _id: 'map1', dataFrames: ['f1', 'f2'], frameSelected: 0 } ] }
        dbExpected = { maps: [ { _id: 'map1', dataFrames: ['f1', 'f2'], frameSelected: 1 } ] }
        break
      }
      case 'openNextFrameTest2': {
        dbOriginal = { maps: [ { _id: 'map1', dataFrames: ['f1', 'f2'], frameSelected: 1 } ] }
        dbExpected = { maps: [ { _id: 'map1', dataFrames: ['f1', 'f2'], frameSelected: 1 } ] }
        break
      }
      case 'importFrameTest': {
        dbOriginal = { maps: [ { _id: 'map1', dataHistory: [ ['o1', 'o2'] ], dataFrames: [['f1', 'f2']], frameSelected: 0 } ] }
        dbExpected = { maps: [ { _id: 'map1', dataHistory: [ ['o1', 'o2'] ], dataFrames: [['f1', 'f2'], ['o1', 'o2']], frameSelected: 1 } ] }
        break
      }
      case 'duplicateFrameTest': {
        dbOriginal = { maps: [ { _id: 'map1', dataFrames: [['fa', 'fa'], ['fb', 'fb'], ['fc', 'fc']], frameSelected: 1 } ] }
        dbExpected = { maps: [ { _id: 'map1', dataFrames: [['fa', 'fa'], ['fb', 'fb'], ['fb', 'fb'], ['fc', 'fc']], frameSelected: 2 } ] }
        break
      }
      case 'deleteFrameTest1':
        dbOriginal = { maps: [ {_id: 'map1', dataFrames: ['frame1', 'frame2', 'frame3'], frameSelected: 0 } ] }
        dbExpected = { maps: [ {_id: 'map1', dataFrames: ['frame2', 'frame3'], frameSelected: 0 } ] }
        break
      case 'deleteFrameTest2':
        dbOriginal = { maps: [ {_id: 'map1', dataFrames: ['frame1', 'frame2', 'frame3'], frameSelected: 1 } ] }
        dbExpected = { maps: [ {_id: 'map1', dataFrames: ['frame1', 'frame3'], frameSelected: 0 } ] }
        break
      case 'deleteFrameTest3':
        dbOriginal = { maps: [ {_id: 'map1', dataFrames: ['frame1', 'frame2', 'frame3'], frameSelected: 2 } ] }
        dbExpected = { maps: [ {_id: 'map1', dataFrames: ['frame1', 'frame2'], frameSelected: 1 } ] }
        break
      case 'deleteFrameTest4':
        dbOriginal = { maps: [ {_id: 'map1', dataFrames: ['frame1'], frameSelected: 0 } ] }
        dbExpected = { maps: [ {_id: 'map1', dataFrames: [], frameSelected: null } ] }
        break
      case 'mapMergeTest': {
        dbOriginal = { maps: [{ _id: 'map1', dataHistory: [ mergeBase, mergeMutationA ] }] }
        argument = mergeMutationB
        dbExpected= { maps: [{ _id: 'map1', dataHistory: [ mergeBase, mergeMutationA, mergeResult ] }] }
        break
      }
      case 'changeNodePropKeyTest': {
        dbOriginal = getMultiMapMultiSource( [ [ {a: 'o'} ], [ {a: 'o'}, {b: 'o'} ] ] )
        dbExpected = getMultiMapMultiSource( [ [ {aNew: 'o'} ], [ {aNew: 'o'}, {b: 'o'} ] ] )
        break
      }
      case 'changeNodePropValueTest': {
        dbOriginal = getMultiMapMultiSource( [ [ {a: 'o'} ], [ {a: 'o'}, {b: 'o'} ] ] )
        dbExpected = getMultiMapMultiSource( [ [ {a: 'm'} ], [ {a: 'm'}, {b: 'o'} ] ] )
        break
      }
      case 'createNodePropTest': {
        dbOriginal = getMultiMapMultiSource( [ [ {a: 'o'} ], [ {a: 'o'}, {b: 'o'} ] ] )
        dbExpected = getMultiMapMultiSource( [ [ {a: 'o', npc: 'nvc'} ], [ {a: 'o', npc: 'nvc'}, {b: 'o', npc: 'nvc'} ] ] )
        break
      }
      case 'removeNodePropTest': {
        dbOriginal = getMultiMapMultiSource( [ [ {a: 'o', npr: 'nvr'} ], [ {a: 'o', npr: 'nvr'}, {b: 'o', npr: 'nvr'} ] ] )
        dbExpected = getMultiMapMultiSource( [ [ {a: 'o'} ], [ {a: 'o'}, {b: 'o'} ] ] )
        break
      }
      case 'countNodesTest': {
        dbOriginal = getMultiMapMultiSource( [ [ {a: 'o', b: '0'} ], [ {a: 'o'}, {a: 'o', b: 'o', c: 'o'} ], [ {c: 'o'} ] ] )
        dbExpected = [{ _id: null, countPerAllMap: 16 }]
        break
      }
      case 'countNodesBasedOnNodePropExistenceTest': {
        dbOriginal = getMultiMapMultiSource( [ [ {a: 'o', b: '0'} ], [ {a: 'o'}, {a: 'o', b: 'o', c: 'o'} ], [ {c: 'o'} ] ] )
        dbExpected = [{ _id: null, countPerAllMap: 8 }]
        break
      }
      case 'deleteUnusedMapsTest': {
        dbOriginal = {
          users: [
            {_id: 'user1', tabMapIdList: ['map10', 'map20'] },
            {_id: 'user2', tabMapIdList: ['map30'] }
          ],
          maps:  [
            { _id: 'map10', path: ['map10'] },
            { _id: 'map11', path: ['map10', 'map11'] },
            { _id: 'map12', path: ['map10', 'map11', 'map12'] },
            { _id: 'map20', path: ['map20'] },
            { _id: 'map22', path: ['map20', 'map21', 'map22'] },
            { _id: 'map30', path: ['map30'] },
            { _id: 'map40', path: ['map40'] },
            { _id: 'map41', path: ['map40', 'map41'] },
          ]
        }
        dbExpected = {
          users: [
            {_id: 'user1', tabMapIdList: ['map10', 'map20'] } ,
            {_id: 'user2', tabMapIdList: ['map30'] }
          ],
          maps:  [
            { _id: 'map10', path: ['map10'] },
            { _id: 'map11', path: ['map10', 'map11'] },
            { _id: 'map12', path: ['map10', 'map11', 'map12'] },
            { _id: 'map20', path: ['map20'] },
            { _id: 'map30', path: ['map30'] },
          ]
        }
        break
      }
    }
    if(dbOriginal.hasOwnProperty('users')) {await users.insertMany(dbOriginal.users)}
    if(dbOriginal.hasOwnProperty('maps')) {await maps.insertMany(dbOriginal.maps)}
    if(dbOriginal.hasOwnProperty('shares')) {await shares.insertMany(dbOriginal.shares)}
    let result = {}
    switch(cmd) {
      case 'nameLookupTest': result = await MongoQueries.nameLookup(users, 'user1', 'anyMapIdList'); break
      case 'getUserSharesTest': result = await MongoQueries.getUserShares(shares, 'user1'); break
      case 'replaceBreadcrumbsTest': await MongoQueries.replaceBreadcrumbs(users, 'user1', 'mapNew' ); break
      case 'appendBreadcrumbsTest': await MongoQueries.appendBreadcrumbs(users, 'user1', 'mapNew' ); break
      case 'sliceBreadcrumbsTest': await MongoQueries.sliceBreadcrumbs(users, 'user1', 'map2' ); break
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
      case 'mapMergeTest': await MongoQueries.mergeMap(maps, 'map1', 'map', argument ); break
      case 'changeNodePropKeyTest':  await MongoQueries.changeNodePropKey(maps, 'a', 'aNew' ); break
      case 'changeNodePropValueTest':  await MongoQueries.changeNodePropValueConditionally(maps, 'a', 'o', 'm' ); break
      case 'createNodePropTest':  await MongoQueries.createNodeProp(maps, 'npc', 'nvc' ); break
      case 'removeNodePropTest':  await MongoQueries.removeNodeProp(maps, 'npr' ); break
      case 'countNodesTest': result = await MongoQueries.countNodes(maps); break
      case 'countNodesBasedOnNodePropExistenceTest': result = await MongoQueries.countNodesBasedOnNodePropExistence( maps, 'c' ); break
      case 'deleteUnusedMapsTest': await MongoQueries.deleteUnusedMaps(users, maps); break
    }
    if ([
      'nameLookupTest',
      'getUserSharesTest',
      'countNodesTest',
      'countNodesBasedOnNodePropExistenceTest'
    ].includes(cmd)) {
    } else {
      if (dbOriginal.hasOwnProperty('users')) { result.users = await users.find().toArray() }
      if (dbOriginal.hasOwnProperty('maps')) { result.maps = await maps.find().toArray() }
      if (dbOriginal.hasOwnProperty('shares')) { result.shares = await shares.find().toArray() }
    }
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
  // await mongoTests('nameLookupTest')
  // await mongoTests('getUserSharesTest')
  // await mongoTests('replaceBreadcrumbsTest')
  // await mongoTests('appendBreadcrumbsTest')
  // await mongoTests('sliceBreadcrumbsTest')
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
  // await mongoTests('mapMergeTest')
  // await mongoTests('changeNodePropKeyTest')
  // await mongoTests('changeNodePropValueTest')
  // await mongoTests('createNodePropTest')
  // await mongoTests('removeNodePropTest')
  // await mongoTests('countNodesTest')
  // await mongoTests('countNodesBasedOnNodePropExistenceTest')
  // await mongoTests('deleteUnusedMapsTest')
}

allTest()
