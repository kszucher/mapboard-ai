const MongoClient = require('mongodb').MongoClient
import { describe, expect, test,  beforeEach, afterEach } from 'vitest'
const { baseUri } = require('./MongoSecret')
const MongoQueries = require("./MongoQueries")
const MongoMutations = require("./MongoMutations")
const { mergeBase, mergeMutationA, mergeMutationB, mergeResult } = require('./MongoTestsSave')

let client
let db, users, maps, shares

const getMultiMapMultiSource = (mapArray) => {
  const multiSource = { dataFrames: mapArray, dataHistory: mapArray }
  return { maps: [ { _id: 'map1', ...multiSource }, { _id: 'map2', ...multiSource } ] }
}

const mongoClear = async () => {
  await users.deleteMany({})
  await maps.deleteMany({})
  await shares.deleteMany({})
}

const mongoSet = async (database) => {
  if (database.hasOwnProperty('users')) await users.insertMany(database.users)
  if (database.hasOwnProperty('maps')) await maps.insertMany(database.maps)
  if (database.hasOwnProperty('shares')) await shares.insertMany(database.shares)
}

const mongoGet = async (database) => {
  let result = {}
  if (database.hasOwnProperty('users')) { result.users = await users.find().toArray() }
  if (database.hasOwnProperty('maps')) { result.maps = await maps.find().toArray() }
  if (database.hasOwnProperty('shares')) { result.shares = await shares.find().toArray() }
  return result
}

const resolveQuery = async (database, queryName, queryParams) => {
  await mongoClear()
  await mongoSet(database)
  return await MongoQueries[queryName](...queryParams)
}

const resolveMutation = async (database, mutationName, mutationParams) => {
  await mongoClear()
  await mongoSet(database)
  await MongoMutations[mutationName](...mutationParams)
  return await mongoGet(database)
}

const getElemById = (list, id) => (list.find(el => el._id === id))

describe("MongoTests", async() => {
  beforeEach(async () => {
    client = new MongoClient(baseUri, { useNewUrlParser: true, useUnifiedTopology: true, })
    await client.connect()
    db = client.db("app_dev_mongo")
    users = db.collection("users")
    maps = db.collection("maps")
    shares = db.collection("shares")
  })
  afterEach(async () => {
    await client.close()
  })
  test('nameLookup', async() => {
    const database = {
      users: [ {_id: 'user1', anyMapIdList: ['map1', 'map2', 'map4', 'map3'] } ],
      maps:  [
        { _id: 'map1', dataHistory: [ [ { }, { content: 'mapName1', path: ['r', 0] } ] ] },
        { _id: 'map2', dataHistory: [ [ { }, { content: 'mapName2', path: ['r', 0] } ] ] },
        { _id: 'map3', dataHistory: [ [ { }, { content: 'mapName3', path: ['r', 0] } ] ] },
        { _id: 'map4', dataHistory: [ [ { }, { content: 'mapName4', path: ['r', 0] } ] ] },
      ]
    }
    const modified = await resolveQuery(database, 'nameLookup', [users, 'user1', 'anyMapIdList'])
    const expected = ['mapName1', 'mapName2', 'mapName4', 'mapName3']
    expect(modified).toEqual(expected)
  })
  test('getUserShares', async() => {
    const database = {
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
    const modified = await resolveQuery(database, 'getUserShares', [shares, 'user1'])
    const expected = {
      shareDataExport: [
        { _id: 'share1', access: 'view', status: 'accepted', shareUserEmail: 'user2@mail.com', sharedMapName: 'mapName1' },
        { _id: 'share2', access: 'edit', status: 'accepted', shareUserEmail: 'user2@mail.com', sharedMapName: 'mapName2' }
      ],
      shareDataImport: [
        { _id: 'share3', access: 'view', status: 'accepted', ownerUserEmail: 'user2@mail.com', sharedMapName: 'mapName3' },
        { _id: 'share4', access: 'edit', status: 'accepted', ownerUserEmail: 'user2@mail.com', sharedMapName: 'mapName4' }
      ]
    }
    expect(modified).toEqual(expected)
  })
  test('countNodes', async() => {
    const database = getMultiMapMultiSource([ [ { a: 'o', b: '0' } ], [ { a: 'o' }, { a: 'o', b: 'o', c: 'o' } ], [ { c: 'o' } ] ])
    const modified = await resolveQuery(database, 'countNodes', [maps])
    const expected = [ { _id: null, result: 16 }]
    expect(modified).toEqual(expected)
  })
  test('countNodesBasedOnNodePropExistence', async() => {
    const database = getMultiMapMultiSource([ [ { a: 'o' } ], [ { a: 'o' }, { b: 'o' }, { a: 'o', b: 'o' } ], [ { b: 'o' } ] ])
    const modified = await resolveQuery(database, 'countNodesBasedOnNodePropExistence', [maps, 'b'])
    const expected = [ { _id: null, result: 12 }]
    expect(modified).toEqual(expected)
  })
  test('countNodesBasedOnNodePropValue', async() => {
    const database = getMultiMapMultiSource([ [ { a: 'o' } ], [ { a: 'o' }, { b: 'x' }, { a: 'o', b: 'x' } ], [ { b: 'o' } ] ])
    const modified = await resolveQuery(database, 'countNodesBasedOnNodePropValue', [maps, 'b', 'x'])
    const expected = [ { _id: null, result: 8 }]
    expect(modified).toEqual(expected)
  })
  test('findDeadLinks', async() => {
    const database = {
      maps:  [
        { _id: 'map10',
          dataHistory: [
            [
              { },
              { content: 'map10name'},
              { linkType: 'internal', link: 'map11', content: 'map11link' },
              { linkType: 'internal', link: 'map12', content: 'map12link' },
              { linkType: 'internal', link: 'map12', content: 'map13link' }
            ],
            [
              { },
              { content: 'map10name'},
              { linkType: 'internal', link: 'map11', content: 'map11link' },
              { linkType: 'internal', link: 'map12', content: 'map12link' },
              { linkType: 'internal', link: 'map12', content: 'map13link' }
            ],
          ],
          dataFrames: [ [ ] ]
        },
        { _id: 'map11',
          dataHistory: [
            [
              { },
              { content: 'map11name' },
              { linkType: 'internal', link: 'map111', content: 'map111link' }
            ]
          ],
          dataFrames: [ [ ] ]
        }
      ]
    }
    const modified = await resolveQuery(database, 'findDeadLinks', [maps])
    const expected = [
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
    expect(modified).toEqual(expected)
  })
  test('moveUpMapInTab.canMove', async() => {
    const database = { users: [ {_id: 'user1', mapSelected: 'mapMove', tabMapIdList: ['mapKeep1', 'mapMove', 'mapKeep2'] } ] }
    const modified = await resolveMutation(database, 'moveUpMapInTab', [users, 'user1'])
    expect(getElemById(modified.users, 'user1').tabMapIdList).toEqual(['mapMove', 'mapKeep1', 'mapKeep2'])
  })
  test('moveUpMapInTab.cannotMove', async() => {
    const database = { users: [ {_id: 'user1', mapSelected: 'mapMove', tabMapIdList: ['mapMove', 'mapKeep1', 'mapKeep2'] } ] }
    const modified = await resolveMutation(database, 'moveUpMapInTab', [users, 'user1'])
    expect(getElemById(modified.users, 'user1').tabMapIdList).toEqual(['mapMove', 'mapKeep1', 'mapKeep2'])
  })
  test('moveDownMapInTab.canMove', async() => {
    const database = { users: [ {_id: 'user1', mapSelected: 'mapMove', tabMapIdList: ['mapKeep1', 'mapMove', 'mapKeep2'] } ] }
    const modified = await resolveMutation(database, 'moveDownMapInTab', [users, 'user1'])
    expect(getElemById(modified.users, 'user1').tabMapIdList).toEqual(['mapKeep1', 'mapKeep2', 'mapMove'])
  })
  test('moveDownMapInTab.cannotMove', async() => {
    const database = { users: [ {_id: 'user1', mapSelected: 'mapMove', tabMapIdList: ['mapKeep1', 'mapKeep2', 'mapMove'] } ] }
    const modified = await resolveMutation(database, 'moveDownMapInTab', [users, 'user1'])
    expect(getElemById(modified.users, 'user1').tabMapIdList).toEqual(['mapKeep1', 'mapKeep2', 'mapMove'])
  })
  test('selectFirstMapFrame', async() => {
    const database = { users: [ { _id: 'user1', mapSelected: 'map1', dataFrameSelected: -1 } ], maps: [ { _id: 'map1', dataFrames: [ 'f1', 'f2' ] } ] }
    const modified = await resolveMutation(database, 'selectFirstMapFrame', [users, 'user1'])
    expect(getElemById(modified.users, 'user1').dataFrameSelected).toEqual(0)
  })
  test('selectPrevMapFrame.can', async() => {
    const database = { users: [ { _id: 'user1', mapSelected: 'map1', dataFrameSelected: 1 } ], maps: [ { _id: 'map1', dataFrames: [ 'f1', 'f2' ] } ] }
    const modified = await resolveMutation(database, 'selectPrevMapFrame', [users, 'user1'])
    expect(getElemById(modified.users, 'user1').dataFrameSelected).toEqual(0)
  })
  test('selectPrevMapFrame.cannot', async() => {
    const database = { users: [ { _id: 'user1', mapSelected: 'map1', dataFrameSelected: 0 } ], maps: [ { _id: 'map1', dataFrames: [ 'f1', 'f2' ] } ] }
    const modified = await resolveMutation(database, 'selectPrevMapFrame', [users, 'user1'])
    expect(getElemById(modified.users, 'user1').dataFrameSelected).toEqual(0)
  })
  test('selectNextMapFrame.can', async() => {
    const database = { users: [ { _id: 'user1', mapSelected: 'map1', dataFrameSelected: 0 } ], maps: [ { _id: 'map1', dataFrames: [ 'f1', 'f2' ] } ] }
    const modified = await resolveMutation(database, 'selectNextMapFrame', [users, 'user1'])
    expect(getElemById(modified.users, 'user1').dataFrameSelected).toEqual(1)
  })
  test('selectNextMapFrame.cannot', async() => {
    const database = { users: [ { _id: 'user1', mapSelected: 'map1', dataFrameSelected: 1 } ], maps: [ { _id: 'map1', dataFrames: [ 'f1', 'f2' ] } ] }
    const modified = await resolveMutation(database, 'selectNextMapFrame', [users, 'user1'])
    expect(getElemById(modified.users, 'user1').dataFrameSelected).toEqual(1)
  })
  test('createMapFrameImport', async() => {
    const database = {
      users: [ { _id: 'user1', mapSelected: 'map1', dataFrameSelected: 0 }],
      maps: [ { _id: 'map1', ownerUser: 'user1', dataHistory: ['h1'], dataFrames: ['f1', 'f2'] }]
    }
    const modified = await resolveMutation(database, 'createMapFrameImport', [maps, 'user1'])
    expect(getElemById(modified.maps, 'map1').dataFrames).toEqual(['f1', 'h1', 'f2'])
  })
  test('createMapFrameDuplicate', async() => {
    const database = {
      users: [ { _id: 'user1', mapSelected: 'map1', dataFrameSelected: 0 }],
      maps: [ { _id: 'map1', ownerUser: 'user1', dataHistory: ['h1'], dataFrames: ['f1', 'f2'] }]
    }
    const modified = await resolveMutation(database, 'createMapFrameDuplicate', [maps, 'user1'])
    expect(getElemById(modified.maps, 'map1').dataFrames).toEqual(['f1', 'f1', 'f2'])
  })
  test('deleteMap', async() => {
    const database = {
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
    expect(
      await resolveMutation(database, 'deleteMap', [users, shares, 'user1', 'map_o_1_s_23456'])
    ).toEqual(
      { ...database,
        ...{
          users: [
            { _id: 'user1', mapSelected: 'map_o_1', tabMapIdList: ['map_o_1', 'map_o_2_s_1'] },
            { _id: 'user2', mapSelected: 'map_o_2', tabMapIdList: ['map_o_2'] },
            { _id: 'user3', mapSelected: 'map_o_3', tabMapIdList: ['map_o_3'] },
            { _id: 'user4', mapSelected: 'map_o_4', tabMapIdList: ['map_o_4'] },
            { _id: 'user5', mapSelected: 'map_o_5', tabMapIdList: ['map_o_5'] },
            { _id: 'user6', mapSelected: '', tabMapIdList: [] },
          ],
          shares: [
            { _id: 'share_2_1', ownerUser: 'user2', shareUser: 'user1', sharedMap: 'map_o_2_s_1' },
          ]
        }
      }
    )
    expect(
      await resolveMutation(database, 'deleteMap', [users, shares, 'user2', 'map_o_1_s_23456'])
    ).toEqual(
      { ...database,
        ...{
          users: [
            { _id: 'user1', mapSelected: 'map_o_1', tabMapIdList: ['map_o_1', 'map_o_1_s_23456', 'map_o_2_s_1'] },
            { _id: 'user2', mapSelected: 'map_o_2', tabMapIdList: ['map_o_2'] },
            { _id: 'user3', mapSelected: 'map_o_1_s_23456', tabMapIdList: ['map_o_3', 'map_o_1_s_23456'] },
            { _id: 'user4', mapSelected: 'map_o_1_s_23456', tabMapIdList: ['map_o_1_s_23456', 'map_o_4'] },
            { _id: 'user5', mapSelected: 'map_o_5', tabMapIdList: ['map_o_5'] },
            { _id: 'user6', mapSelected: 'map_o_1_s_23456', tabMapIdList: ['map_o_1_s_23456'] },
          ],
          shares: [
            { _id: 'share_1_3', ownerUser: 'user1', shareUser: 'user3', sharedMap: 'map_o_1_s_23456' },
            { _id: 'share_1_4', ownerUser: 'user1', shareUser: 'user4', sharedMap: 'map_o_1_s_23456' },
            { _id: 'share_1_5', ownerUser: 'user1', shareUser: 'user5', sharedMap: 'map_o_1_s_23456' },
            { _id: 'share_1_6', ownerUser: 'user1', shareUser: 'user6', sharedMap: 'map_o_1_s_23456' },
            { _id: 'share_2_1', ownerUser: 'user2', shareUser: 'user1', sharedMap: 'map_o_2_s_1' },
          ],
        }
      }
    )
  })
  test('deleteMapFrame', async() => {
    const database = {
      users: [ { _id: 'user1', mapSelected: 'map1', dataFrameSelected: 0 }],
      maps: [ { _id: 'map1', ownerUser: 'user1', dataHistory: ['h1'], dataFrames: ['f1', 'f2', 'f3'] }]
    }
    const modified = await resolveMutation(database, 'deleteMapFrame', [maps, 'user1'])
    expect(getElemById(modified.maps, 'map1').dataFrames).toEqual(['f2', 'f3'])
  })
  test('saveMap', async() => {
    const database = {
      users: [
        { _id: 'user1', mapSelected: 'map1'}
      ],
      maps: [
        { _id: 'map1',
          ownerUser:'user1',
          dataHistoryModifiers: [],
          dataHistory: [ mergeBase, mergeMutationA ]
        }
      ]
    }
    const modified = await resolveMutation(database, 'saveMap', [maps, 'map1', 'map', mergeMutationB])
    const expected = [
      {
        _id: 'map1',
        ownerUser:'user1',
        dataHistoryModifiers: [ { modifierType: "user", userId: "user1", sessionId: 0 } ],
        dataHistory: [ mergeBase, mergeMutationA, mergeResult ]
      }
    ]
    expect(modified.maps).toEqual(expected)
  })
  test('saveMapFrame', async() => {
    const database = {
      users: [ {_id: 'user1', mapSelected: 'map1', dataFrameSelected: 1}],
      maps: [ { _id: 'map1', ownerUser:'user1', dataFrames: [ 'mf1', 'omf', 'mf2' ] }]
    }
    const modified = await resolveMutation(database, 'saveMapFrame', [maps, 'map1', 1, 'nmf'])
    expect(getElemById(modified.maps, 'map1').dataFrames).toEqual([ 'mf1', 'nmf', 'mf2' ])
  })
  test('createNodeProp', async() => {
    const database = getMultiMapMultiSource([ [ { a: 'o' } ], [ { a: 'o' }, { b: 'o' } ] ])
    const modified = await resolveMutation(database, 'createNodeProp', [maps, 'npc', 'nvc'])
    const expected = getMultiMapMultiSource([ [ { a: 'o', npc: 'nvc' } ], [ { a: 'o', npc: 'nvc' }, { b: 'o', npc: 'nvc' } ] ])
    expect(modified).toEqual(expected)
  })
  test('createNodePropIfMissing', async() => {
    const database = getMultiMapMultiSource([ [ { } ], [ { }, { a: 'o' } ] ])
    const modified = await resolveMutation(database, 'createNodePropIfMissing', [maps, 'b', 'x'])
    const expected = getMultiMapMultiSource([ [ { b: 'x' } ], [ { b: 'x' }, { a: 'o', b: 'x' } ] ])
    expect(modified).toEqual(expected)
  })
  test('updateNodePropKey', async() => {
    const database = getMultiMapMultiSource([ [ { a: 'o' } ], [ { a: 'o' }, { b: 'o' } ] ])
    const modified = await resolveMutation(database, 'updateNodePropKey', [maps, 'a', 'aNew'])
    const expected = getMultiMapMultiSource([ [ { aNew: 'o' } ], [ { aNew: 'o' }, { b: 'o' } ] ])
    expect(modified).toEqual(expected)
  })
  test('updateNodePropValueBasedOnPreviousValue', async() => {
    const database = getMultiMapMultiSource([ [ { a: 'o' } ], [ { a: 'o' }, { b: 'o' } ] ])
    const modified = await resolveMutation(database, 'updateNodePropValueBasedOnPreviousValue', [maps, 'a', 'o', 'x'])
    const expected = getMultiMapMultiSource([ [ { a: 'x' } ], [ { a: 'x' }, { b: 'o' } ] ])
    expect(modified).toEqual(expected)
  })
  test('removeNodeProp', async() => {
    const database = getMultiMapMultiSource([ [ { a: 'o', npr: 'nvr' } ], [ { a: 'o', npr: 'nvr' }, { b: 'o', npr: 'nvr' } ] ])
    const modified = await resolveMutation(database, 'removeNodeProp', [maps, 'npr'])
    const expected = getMultiMapMultiSource([ [ { a: 'o' } ], [ { a: 'o' }, { b: 'o' } ] ])
    expect(modified).toEqual(expected)
  })
  test('deleteUnusedMaps', async() => {
    const database = {
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
    const modified = await resolveMutation(database, 'deleteUnusedMaps', [users, maps])
    const expected = [
      { _id: 'map10', path: ['map10'] },
      { _id: 'map11', path: ['map10', 'map11'] },
      { _id: 'map12', path: ['map10', 'map11', 'map12'] },
      { _id: 'map20', path: ['map20'] },
      { _id: 'map30', path: ['map30'] },
    ]
    expect(modified.maps).toEqual(expected)
  })
})
