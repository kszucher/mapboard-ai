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
    const getDatabase = ({frameId}) => ({
      users: [
        {
          _id: 'user1',
          tabMapIdList: ['map1', 'map3', 'map2aa', 'map4'],
          name: 'user1',
          colorMode: 'dark',
          sessions: [ { sessionId: 'session1', mapId: 'map2aaa', frameId } ]
        },
        {
          _id: 'user2',
          tabMapIdList: ['map2'],
          sessions: [ { sessionId: 'session1', mapId: 'map2' } ]
        }
      ],
      maps:  [
        { _id: 'map1', ownerUser: 'user1', path: [], versions: [ [ { content: 'mapName1', path: ['r', 0] } ] ] },
        { _id: 'map2', ownerUser: 'user2', path: [], versions: [ [ { content: 'mapName2', path: ['r', 0] } ] ] },
        { _id: 'map2a', ownerUser: 'user2', path: ['map2'], versions: [ [ { content: 'mapName2a', path: ['r', 0] } ] ] },
        { _id: 'map2aa', ownerUser: 'user2', path: ['map2', 'map2a'], versions: [ [ { content: 'mapName2aa', path: ['r', 0] } ] ] },
        {
          _id: 'map2aaa',
          ownerUser: 'user2',
          path: ['map2', 'map2a', 'map2aa'],
          frames: [
            [ { path: ['g'] }, {} ],
            [ { path: ['g'] }, {} ]
          ],
          framesInfo: [
            [ { frameId: 'f1' } ],
            [ { frameId: 'f2' } ]
          ],
          versions: [
            [ { path: ['g'] }, { content: 'mapName2aaa', path: ['r', 0] } ]
          ]
        },
        { _id: 'map3', ownerUser: 'user1', path: [], versions: [ [ { content: 'mapName3', path: ['r', 0] } ] ] },
        { _id: 'map4', ownerUser: 'user1', path: [], versions: [ [ { content: 'mapName4', path: ['r', 0] } ] ] },
      ],
      shares: [
        { _id: 'share1', access: 'view', status: 'accepted', ownerUser: 'user2', shareUser: 'user1', sharedMap: 'map2aa' },
      ]
    })
    const modifiedA = (await resolveQuery(getDatabase({frameId: ''}), 'openWorkspace', [users, 'user1', 'session1'])).at(0)
    const modifiedB = (await resolveQuery(getDatabase({frameId: 'f2'}), 'openWorkspace', [users, 'user1', 'session1'])).at(0)
    const getExpected = ({frameId, mapDataList}) => ({
      name: 'user1',
      colorMode: 'dark',
      access: ACCESS_TYPES.VIEW,
      tabId: 2,
      mapId: 'map2aaa',
      frameId,
      mapDataList,
      tabMapIdList: ['map1', 'map3', 'map2aa', 'map4'],
      tabMapNameList: [ { name: 'mapName1' }, { name:'mapName3' }, { name:'mapName2aa' }, { name:'mapName4' } ],
      breadcrumbMapIdList: ['map2aa', 'map2aaa'],
      breadcrumbMapNameList: [ { name: 'mapName2aa' }, { name: 'mapName2aaa' } ],
      frameIdList: ['f1', 'f2']
    })
    expect(modifiedA).toEqual(getExpected({frameId: '', mapDataList: [ [ { path: ['g'] }, { content: 'mapName2aaa', path: ['r', 0] } ] ]}))
    expect(modifiedB).toEqual(getExpected({frameId: 'f2', mapDataList: [ [ { path: ['g'] }, {} ] ] }))
  })
  test('getUserShares', async() => {
    const database = {
      users: [
        { _id: 'user1', email: 'user1@mail.com' },
        { _id: 'user2', email: 'user2@mail.com' },
      ],
      maps: [
        { _id: 'map1', versions: [ [ { }, { content: 'mapName1', path: ['r', 0] } ] ] },
        { _id: 'map2', versions: [ [ { }, { content: 'mapName2', path: ['r', 0] } ] ] },
        { _id: 'map3', versions: [ [ { }, { content: 'mapName3', path: ['r', 0] } ] ] },
        { _id: 'map4', versions: [ [ { }, { content: 'mapName4', path: ['r', 0] } ] ] },
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
          versions: [
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
          frames: [ [ ] ]
        },
        { _id: 'map11',
          versions: [
            [
              { },
              { content: 'map11name' },
              { linkType: 'internal', link: 'map111', content: 'map111link' }
            ]
          ],
          frames: [ [ ] ]
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
