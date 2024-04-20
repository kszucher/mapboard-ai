import { ACCESS_TYPES } from './Types'
import { describe, expect, test,  beforeEach, afterEach } from 'vitest'
import {mongoConnect, mongoDisconnect} from './MongoTestUtils'
import { resolveQuery } from './MongoTestUtils'

let users, maps, shares, sessions

describe("MongoQueriesTests", async() => {
  beforeEach(async () => {
    const dbQueries = await mongoConnect()
    users = dbQueries.collection("users")
    maps = dbQueries.collection("maps")
    shares = dbQueries.collection("shares")
    sessions = dbQueries.collection("sessions")
  })
  afterEach(async () => {
    await mongoDisconnect()
  })
  test('openWorkspace.nestedMap', async() => {
    const test = {
      users: [
        { _id: 'user1', name: 'user1', tabMapIdList: ['map1', 'map2'], colorMode: 'dark' },
      ],
      maps: [
        { _id: 'map1', name: 'mapName1', ownerUser: 'user1',  path: [] },
        { _id: 'map2', name: 'mapName2', ownerUser: 'user1', path: [] },
        { _id: 'map2a', name: 'mapName2a', ownerUser: 'user1', path: ['map2']},
        { _id: 'map2aa', name: 'mapName2aa', ownerUser: 'user1', path: ['map2', 'map2a'] },
        { _id: 'map2aaa', name: 'mapName2aaa', ownerUser: 'user1', path: ['map2', 'map2a', 'map2aa'], frames: [], framesInfo: [], versions: [ 'map2aaav1' ] },
      ],
      sessions: [
        { _id: 's1', jwtId: 'js1', userId: 'user1', mapId: 'map2aaa', frameId: '' }
      ]
    }
    const result = {
      name: 'user1',
      colorMode: 'dark',
      isShared: false,
      access: ACCESS_TYPES.EDIT,
      tabId: 1,
      mapId: 'map2aaa',
      frameId: '',
      mapDataList: [ 'map2aaav1' ],
      tabMapIdList: ['map1', 'map2'],
      tabMapNameList: [ { name: 'mapName1' }, { name:'mapName2' } ],
      breadcrumbMapIdList: ['map2', 'map2a', 'map2aa', 'map2aaa'],
      breadcrumbMapNameList: [ { name: 'mapName2' }, { name: 'mapName2a' }, { name: 'mapName2aa' }, { name: 'mapName2aaa' } ],
      frameIdList: []
    }
    expect(await resolveQuery(test, 'openWorkspace', [sessions, 'js1'])).toEqual(result)
  })
  test('openWorkspace.frame', async() => {
    const test = {
      users: [
        { _id: 'user1', name: 'user1', tabMapIdList: ['map1', 'map2'], colorMode: 'dark' },
      ],
      maps: [
        { _id: 'map1', name: 'mapName1', ownerUser: 'user1', path: [] },
        { _id: 'map2', name: 'mapName2', ownerUser: 'user1', path: [], frames: ['mf1', 'mf2'], framesInfo: [{ frameId: 'f1' }, { frameId: 'f2' }]},
      ],
      sessions: [
        { _id: 's1', jwtId: 'js1', userId: 'user1', mapId: 'map2', frameId: 'f2' }
      ]
    }
    const result = {
      name: 'user1',
      colorMode: 'dark',
      isShared: false,
      access: ACCESS_TYPES.EDIT,
      tabId: 1,
      mapId: 'map2',
      frameId: 'f2',
      mapDataList: [ 'mf2' ],
      tabMapIdList: ['map1', 'map2'],
      tabMapNameList: [ { name: 'mapName1' }, { name:'mapName2' } ],
      breadcrumbMapIdList: [ 'map2' ],
      breadcrumbMapNameList: [ { name: 'mapName2' } ],
      frameIdList: ['f1', 'f2']
    }
    expect(await resolveQuery(test, 'openWorkspace', [sessions, 'js1'])).toEqual(result)
  })
  test('openWorkspace.foreignMapView', async() => {
    const test = {
      users: [
        { _id: 'user1', name: 'user1', tabMapIdList: ['map1'], colorMode: 'dark' },
        { _id: 'user2'},
      ],
      maps: [
        { _id: 'map1', name: 'mapName1', ownerUser: 'user2',  path: [], frames: [], framesInfo: [], versions: [ 'map1v1' ] },
      ],
      shares: [
        { _id: 'share1', access: 'view', status: 'accepted', ownerUser: 'user2', shareUser: 'user1', sharedMap: 'map1' },
      ],
      sessions: [
        { _id: 's1', jwtId: 'js1', userId: 'user1', mapId: 'map1', frameId: '' }
      ]
    }
    const result = {
      name: 'user1',
      colorMode: 'dark',
      isShared: true,
      access: ACCESS_TYPES.VIEW,
      tabId: 0,
      mapId: 'map1',
      frameId: '',
      mapDataList: [ 'map1v1' ],
      tabMapIdList: ['map1'],
      tabMapNameList: [ { name: 'mapName1' } ],
      breadcrumbMapIdList: ['map1' ],
      breadcrumbMapNameList: [ { name: 'mapName1' } ],
      frameIdList: []
    }
    expect(await resolveQuery(test, 'openWorkspace', [sessions, 'js1'])).toEqual(result)
  })
  test('openWorkspace.foreignMapEdit', async() => {
    const test = {
      users: [
        { _id: 'user1', name: 'user1', tabMapIdList: ['map1'], colorMode: 'dark' },
      ],
      maps: [
        { _id: 'map1', name: 'mapName1', ownerUser: 'user2',  path: [], frames: [], framesInfo: [], versions: [ 'map1v1' ] },
      ],
      shares: [
        { _id: 'share1', access: 'edit', status: 'accepted', ownerUser: 'user2', shareUser: 'user1', sharedMap: 'map1' },
      ],
      sessions: [
        { _id: 's1', jwtId: 'js1', userId: 'user1', mapId: 'map1', frameId: '' }
      ]
    }
    const result = {
      name: 'user1',
      colorMode: 'dark',
      isShared: true,
      access: ACCESS_TYPES.EDIT,
      tabId: 0,
      mapId: 'map1',
      frameId: '',
      mapDataList: [ 'map1v1' ],
      tabMapIdList: ['map1'],
      tabMapNameList: [ { name: 'mapName1' } ],
      breadcrumbMapIdList: ['map1' ],
      breadcrumbMapNameList: [ { name: 'mapName1' } ],
      frameIdList: []
    }
    expect(await resolveQuery(test, 'openWorkspace', [sessions, 'js1'])).toEqual(result)
  })
  test('getUserShares', async() => {
    const test = {
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
    const result = {
      shareDataExport: [
        { _id: 'share1', access: 'view', status: 'accepted', shareUserEmail: 'user2@mail.com', sharedMapName: 'mapName1' },
        { _id: 'share2', access: 'edit', status: 'accepted', shareUserEmail: 'user2@mail.com', sharedMapName: 'mapName2' }
      ],
      shareDataImport: [
        { _id: 'share3', access: 'view', status: 'accepted', ownerUserEmail: 'user2@mail.com', sharedMapName: 'mapName3' },
        { _id: 'share4', access: 'edit', status: 'accepted', ownerUserEmail: 'user2@mail.com', sharedMapName: 'mapName4' }
      ]
    }
    expect(await resolveQuery(test, 'getUserShares', [shares, 'user1'])).toEqual(result)
  })
})
