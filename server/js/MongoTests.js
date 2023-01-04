const MongoQueries = require("./MongoQueries");
const MongoMutations = require("./MongoMutations");

const { mergeBase, mergeMutationA, mergeMutationB, mergeResult } = require('./MongoTestsMerge')
const { baseUri } = require('./MongoSecret')
const MongoClient = require('mongodb').MongoClient;

const isEqual = (obj1, obj2) => {
  return JSON.stringify(obj1)===JSON.stringify(obj2)
}

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
      case 'countNodesTest': {
        dbOriginal = getMultiMapMultiSource( [ [ {a: 'o', b: '0'} ], [ {a: 'o'}, {a: 'o', b: 'o', c: 'o'} ], [ {c: 'o'} ] ] )
        dbExpected = [{ _id: null, result: 16 }]
        break
      }
      case 'countNodesBasedOnNodePropExistenceTest': {
        dbOriginal = getMultiMapMultiSource( [
          [ {a: 'o'} ],
          [ {a: 'o'}, {b: 'o'}, {a: 'o', b: 'o'} ],
          [ {b: 'o'} ]
        ] )
        dbExpected = [{ _id: null, result: 12 }]
        break
      }
      case 'countNodesBasedOnNodePropValueTest': {
        dbOriginal = getMultiMapMultiSource( [
          [ {a: 'o'} ],
          [ {a: 'o'}, {b: 'x'}, {a: 'o', b: 'x'} ],
          [ {b: 'o'} ]
        ] )
        dbExpected = [{ _id: null, result: 8 }]
        break
      }
      case 'findDeadLinksTest': {
        dbOriginal = {
          maps:  [
            { _id: 'map10', dataHistory: [
                [
                  {},
                  {content: 'map10name'},
                  {linkType: 'internal', link: 'map11', content: 'map11link'},
                  {linkType: 'internal', link: 'map12', content: 'map12link'},
                  {linkType: 'internal', link: 'map12', content: 'map13link'}
                ],
                [
                  {},
                  {content: 'map10name'},
                  {linkType: 'internal', link: 'map11', content: 'map11link'},
                  {linkType: 'internal', link: 'map12', content: 'map12link'},
                  {linkType: 'internal', link: 'map12', content: 'map13link'}
                ],
              ], dataFrames: [[]]
            },
            { _id: 'map11', dataHistory: [
                [
                  {},
                  {content: 'map11name'},
                  {linkType: 'internal', link: 'map111', content: 'map111link'}
                ]
              ], dataFrames: [[]]
            }
          ]
        }
        dbExpected = [
          {
            mapId: "map10",
            info: [
              { mapContent: "map10name", nodeContent: "map12link" },
              { mapContent: "map10name", nodeContent: "map13link" }
            ]
          },
          {
            mapId: "map11",
            info: [
              { mapContent: "map11name", nodeContent: "map111link" }
            ]
          }
        ]
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
      case 'createNodePropTest': {
        dbOriginal = getMultiMapMultiSource( [ [ {a: 'o'} ], [ {a: 'o'}, {b: 'o'} ] ] )
        dbExpected = getMultiMapMultiSource( [ [ {a: 'o', npc: 'nvc'} ], [ {a: 'o', npc: 'nvc'}, {b: 'o', npc: 'nvc'} ] ] )
        break
      }
      case 'createNodePropIfMissingTest': {
        dbOriginal = getMultiMapMultiSource( [ [ {} ], [ {}, {a: 'o'} ] ] )
        dbExpected = getMultiMapMultiSource( [ [ {b: 'x'} ], [ {b: 'x'}, {a: 'o', b: 'x'} ] ] )
        break
      }
      case 'updateNodePropKeyTest': {
        dbOriginal = getMultiMapMultiSource( [ [ {a: 'o'} ], [ {a: 'o'}, {b: 'o'} ] ] )
        dbExpected = getMultiMapMultiSource( [ [ {aNew: 'o'} ], [ {aNew: 'o'}, {b: 'o'} ] ] )
        break
      }
      case 'updateNodePropValueBasedOnPreviousValueTest': {
        dbOriginal = getMultiMapMultiSource( [ [ {a: 'o'} ], [ {a: 'o'}, {b: 'o'} ] ] )
        dbExpected = getMultiMapMultiSource( [ [ {a: 'x'} ], [ {a: 'x'}, {b: 'o'} ] ] )
        break
      }
      case 'removeNodePropTest': {
        dbOriginal = getMultiMapMultiSource( [ [ {a: 'o', npr: 'nvr'} ], [ {a: 'o', npr: 'nvr'}, {b: 'o', npr: 'nvr'} ] ] )
        dbExpected = getMultiMapMultiSource( [ [ {a: 'o'} ], [ {a: 'o'}, {b: 'o'} ] ] )
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
      case 'countNodesTest': result = await MongoQueries.countNodes(maps); break
      case 'countNodesBasedOnNodePropExistenceTest': result = await MongoQueries.countNodesBasedOnNodePropExistence( maps, 'b' ); break
      case 'countNodesBasedOnNodePropValueTest': result = await MongoQueries.countNodesBasedOnNodePropValue( maps, 'b', 'x' ); break
      case 'findDeadLinksTest': result = await MongoQueries.findDeadLinks(maps); break
      case 'replaceBreadcrumbsTest': await MongoMutations.replaceBreadcrumbs(users, 'user1', 'mapNew' ); break
      case 'appendBreadcrumbsTest': await MongoMutations.appendBreadcrumbs(users, 'user1', 'mapNew' ); break
      case 'sliceBreadcrumbsTest': await MongoMutations.sliceBreadcrumbs(users, 'user1', 'map2' ); break
      case 'deleteMapFromUsersTest': await MongoMutations.deleteMapFromUsers(users, { tabMapIdList: 'mapShared'} ); break
      case 'deleteMapFromSharesTest': await MongoMutations.deleteMapFromShares(shares, { sharedMap: 'mapShared'} ); break
      case 'moveUpMapInTabTest1': await MongoMutations.moveUpMapInTab(users, 'user1', 'mapMove'); break
      case 'moveUpMapInTabTest2': await MongoMutations.moveUpMapInTab(users, 'user1', 'mapMove'); break
      case 'moveDownMapInTabTest1': await MongoMutations.moveDownMapInTab(users, 'user1', 'mapMove'); break
      case 'moveDownMapInTabTest2': await MongoMutations.moveDownMapInTab(users, 'user1', 'mapMove'); break
      case 'openPrevFrameTest1': await MongoMutations.openPrevFrame(maps, 'map1'); break
      case 'openPrevFrameTest2': await MongoMutations.openPrevFrame(maps, 'map1'); break
      case 'openNextFrameTest1': await MongoMutations.openNextFrame(maps, 'map1'); break
      case 'openNextFrameTest2': await MongoMutations.openNextFrame(maps, 'map1'); break
      case 'importFrameTest': await MongoMutations.importFrame(maps, 'map1'); break
      case 'duplicateFrameTest': await MongoMutations.duplicateFrame(maps, 'map1'); break
      case 'deleteFrameTest1':  await MongoMutations.deleteFrame(maps, 'map1'); break
      case 'deleteFrameTest2':  await MongoMutations.deleteFrame(maps, 'map1'); break
      case 'deleteFrameTest3':  await MongoMutations.deleteFrame(maps, 'map1'); break
      case 'deleteFrameTest4':  await MongoMutations.deleteFrame(maps, 'map1'); break
      case 'mapMergeTest': await MongoMutations.mergeMap(maps, 'map1', 'map', argument ); break
      case 'createNodePropTest':  await MongoMutations.createNodeProp(maps, 'npc', 'nvc' ); break
      case 'createNodePropIfMissingTest':  await MongoMutations.createNodePropIfMissing(maps, 'b', 'x' ); break
      case 'updateNodePropKeyTest':  await MongoMutations.updateNodePropKey(maps, 'a', 'aNew' ); break
      case 'updateNodePropValueBasedOnPreviousValueTest':  await MongoMutations.updateNodePropValueBasedOnPreviousValue(maps, 'a', 'o', 'x' ); break
      case 'removeNodePropTest':  await MongoMutations.removeNodeProp(maps, 'npr' ); break
      case 'deleteUnusedMapsTest': await MongoMutations.deleteUnusedMaps(users, maps); break
    }
    if ([
      'nameLookupTest',
      'getUserSharesTest',
      'countNodesTest',
      'countNodesBasedOnNodePropExistenceTest',
      'countNodesBasedOnNodePropValueTest',
      'findDeadLinksTest'
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
  // await mongoTests('countNodesTest')
  // await mongoTests('countNodesBasedOnNodePropExistenceTest')
  // await mongoTests('countNodesBasedOnNodePropValueTest')
  // await mongoTests('findDeadLinksTest')
  // await mongoTests('replaceBreadcrumbsTest')
  // await mongoTests('appendBreadcrumbsTest')
  // await mongoTests('sliceBreadcrumbsTest')
  // TODO: appendTabsReplaceBreadcrumbsTest
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
  // await mongoTests('createNodePropTest')
  // await mongoTests('createNodePropIfMissingTest')
  // await mongoTests('updateNodePropKeyTest')
  // await mongoTests('updateNodePropValueBasedOnPreviousValueTest')
  // await mongoTests('removeNodePropTest')
  // await mongoTests('deleteUnusedMapsTest')
}

allTest()
