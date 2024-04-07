import { ACCESS_TYPES } from './Types'
import { describe, expect, test,  beforeEach, afterEach } from 'vitest'
import { mongoConnect, mongoDisconnect } from './MongoTestUtils'
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
        { _id: 'user1', name: 'user1', tabMapIdList: ['map1', 'map3', 'map2aa', 'map4'], sessions: [ { sessionId: 'session1', mapId: 'map2aaa', frameId } ], colorMode: 'dark' },
        { _id: 'user2', name: 'user2', tabMapIdList: ['map2'], sessions: [ { sessionId: 'session1', mapId: 'map2' } ] }
      ],
      maps:  [
        { _id: 'map1', name: 'mapName1', ownerUser: 'user1', path: [], versions: [ 'map1v1' ] },
        { _id: 'map2', name: 'mapName2', ownerUser: 'user2', path: [], versions: [ 'map2v1' ] },
        { _id: 'map2a', name: 'mapName2a', ownerUser: 'user2', path: ['map2'], versions: [ 'map2av1' ] },
        { _id: 'map2aa', name: 'mapName2aa', ownerUser: 'user2', path: ['map2', 'map2a'], versions: [ 'map2aav1' ] },
        { _id: 'map2aaa', name: 'mapName2aaa', ownerUser: 'user2', path: ['map2', 'map2a', 'map2aa'], frames: ['mf1', 'mf2'], framesInfo: [{ frameId: 'f1' }, { frameId: 'f2' }], versions: [ 'map2aaav1' ] },
        { _id: 'map3', name: 'mapName3', ownerUser: 'user1', path: [], versions: [ 'map3v1' ] },
        { _id: 'map4', name: 'mapName4', ownerUser: 'user1', path: [], versions: [ 'map4v1' ] },
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
    expect(modifiedA).toEqual(getExpected({frameId: '', mapDataList: [ 'map2aaav1' ]}))
    expect(modifiedB).toEqual(getExpected({frameId: 'f2', mapDataList: [ 'mf2' ] }))
  })
  test('getUserShares', async() => {
    const database = {
      users: [
        { _id: 'user1', email: 'user1@mail.com' },
        { _id: 'user2', email: 'user2@mail.com' },
      ],
      maps: [
        { _id: 'map1', name: 'mapName1', versions: [ 'map1v1' ] },
        { _id: 'map2', name: 'mapName2', versions: [ 'map2v1' ] },
        { _id: 'map3', name: 'mapName3', versions: [ 'map3v1' ] },
        { _id: 'map4', name: 'mapName4', versions: [ 'map4v1' ] },
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
})
