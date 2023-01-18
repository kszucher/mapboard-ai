const MongoQueries = require("./MongoQueries");
const MongoMutations = require("./MongoMutations");
const MongoMutationsSaveMap = require("./MongoMutationsSaveMap");
import { describe, expect, test,  beforeEach, afterEach } from 'vitest';

const { mergeBase, mergeMutationA, mergeMutationB, mergeResult } = require('./MongoTestsSave')
const { baseUri } = require('./MongoSecret')
const MongoClient = require('mongodb').MongoClient;

const getMultiMapMultiSource = (mapArray) => {
  const multiSource = { dataFrames: mapArray, dataHistory: mapArray }
  return { maps: [ { _id: 'map1', ...multiSource }, { _id: 'map2', ...multiSource } ] }
}

const mongoSet = async (dbOriginal) => {
  if (dbOriginal.hasOwnProperty('users')) await users.insertMany(dbOriginal.users)
  if (dbOriginal.hasOwnProperty('maps')) await maps.insertMany(dbOriginal.maps)
  if (dbOriginal.hasOwnProperty('shares')) await shares.insertMany(dbOriginal.shares)
}

const mongoGet = async (dbOriginal) => {
  let result = {}
  if (dbOriginal.hasOwnProperty('users')) { result.users = await users.find().toArray() }
  if (dbOriginal.hasOwnProperty('maps')) { result.maps = await maps.find().toArray() }
  if (dbOriginal.hasOwnProperty('shares')) { result.shares = await shares.find().toArray() }
  return result
}

const getElemById = (list, id) => (list.find(el => el._id === id))

let client
let db, users, maps, shares

describe("Mongo test", async() => {
  beforeEach(async () => {
    client = new MongoClient(baseUri, { useNewUrlParser: true, useUnifiedTopology: true, })
    await client.connect()
    db = client.db("app_dev_mongo")
    users = db.collection("users")
    maps = db.collection("maps")
    shares = db.collection("shares")
    await users.deleteMany({})
    await maps.deleteMany({})
    await shares.deleteMany({})
  })
  afterEach(async () => {
    await client.close()
  })
  test('nameLookup', async() => {
    const dbOriginal = {
      users: [ {_id: 'user1', anyMapIdList: ['map1', 'map2', 'map4', 'map3'] } ],
      maps:  [
        { _id: 'map1', dataHistory: [ [ { }, { content: 'mapName1', path: ['r', 0] } ] ] },
        { _id: 'map2', dataHistory: [ [ { }, { content: 'mapName2', path: ['r', 0] } ] ] },
        { _id: 'map3', dataHistory: [ [ { }, { content: 'mapName3', path: ['r', 0] } ] ] },
        { _id: 'map4', dataHistory: [ [ { }, { content: 'mapName4', path: ['r', 0] } ] ] },
      ]
    }
    await mongoSet(dbOriginal)
    const result = await MongoQueries.nameLookup(users, 'user1', 'anyMapIdList')
    expect(result).toEqual(['mapName1', 'mapName2', 'mapName4', 'mapName3'])
  })
  test('getUserShares', async() => {
    const dbOriginal = {
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
    await mongoSet(dbOriginal)
    const result = await MongoQueries.getUserShares(shares, 'user1')
    expect(result).toEqual({
      shareDataExport: [
        { _id: 'share1', access: 'view', status: 'accepted', shareUserEmail: 'user2@mail.com', sharedMapName: 'mapName1' },
        { _id: 'share2', access: 'edit', status: 'accepted', shareUserEmail: 'user2@mail.com', sharedMapName: 'mapName2' }
      ],
      shareDataImport: [
        { _id: 'share3', access: 'view', status: 'accepted', ownerUserEmail: 'user2@mail.com', sharedMapName: 'mapName3' },
        { _id: 'share4', access: 'edit', status: 'accepted', ownerUserEmail: 'user2@mail.com', sharedMapName: 'mapName4' }
      ]
    })
  })
  test('countNodes', async() => {
    const dbOriginal = getMultiMapMultiSource( [
      [ {a: 'o', b: '0'} ], [ {a: 'o'}, {a: 'o', b: 'o', c: 'o'} ], [ {c: 'o'} ]
    ] )
    await mongoSet(dbOriginal)
    const result = await MongoQueries.countNodes(maps)
    expect(result).toEqual([{ _id: null, result: 16 }])
  })

  test('countNodesBasedOnNodePropExistence', async() => {
    const dbOriginal = getMultiMapMultiSource( [
      [ {a: 'o'} ],
      [ {a: 'o'}, {b: 'o'}, {a: 'o', b: 'o'} ],
      [ {b: 'o'} ]
    ] )
    await mongoSet(dbOriginal)
    const result = await MongoQueries.countNodesBasedOnNodePropExistence( maps, 'b' )
    expect(result).toEqual([{ _id: null, result: 12 }])
  })

  test('countNodesBasedOnNodePropValue', async() => {
    const dbOriginal = getMultiMapMultiSource( [
      [ {a: 'o'} ],
      [ {a: 'o'}, {b: 'x'}, {a: 'o', b: 'x'} ],
      [ {b: 'o'} ]
    ] )
    await mongoSet(dbOriginal)
    const result = await MongoQueries.countNodesBasedOnNodePropValue( maps, 'b', 'x' )
    expect(result).toEqual([{ _id: null, result: 8 }])
  })

  test('findDeadLinks', async() => {
    const dbOriginal = {
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
    await mongoSet(dbOriginal)
    const result = await MongoQueries.findDeadLinks(maps)
    expect(result).toEqual([
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
    ])
  })
  test('moveMap', async() => {
    const dbOriginal = {
      users: [
        {_id: 'user1', mapSelected: 'mapMove', tabMapIdList: ['mapKeep1', 'mapMove', 'mapKeep2'] },
        {_id: 'user2', mapSelected: 'mapMove', tabMapIdList: ['mapMove', 'mapKeep1', 'mapKeep2'] },
        {_id: 'user3', mapSelected: 'mapMove', tabMapIdList: ['mapKeep1', 'mapMove', 'mapKeep2'] },
        {_id: 'user4', mapSelected: 'mapMove', tabMapIdList: ['mapKeep1', 'mapKeep2', 'mapMove'] },
      ]
    }
    await mongoSet(dbOriginal)
    await MongoMutations.moveUpMapInTab(users, 'user1')
    await MongoMutations.moveUpMapInTab(users, 'user2')
    await MongoMutations.moveDownMapInTab(users, 'user3')
    await MongoMutations.moveDownMapInTab(users, 'user4')
    const dbModified = await mongoGet(dbOriginal)
    expect(getElemById(dbModified.users, 'user1').tabMapIdList).toEqual(['mapMove', 'mapKeep1', 'mapKeep2'])
    expect(getElemById(dbModified.users, 'user2').tabMapIdList).toEqual(['mapMove', 'mapKeep1', 'mapKeep2'])
    expect(getElemById(dbModified.users, 'user3').tabMapIdList).toEqual(['mapKeep1', 'mapKeep2', 'mapMove'])
    expect(getElemById(dbModified.users, 'user4').tabMapIdList).toEqual(['mapKeep1', 'mapKeep2', 'mapMove'])
  })

  test('selectMapFrame', async() => {
    const dbOriginal = {
      users: [
        { _id: 'user1', mapSelected: 'map1', dataFrameSelected: -1 },
        { _id: 'user2', mapSelected: 'map1', dataFrameSelected: 1 },
        { _id: 'user3', mapSelected: 'map1', dataFrameSelected: 0 },
        { _id: 'user4', mapSelected: 'map1', dataFrameSelected: 0 },
        { _id: 'user5', mapSelected: 'map1', dataFrameSelected: 1 },
      ],
      maps: [
        { _id: 'map1', dataFrames: [ 'f1', 'f2' ] }
      ]
    }
    await mongoSet(dbOriginal)
    await MongoMutations.selectFirstMapFrame(users, 'user1')
    await MongoMutations.selectPrevMapFrame(users, 'user2')
    await MongoMutations.selectPrevMapFrame(users, 'user3')
    await MongoMutations.selectNextMapFrame(users, 'user4')
    await MongoMutations.selectNextMapFrame(users, 'user5')
    const dbModified = await mongoGet(dbOriginal)
    expect(getElemById(dbModified.users, 'user1').dataFrameSelected).toEqual(0)
    expect(getElemById(dbModified.users, 'user2').dataFrameSelected).toEqual(0)
    expect(getElemById(dbModified.users, 'user3').dataFrameSelected).toEqual(0)
    expect(getElemById(dbModified.users, 'user4').dataFrameSelected).toEqual(1)
    expect(getElemById(dbModified.users, 'user5').dataFrameSelected).toEqual(1)
  })
  test('createMapFrame', async() => {
    const dbOriginal = {
      users: [{ _id: 'user1', mapSelected: 'map1', dataFrameSelected: 0 }],
      maps: [{ _id: 'map1', ownerUser: 'user1', dataHistory: ['h1'], dataFrames: ['f1', 'f2'] }]
    }
    await mongoSet(dbOriginal)
    await MongoMutations.createMapFrameImport(maps, 'user1')
    await MongoMutations.createMapFrameDuplicate(maps, 'user1')
    const dbModified = await mongoGet(dbOriginal)
    expect(getElemById(dbModified.maps, 'map1').dataFrames).toEqual(['f1', 'f1', 'h1', 'f2'])
  })
  test('deleteMapFrame', async() => {
    const dbOriginal = {
      users: [{ _id: 'user1', mapSelected: 'map1', dataFrameSelected: 0 }],
      maps: [{ _id: 'map1', ownerUser: 'user1', dataHistory: ['h1'], dataFrames: ['f1', 'f2', 'f3'] }]
    }
    await mongoSet(dbOriginal)
    await MongoMutations.deleteMapFrame(maps, 'user1')
    const dbModified = await mongoGet(dbOriginal)
    expect(getElemById(dbModified.maps, 'map1').dataFrames).toEqual(['f2', 'f3'])
  })
  test('deleteMapFromUsers', async() => {
    const dbOriginal = {
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
    await mongoSet(dbOriginal)
    await MongoMutations.deleteMapFromUsers(users, 'map_o_1_s_23456')
    const dbModified = await mongoGet(dbOriginal)
    expect(dbModified.users).toEqual(
      [
        { _id: 'user1', mapSelected: 'map_o_1', tabMapIdList: ['map_o_1', 'map_o_2_s_1'] },
        { _id: 'user2', mapSelected: 'map_o_2', tabMapIdList: ['map_o_2'] },
        { _id: 'user3', mapSelected: 'map_o_3', tabMapIdList: ['map_o_3'] },
        { _id: 'user4', mapSelected: 'map_o_4', tabMapIdList: ['map_o_4'] },
        { _id: 'user5', mapSelected: 'map_o_5', tabMapIdList: ['map_o_5'] },
        { _id: 'user6', mapSelected: '', tabMapIdList: [] },
      ]
    )
  })
  test('saveMap', async() => {
    const dbOriginal = {
      users: [{_id: 'user1', mapSelected: 'map1'}],
      maps: [{
        _id: 'map1',
        ownerUser:'user1',
        dataHistoryModifiers: [],
        dataHistory: [ mergeBase, mergeMutationA ]
      }]
    }
    await mongoSet(dbOriginal)
    await MongoMutationsSaveMap.saveMap(maps, 'map1', 'map', mergeMutationB )
    const dbModified = await mongoGet(dbOriginal)
    expect(dbModified).toEqual({
      users: [{_id: 'user1', mapSelected: 'map1'}],
      maps: [{
        _id: 'map1',
        ownerUser:'user1',
        dataHistoryModifiers: [{ modifierType: "user", userId: "user1", sessionId: 0 }],
        dataHistory: [ mergeBase, mergeMutationA, mergeResult ]
      }]
    })
  })
  test('saveMapFrame', async() => {
    const dbOriginal = {
      users: [{_id: 'user1', mapSelected: 'map1', dataFrameSelected: 1}],
      maps: [{ _id: 'map1', ownerUser:'user1', dataFrames: [ 'mf1', 'omf', 'mf2' ] }]
    }
    await mongoSet(dbOriginal)
    await MongoMutations.saveMapFrame(maps, 'map1', 1, 'nmf' )
    const dbModified = await mongoGet(dbOriginal)
    expect(getElemById(dbModified.maps, 'map1').dataFrames).toEqual([ 'mf1', 'nmf', 'mf2' ])
  })
  test('createNodeProp', async() => {
    const dbOriginal = getMultiMapMultiSource( [ [ {a: 'o'} ], [ {a: 'o'}, {b: 'o'} ] ] )
    const dbExpected = getMultiMapMultiSource( [ [ {a: 'o', npc: 'nvc'} ], [ {a: 'o', npc: 'nvc'}, {b: 'o', npc: 'nvc'} ] ] )
    await mongoSet(dbOriginal)
    await MongoMutations.createNodeProp(maps, 'npc', 'nvc' )
    const dbModified = await mongoGet(dbOriginal)
    expect(dbModified).toEqual(dbExpected)
  })
  test('createNodePropIfMissing', async() => {
    const dbOriginal = getMultiMapMultiSource( [ [ {} ], [ {}, {a: 'o'} ] ] )
    const dbExpected = getMultiMapMultiSource( [ [ {b: 'x'} ], [ {b: 'x'}, {a: 'o', b: 'x'} ] ] )
    await mongoSet(dbOriginal)
    await MongoMutations.createNodePropIfMissing(maps, 'b', 'x' )
    const dbModified = await mongoGet(dbOriginal)
    expect(dbModified).toEqual(dbExpected)
  })
  test('updateNodePropKey', async() => {
    const dbOriginal = getMultiMapMultiSource( [ [ {a: 'o'} ], [ {a: 'o'}, {b: 'o'} ] ] )
    const dbExpected = getMultiMapMultiSource( [ [ {aNew: 'o'} ], [ {aNew: 'o'}, {b: 'o'} ] ] )
    await mongoSet(dbOriginal)
    await MongoMutations.updateNodePropKey(maps, 'a', 'aNew' )
    const dbModified = await mongoGet(dbOriginal)
    expect(dbModified).toEqual(dbExpected)
  })
  test('updateNodePropValueBasedOnPreviousValue', async() => {
    const dbOriginal = getMultiMapMultiSource( [ [ {a: 'o'} ], [ {a: 'o'}, {b: 'o'} ] ] )
    const dbExpected = getMultiMapMultiSource( [ [ {a: 'x'} ], [ {a: 'x'}, {b: 'o'} ] ] )
    await mongoSet(dbOriginal)
    await MongoMutations.updateNodePropValueBasedOnPreviousValue(maps, 'a', 'o', 'x' )
    const dbModified = await mongoGet(dbOriginal)
    expect(dbModified).toEqual(dbExpected)
  })
  test('removeNodeProp', async() => {
    const dbOriginal = getMultiMapMultiSource( [ [ {a: 'o', npr: 'nvr'} ], [ {a: 'o', npr: 'nvr'}, {b: 'o', npr: 'nvr'} ] ] )
    const dbExpected = getMultiMapMultiSource( [ [ {a: 'o'} ], [ {a: 'o'}, {b: 'o'} ] ] )
    await mongoSet(dbOriginal)
    await MongoMutations.removeNodeProp(maps, 'npr' )
    const dbModified = await mongoGet(dbOriginal)
    expect(dbModified).toEqual(dbExpected)
  })
  test('deleteUnusedMaps', async() => {
    const dbOriginal = {
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
    await mongoSet(dbOriginal)
    await MongoMutations.deleteUnusedMaps(users, maps)
    const dbModified = await mongoGet(dbOriginal)
    expect(dbModified.maps).toEqual(
      [
        { _id: 'map10', path: ['map10'] },
        { _id: 'map11', path: ['map10', 'map11'] },
        { _id: 'map12', path: ['map10', 'map11', 'map12'] },
        { _id: 'map20', path: ['map20'] },
        { _id: 'map30', path: ['map30'] },
      ]
    )
  })
})
