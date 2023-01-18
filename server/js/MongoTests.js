const MongoQueries = require("./MongoQueries");
const MongoMutations = require("./MongoMutations");
const MongoMutationsSaveMap = require("./MongoMutationsSaveMap");


const { mergeBase, mergeMutationA, mergeMutationB, mergeResult } = require('./MongoTestsSave')
const { baseUri } = require('./MongoSecret')
const MongoClient = require('mongodb').MongoClient;

const isEqual = (obj1, obj2) => {
  return JSON.stringify(obj1)===JSON.stringify(obj2)
}

const getMultiMapMultiSource = (mapArray) => {
  const multiSource = { dataFrames: mapArray, dataHistory: mapArray }
  return { maps: [ { _id: 'map1', ...multiSource }, { _id: 'map2', ...multiSource } ] }
}

const getUserWithSelection = () => ({ users: [ { _id: 'user1', mapSelected: 'map1', dataFrameSelected: 0 } ] })

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
    let dbExpected
    switch (cmd) {
      case 'nameLookup.test': {
        dbOriginal = {
          users: [ {_id: 'user1', anyMapIdList: ['map1', 'map2', 'map4', 'map3'] } ],
          maps:  [
            { _id: 'map1', dataHistory: [ [ { }, { content: 'mapName1', path: ['r', 0] } ] ] },
            { _id: 'map2', dataHistory: [ [ { }, { content: 'mapName2', path: ['r', 0] } ] ] },
            { _id: 'map3', dataHistory: [ [ { }, { content: 'mapName3', path: ['r', 0] } ] ] },
            { _id: 'map4', dataHistory: [ [ { }, { content: 'mapName4', path: ['r', 0] } ] ] },
          ]
        }
        dbExpected = ['mapName1', 'mapName2', 'mapName4', 'mapName3']
        break
      }
      case 'getUserShares.test': {
        dbOriginal = {
          users: [
            { _id: 'user1', email: 'user1@mail.com' },
            { _id: 'user2', email: 'user2@mail.com' },
          ],
          maps: [
            { _id: 'map1', dataHistory: [ [ { }, { content: 'mapName1', path: ['r', 0] } ] ] },
            { _id: 'map2', dataHistory: [ [ { }, { content: 'mapName2', path: ['r', 0] } ] ] },
            { _id: 'map3', dataHistory: [ [ { }, { content: 'mapName3', path: ['r', 0] } ] ] },
            { _id: 'map4', dataHistory: [ [ { }, { content: 'mapName4', path: ['r', 0] } ] ] },
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
      case 'countNodes.test': {
        dbOriginal = getMultiMapMultiSource( [ [ {a: 'o', b: '0'} ], [ {a: 'o'}, {a: 'o', b: 'o', c: 'o'} ], [ {c: 'o'} ] ] )
        dbExpected = [{ _id: null, result: 16 }]
        break
      }
      case 'countNodesBasedOnNodePropExistence.test': {
        dbOriginal = getMultiMapMultiSource( [
          [ {a: 'o'} ],
          [ {a: 'o'}, {b: 'o'}, {a: 'o', b: 'o'} ],
          [ {b: 'o'} ]
        ] )
        dbExpected = [{ _id: null, result: 12 }]
        break
      }
      case 'countNodesBasedOnNodePropValue.test': {
        dbOriginal = getMultiMapMultiSource( [
          [ {a: 'o'} ],
          [ {a: 'o'}, {b: 'x'}, {a: 'o', b: 'x'} ],
          [ {b: 'o'} ]
        ] )
        dbExpected = [{ _id: null, result: 8 }]
        break
      }
      case 'findDeadLinks.test': {
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

      case 'selectFirstMapFrame.test': {
        dbOriginal = { users: [ {_id: 'user1', mapSelected: 'map1', dataFrameSelected: -1 } ], maps: [ { _id: 'map1', dataFrames: ['f1', 'f2'] } ] }
        dbExpected = { users: [ {_id: 'user1', mapSelected: 'map1', dataFrameSelected: 0 } ], maps: [ { _id: 'map1', dataFrames: ['f1', 'f2'] } ] }
        break
      }
      case 'selectPrevMapFrame.test1': {
        dbOriginal = { users: [ { _id: 'user1', mapSelected: 'map1', dataFrameSelected: 1 } ], maps: [ { _id: 'map1', dataFrames: ['f1', 'f2'] } ] }
        dbExpected = { users: [ { _id: 'user1', mapSelected: 'map1', dataFrameSelected: 0 } ], maps: [ { _id: 'map1', dataFrames: ['f1', 'f2'] } ] }
        break
      }
      case 'selectPrevMapFrame.test2': {
        dbOriginal = { users: [ { _id: 'user1', mapSelected: 'map1',  dataFrameSelected: 0 } ], maps: [ { _id: 'map1', dataFrames: ['f1', 'f2'] } ] }
        dbExpected = { users: [ { _id: 'user1', mapSelected: 'map1',  dataFrameSelected: 0 } ], maps: [ { _id: 'map1', dataFrames: ['f1', 'f2'] } ] }
        break
      }
      case 'selectNextMapFrame.test1': {
        dbOriginal = { users: [ { _id: 'user1', mapSelected: 'map1', dataFrameSelected: 0 } ], maps: [ { _id: 'map1', dataFrames: ['f1', 'f2'] } ] }
        dbExpected = { users: [ { _id: 'user1', mapSelected: 'map1', dataFrameSelected: 1 } ], maps: [ { _id: 'map1', dataFrames: ['f1', 'f2'] } ] }
        break
      }
      case 'selectNextMapFrame.test2': {
        dbOriginal = { users: [ { _id: 'user1', mapSelected: 'map1',  dataFrameSelected: 1 } ], maps: [ { _id: 'map1', dataFrames: ['f1', 'f2'] } ] }
        dbExpected = { users: [ { _id: 'user1', mapSelected: 'map1',  dataFrameSelected: 1 } ], maps: [ { _id: 'map1', dataFrames: ['f1', 'f2'] } ] }
        break
      }
      case 'createMapFrameImport.test': {
        dbOriginal = { users: [ { _id: 'user1', mapSelected: 'map1', dataFrameSelected: 0 } ], maps: [ { _id: 'map1', ownerUser: 'user1', dataHistory: ['h1'], dataFrames: ['f1', 'f2']} ] }
        dbExpected = { users: [ { _id: 'user1', mapSelected: 'map1', dataFrameSelected: 0 } ], maps: [ { _id: 'map1', ownerUser: 'user1', dataHistory: ['h1'], dataFrames: ['f1', 'h1', 'f2'] } ] }
        break
      }
      case 'createMapFrameDuplicate.test': {
        dbOriginal = { users: [ { _id: 'user1', mapSelected: 'map1', dataFrameSelected: 1 } ], maps: [ { _id: 'map1', ownerUser: 'user1', dataFrames: ['fa', 'fb', 'fc'] } ] }
        dbExpected = { users: [ { _id: 'user1', mapSelected: 'map1', dataFrameSelected: 1 } ], maps: [ { _id: 'map1', ownerUser: 'user1', dataFrames: ['fa', 'fb', 'fb', 'fc'] } ] }
        break
      }
      case 'moveUpMapInTab.test1':
        dbOriginal = { users: [ {_id: 'user1', mapSelected: 'mapMove', tabMapIdList: ['mapKeep1', 'mapMove', 'mapKeep2'] } ] }
        dbExpected = { users: [ {_id: 'user1', mapSelected: 'mapMove', tabMapIdList: ['mapMove', 'mapKeep1', 'mapKeep2'] } ] }
        break
      case 'moveUpMapInTab.test2':
        dbOriginal = { users: [ {_id: 'user1', mapSelected: 'mapMove', tabMapIdList: ['mapMove', 'mapKeep1', 'mapKeep2'] } ] }
        dbExpected = { users: [ {_id: 'user1', mapSelected: 'mapMove', tabMapIdList: ['mapMove', 'mapKeep1', 'mapKeep2'] } ] }
        break
      case 'moveDownMapInTab.test1':
        dbOriginal = { users: [ {_id: 'user1', mapSelected: 'mapMove', tabMapIdList: ['mapKeep1', 'mapMove', 'mapKeep2'] } ] }
        dbExpected = { users: [ {_id: 'user1', mapSelected: 'mapMove', tabMapIdList: ['mapKeep1', 'mapKeep2', 'mapMove'] } ] }
        break
      case 'moveDownMapInTab.test2':
        dbOriginal = { users: [ {_id: 'user1', mapSelected: 'mapMove', tabMapIdList: ['mapKeep1', 'mapKeep2', 'mapMove'] } ] }
        dbExpected = { users: [ {_id: 'user1', mapSelected: 'mapMove', tabMapIdList: ['mapKeep1', 'mapKeep2', 'mapMove'] } ] }
        break
      case 'deleteMapFromUsers.test': {
        dbOriginal = {
          users: [
            { _id: 'user1', mapSelected: 'map_o_1', tabMapIdList: ['map_o_1', 'map_o_1_s_23456', 'map_o_2_s_1'] },
            { _id: 'user2', mapSelected: 'map_o_2', tabMapIdList: ['map_o_2', 'map_o_1_s_23456'] },
            { _id: 'user3', mapSelected: 'map_o_1_s_23456', tabMapIdList: ['map_o_3', 'map_o_1_s_23456'] },
            { _id: 'user4', mapSelected: 'map_o_1_s_23456', tabMapIdList: ['map_o_1_s_23456', 'map_o_4'] },
            { _id: 'user5', mapSelected: 'map_o_5', tabMapIdList: ['map_o_5'] },
            { _id: 'user6', mapSelected: 'map_o_1_s_23456', tabMapIdList: ['map_o_1_s_23456'] },
          ],
          maps: [
            { _id: 'map_o_1_s_23456', ownerUser: 'user1' },
            { _id: 'map_o_1', ownerUser: 'user1' },
            { _id: 'map_o_2_s_1', ownerUser: 'user2' },
            { _id: 'map_o_2', ownerUser: 'user2' },
            { _id: 'map_o_3', ownerUser: 'user3' },
            { _id: 'map_o_4', ownerUser: 'user4' },
            { _id: 'map_o_5', ownerUser: 'user5' },
            { _id: 'map_o_6', ownerUser: 'user6' },
          ],
          shares: [
            { _id: 'share_1_2', ownerUser: 'user1', shareUser: 'user2', sharedMap: 'map_o_1_s_23456' },
            { _id: 'share_1_3', ownerUser: 'user1', shareUser: 'user3', sharedMap: 'map_o_1_s_23456' },
            { _id: 'share_1_4', ownerUser: 'user1', shareUser: 'user4', sharedMap: 'map_o_1_s_23456' },
            { _id: 'share_1_5', ownerUser: 'user1', shareUser: 'user5', sharedMap: 'map_o_1_s_23456' },
            { _id: 'share_1_6', ownerUser: 'user1', shareUser: 'user6', sharedMap: 'map_o_1_s_23456' },
            { _id: 'share_2_1', ownerUser: 'user2', shareUser: 'user1', sharedMap: 'map_o_2_s_1' },
          ],
        }
        dbExpected = {
          users: [
            { _id: 'user1', mapSelected: 'map_o_1', tabMapIdList: ['map_o_1', 'map_o_2_s_1'] },
            { _id: 'user2', mapSelected: 'map_o_2', tabMapIdList: ['map_o_2'] },
            { _id: 'user3', mapSelected: 'map_o_3', tabMapIdList: ['map_o_3'] },
            { _id: 'user4', mapSelected: 'map_o_4', tabMapIdList: ['map_o_4'] },
            { _id: 'user5', mapSelected: 'map_o_5', tabMapIdList: ['map_o_5'] },
            { _id: 'user6', mapSelected: '', tabMapIdList: [] },
          ],
          maps: [
            { _id: 'map_o_1_s_23456', ownerUser: 'user1' },
            { _id: 'map_o_1', ownerUser: 'user1' },
            { _id: 'map_o_2_s_1', ownerUser: 'user2' },
            { _id: 'map_o_2', ownerUser: 'user2' },
            { _id: 'map_o_3', ownerUser: 'user3' },
            { _id: 'map_o_4', ownerUser: 'user4' },
            { _id: 'map_o_5', ownerUser: 'user5' },
            { _id: 'map_o_6', ownerUser: 'user6' },
          ],
          shares: [
            { _id: 'share_1_2', ownerUser: 'user1', shareUser: 'user2', sharedMap: 'map_o_1_s_23456' },
            { _id: 'share_1_3', ownerUser: 'user1', shareUser: 'user3', sharedMap: 'map_o_1_s_23456' },
            { _id: 'share_1_4', ownerUser: 'user1', shareUser: 'user4', sharedMap: 'map_o_1_s_23456' },
            { _id: 'share_1_5', ownerUser: 'user1', shareUser: 'user5', sharedMap: 'map_o_1_s_23456' },
            { _id: 'share_1_6', ownerUser: 'user1', shareUser: 'user6', sharedMap: 'map_o_1_s_23456' },
            { _id: 'share_2_1', ownerUser: 'user2', shareUser: 'user1', sharedMap: 'map_o_2_s_1' },
          ],
        }
        break
      }
      case 'deleteMapFromShares.test': {
        dbOriginal = { shares: [ {_id: 'shareOther', ownerUser: 'ownerUser', shareUser: 'userOther', sharedMap: 'mapShared'} ] }
        dbExpected = { shares: [] }
        break
      }
      case 'deleteMapFrame.test': {
        dbOriginal = { users: [ { _id: 'user1', mapSelected: 'map1', dataFrameSelected: 0 } ], maps: [ {_id: 'map1', ownerUser: 'user1', dataFrames: ['fa', 'fb', 'fc'] } ] }
        dbExpected = { users: [ { _id: 'user1', mapSelected: 'map1', dataFrameSelected: 0 } ], maps: [ {_id: 'map1', ownerUser: 'user1', dataFrames: ['fb', 'fc'] } ] }
        break
      }
      case 'saveMap.test': {
        dbOriginal = {
          users: [{_id: 'user1', mapSelected: 'map1'}],
          maps: [{
            _id: 'map1',
            ownerUser:'user1',
            dataHistoryModifiers: [],
            dataHistory: [ mergeBase, mergeMutationA ]
          }]
        }
        dbExpected= {
          users: [{_id: 'user1', mapSelected: 'map1'}],
          maps: [{
            _id: 'map1',
            ownerUser:'user1',
            dataHistoryModifiers: [{ modifierType: "user", userId: "user1", sessionId: 0 }],
            dataHistory: [ mergeBase, mergeMutationA, mergeResult ]
          }]
        }
        break
      }
      case 'saveMapFrame.test': {
        dbOriginal = {
          users: [{_id: 'user1', mapSelected: 'map1', dataFrameSelected: 1}],
          maps: [{ _id: 'map1', ownerUser:'user1', dataFrames: [ 'mf1', 'omf', 'mf2' ] }]
        }
        dbExpected= {
          users: [{_id: 'user1', mapSelected: 'map1', dataFrameSelected: 1}],
          maps: [{ _id: 'map1', ownerUser:'user1', dataFrames: [ 'mf1', 'nmf', 'mf2' ] }]
        }
        break
      }
      case 'createNodeProp.test': {
        dbOriginal = getMultiMapMultiSource( [ [ {a: 'o'} ], [ {a: 'o'}, {b: 'o'} ] ] )
        dbExpected = getMultiMapMultiSource( [ [ {a: 'o', npc: 'nvc'} ], [ {a: 'o', npc: 'nvc'}, {b: 'o', npc: 'nvc'} ] ] )
        break
      }
      case 'createNodePropIfMissing.test': {
        dbOriginal = getMultiMapMultiSource( [ [ {} ], [ {}, {a: 'o'} ] ] )
        dbExpected = getMultiMapMultiSource( [ [ {b: 'x'} ], [ {b: 'x'}, {a: 'o', b: 'x'} ] ] )
        break
      }
      case 'updateNodePropKey.test': {
        dbOriginal = getMultiMapMultiSource( [ [ {a: 'o'} ], [ {a: 'o'}, {b: 'o'} ] ] )
        dbExpected = getMultiMapMultiSource( [ [ {aNew: 'o'} ], [ {aNew: 'o'}, {b: 'o'} ] ] )
        break
      }
      case 'updateNodePropValueBasedOnPreviousValue.test': {
        dbOriginal = getMultiMapMultiSource( [ [ {a: 'o'} ], [ {a: 'o'}, {b: 'o'} ] ] )
        dbExpected = getMultiMapMultiSource( [ [ {a: 'x'} ], [ {a: 'x'}, {b: 'o'} ] ] )
        break
      }
      case 'removeNodeProp.test': {
        dbOriginal = getMultiMapMultiSource( [ [ {a: 'o', npr: 'nvr'} ], [ {a: 'o', npr: 'nvr'}, {b: 'o', npr: 'nvr'} ] ] )
        dbExpected = getMultiMapMultiSource( [ [ {a: 'o'} ], [ {a: 'o'}, {b: 'o'} ] ] )
        break
      }
      case 'deleteUnusedMaps.test': {
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
      case 'nameLookup.test': result = await MongoQueries.nameLookup(users, 'user1', 'anyMapIdList'); break
      case 'getUserShares.test': result = await MongoQueries.getUserShares(shares, 'user1'); break
      case 'countNodes.test': result = await MongoQueries.countNodes(maps); break
      case 'countNodesBasedOnNodePropExistence.test': result = await MongoQueries.countNodesBasedOnNodePropExistence( maps, 'b' ); break
      case 'countNodesBasedOnNodePropValue.test': result = await MongoQueries.countNodesBasedOnNodePropValue( maps, 'b', 'x' ); break
      case 'findDeadLinks.test': result = await MongoQueries.findDeadLinks(maps); break
      case 'selectFirstMapFrame.test': await MongoMutations.selectFirstMapFrame(users, 'user1'); break
      case 'selectPrevMapFrame.test1': await MongoMutations.selectPrevMapFrame(users, 'user1'); break
      case 'selectPrevMapFrame.test2': await MongoMutations.selectPrevMapFrame(users, 'user1'); break
      case 'selectNextMapFrame.test1': await MongoMutations.selectNextMapFrame(users, 'user1'); break
      case 'selectNextMapFrame.test2': await MongoMutations.selectNextMapFrame(users, 'user1'); break
      case 'createMapFrameImport.test': await MongoMutations.createMapFrameImport(maps, 'user1'); break
      case 'createMapFrameDuplicate.test': await MongoMutations.createMapFrameDuplicate(maps, 'user1'); break
      case 'moveUpMapInTab.test1': await MongoMutations.moveUpMapInTab(users, 'user1'); break
      case 'moveUpMapInTab.test2': await MongoMutations.moveUpMapInTab(users, 'user1'); break
      case 'moveDownMapInTab.test1': await MongoMutations.moveDownMapInTab(users, 'user1'); break
      case 'moveDownMapInTab.test2': await MongoMutations.moveDownMapInTab(users, 'user1'); break
      case 'deleteMapFromUsers.test': await MongoMutations.deleteMapFromUsers(users, 'map_o_1_s_23456' ); break
      case 'deleteMapFromShares.test': await MongoMutations.deleteMapFromShares(shares, { sharedMap: 'mapShared'} ); break
      case 'deleteMapFrame.test':  await MongoMutations.deleteMapFrame(maps, 'user1'); break
      case 'saveMap.test': await MongoMutationsSaveMap.saveMap(maps, 'map1', 'map', mergeMutationB ); break
      case 'saveMapFrame.test': await MongoMutations.saveMapFrame(maps, 'map1', 1, 'nmf' ); break
      case 'createNodeProp.test':  await MongoMutations.createNodeProp(maps, 'npc', 'nvc' ); break
      case 'createNodePropIfMissing.test':  await MongoMutations.createNodePropIfMissing(maps, 'b', 'x' ); break
      case 'updateNodePropKey.test':  await MongoMutations.updateNodePropKey(maps, 'a', 'aNew' ); break
      case 'updateNodePropValueBasedOnPreviousValue.test':  await MongoMutations.updateNodePropValueBasedOnPreviousValue(maps, 'a', 'o', 'x' ); break
      case 'removeNodeProp.test':  await MongoMutations.removeNodeProp(maps, 'npr' ); break
      case 'deleteUnusedMaps.test': await MongoMutations.deleteUnusedMaps(users, maps); break
    }
    if ([
      'nameLookup.test',
      'getUserShares.test',
      'countNodes.test',
      'countNodesBasedOnNodePropExistence.test',
      'countNodesBasedOnNodePropValue.test',
      'findDeadLinks.test'
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
  // await mongoTests('nameLookup.test')
  // await mongoTests('getUserShares.test')
  // await mongoTests('countNodes.test')
  // await mongoTests('countNodesBasedOnNodePropExistence.test')
  // await mongoTests('countNodesBasedOnNodePropValue.test')
  // await mongoTests('findDeadLinks.test')
  // await mongoTests('selectFirstMapFrame.test')
  // await mongoTests('selectPrevMapFrame.test1')
  // await mongoTests('selectPrevMapFrame.test2')
  // await mongoTests('selectNextMapFrame.test1')
  // await mongoTests('selectNextMapFrame.test2')
  // await mongoTests('createMapFrameImport.test')
  // await mongoTests('createMapFrameDuplicate.test')
  // await mongoTests('moveUpMapInTab.test1')
  // await mongoTests('moveUpMapInTab.test2')
  // await mongoTests('moveDownMapInTab.test1')
  // await mongoTests('moveDownMapInTab.test2')
  await mongoTests('deleteMapFromUsers.test')
  // await mongoTests('deleteMapFromShares.test')
  // await mongoTests('deleteMapFrame.test')
  // await mongoTests('saveMap.test')
  // await mongoTests('saveMapFrame.test')
  // await mongoTests('createNodeProp.test')
  // await mongoTests('createNodePropIfMissing.test')
  // await mongoTests('updateNodePropKey.test')
  // await mongoTests('updateNodePropValueBasedOnPreviousValue.test')
  // await mongoTests('removeNodeProp.test')
  // await mongoTests('deleteUnusedMaps.test')
}

allTest()
