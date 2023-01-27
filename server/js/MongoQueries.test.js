import { ACCESS_TYPES } from './Types'
import { describe, expect, test,  beforeEach, afterEach } from 'vitest'
import { getMultiMapMultiSource, mongoConnect, mongoDisconnect } from './MongoTestUtils'
import { resolveQuery } from './MongoTestUtils'

let users, maps, shares

describe("MongoQueriesTests", async() => {
  beforeEach(async () => {
    const dbQueries = await mongoConnect()
    users = dbQueries.collection("users")
    maps = dbQueries.collection("maps")
    shares = dbQueries.collection("shares")
  })
  afterEach(async () => {
    await mongoDisconnect()
  })
  test('openWorkspace', async() => {
    const database = {
      users: [
        {
          _id: 'user1',
          tabMapIdList: ['map1', 'map3', 'map2aa', 'map4'],
          mapSelected: 'map2aaa',
          dataFrameSelected: -1,
          name: 'user1',
          colorMode: 'dark',
        },
        { _id: 'user2', tabMapIdList: ['map2'], mapSelected: 'map2' }
      ],
      maps:  [
        { _id: 'map1', ownerUser: 'user1', path: [], dataHistory: [ [ { content: 'mapName1', path: ['r', 0] } ] ] },
        { _id: 'map2', ownerUser: 'user2', path: [], dataHistory: [ [ { content: 'mapName2', path: ['r', 0] } ] ] },
        { _id: 'map2a', ownerUser: 'user2', path: ['map2'], dataHistory: [ [ { content: 'mapName2a', path: ['r', 0] } ] ] },
        { _id: 'map2aa', ownerUser: 'user2', path: ['map2', 'map2a'], dataHistory: [ [ { content: 'mapName2aa', path: ['r', 0] } ] ] },
        {
          _id: 'map2aaa',
          ownerUser: 'user2',
          path: ['map2', 'map2a', 'map2aa'],
          dataFrames: ['f1', 'f2'],
          dataHistory: [ [], [ { path: ['g'] }, { content: 'mapName2aaa', path: ['r', 0] } ] ]
        },
        { _id: 'map3', ownerUser: 'user1', path: [], dataHistory: [ [ { content: 'mapName3', path: ['r', 0] } ] ] },
        { _id: 'map4', ownerUser: 'user1', path: [], dataHistory: [ [ { content: 'mapName4', path: ['r', 0] } ] ] },
      ],
      shares: [
        { _id: 'share1', access: 'view', status: 'accepted', ownerUser: 'user2', shareUser: 'user1', sharedMap: 'map2aa' },
      ]
    }
    const modified = await resolveQuery(database, 'openWorkspace', [users, 'user1'])
    const expected = [{
      name: 'user1',
      colorMode: 'dark',
      mapId: 'map2aaa', // TODO use mapSelected
      mapDataList: [ [ { path: ['g'] }, { content: 'mapName2aaa', path: ['r', 0] } ] ],
      dataFramesLen: 2,
      dataFrameSelected: -1,
      access: ACCESS_TYPES.VIEW,
      breadcrumbMapIdList: ['map2aa', 'map2aaa'],
      breadcrumbMapNameList: [ { name: 'mapName2aa' }, { name: 'mapName2aaa' } ],
      tabMapIdList: ['map1', 'map3', 'map2aa', 'map4'],
      tabMapNameList: [ { name: 'mapName1' }, { name:'mapName3' }, { name:'mapName2aa' }, { name:'mapName4' } ],
      tabMapSelected: 2
    }]
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
})
