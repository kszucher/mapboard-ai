import { describe, expect, test,  beforeEach, afterEach } from 'vitest'
import { mongoConnect, mongoDisconnect, resolveMutation } from './MongoTestUtils'

let users, maps, shares

describe("MongoMutationsTests", async() => {
  beforeEach(async () => {
    const dbMutations = await mongoConnect()
    users = dbMutations.collection("users")
    maps = dbMutations.collection("maps")
    shares = dbMutations.collection("shares")
  })
  afterEach(async () => {
    await mongoDisconnect()
  })
  test('updateWorkspace.createUsingFirstTab', async() => {
    const test = { users: [ {_id: 'u1', signInCount: 1, tabMapIdList: ['m1', 'm2'], sessions: [ ] } ] }
    const result = { users: [ {_id: 'u1', signInCount: 2, tabMapIdList: ['m1', 'm2'], sessions: [ { sessionId: 's1', mapId: 'm1', frameId: '' } ] } ] }
    expect(await resolveMutation(test, 'updateWorkspace', [users, 'u1', 's1'])).toEqual(result)
  })
  test('updateWorkspace.createUsingLastSession', async() => {
    const test = { users: [ {_id: 'u1', signInCount: 1, sessions: [ { sessionId: 's1', mapId: 'm1', frameId: 'f1' } ] } ] }
    const result = { users: [ {_id: 'u1', signInCount: 2, sessions: [ { sessionId: 's1', mapId: 'm1', frameId: 'f1'}, { sessionId: 's2', mapId: 'm1', frameId: 'f1'} ] } ] }
    expect(await resolveMutation(test, 'updateWorkspace', [users, 'u1', 's2'])).toEqual(result)
  })
  test('updateWorkspace.keep', async() => {
    const test = { users: [ {_id: 'u1', signInCount: 1, sessions: [ { sessionId: 's1', mapId: 'm1', frameId: 'f1' } ] } ] }
    const result = { users: [ {_id: 'u1', signInCount: 2, sessions: [ { sessionId: 's1', mapId: 'm1', frameId: 'f1' } ] } ] }
    expect(await resolveMutation(test, 'updateWorkspace', [users, 'u1', 's1'])).toEqual(result)
  })
  test('toggleColorMode.l2d', async() => {
    const test = { users: [ {_id: 'u1', colorMode: 'light' } ] }
    const result = { users: [ {_id: 'u1', colorMode: 'dark' } ] }
    expect(await resolveMutation(test, 'toggleColorMode', [users, 'u1'])).toEqual(result)
  })
  test('toggleColorMode.d2l', async() => {
    const test = { users: [ {_id: 'u1', colorMode: 'dark' } ] }
    const result = { users: [ {_id: 'u1', colorMode: 'light' } ] }
    expect(await resolveMutation(test, 'toggleColorMode', [users, 'u1'])).toEqual(result)
  })
  test('resetSessions', async() => {
    const test = { users: [ {_id: 'u1', sessions: ['s1', 's2'] } ] }
    const result = { users: [ {_id: 'u1', sessions: [] } ] }
    expect(await resolveMutation(test, 'resetSessions', [users, 'u1'])).toEqual(result)
  })
  test('selectMap', async() => {
    const test = { users: [ {_id: 'u1', sessions: [ { sessionId: 's1' }, { sessionId: 's2' } ] } ] }
    const result = { users: [ {_id: 'u1', sessions: [ { sessionId: 's1' }, { sessionId: 's2', mapId: 'm1', frameId: 'f1' } ] } ] }
    expect(await resolveMutation(test, 'selectMap', [users, 'u1', 's2', 'm1', 'f1'])).toEqual(result)
  })
  test('moveUpMapInTab.canMove', async() => {
    const test = { users: [ {_id: 'u1', tabMapIdList: ['m1', 'm2', 'm3'] } ] }
    const result = { users: [ {_id: 'u1', tabMapIdList: ['m1', 'm3', 'm2'] } ] }
    expect(await resolveMutation(test, 'moveUpMapInTab', [users, 'u1', 'm3'])).toEqual(result)
  })
  test('moveUpMapInTab.cannotMove', async() => {
    const test = { users: [ {_id: 'u1', tabMapIdList: ['m1', 'm2', 'm3'] } ] }
    const result = { users: [ {_id: 'u1', tabMapIdList: ['m1', 'm2', 'm3'] } ] }
    expect(await resolveMutation(test, 'moveUpMapInTab', [users, 'u1', 'm1'])).toEqual(result)
  })
  test('moveDownMapInTab.canMove', async() => {
    const test = { users: [ {_id: 'u1', tabMapIdList: ['m1', 'm2', 'm3'] } ] }
    const result = { users: [ {_id: 'u1', tabMapIdList: ['m2', 'm1', 'm3'] } ] }
    expect(await resolveMutation(test, 'moveDownMapInTab', [users, 'u1', 'm1'])).toEqual(result)
  })
  test('moveDownMapInTab.cannotMove', async() => {
    const test = { users: [ {_id: 'u1', tabMapIdList: ['m1', 'm2', 'm3'] } ] }
    const result = { users: [ {_id: 'u1', tabMapIdList: ['m1', 'm2', 'm3'] } ] }
    expect(await resolveMutation(test, 'moveDownMapInTab', [users, 'u1', 'm3'])).toEqual(result)
  })
  test('appendMapInTab', async() => {
    const test = { users: [ {_id: 'u1', tabMapIdList: ['m1', 'm2'] } ] }
    const result = { users: [ {_id: 'u1', tabMapIdList: ['m1', 'm2', 'm3'] } ] }
    expect(await resolveMutation(test, 'appendMapInTab', [users, 'u1', 'm3'])).toEqual(result)
  })
  test('createMapFrameImport.withoutFrames', async() => {
    const test = {
      users: [ { _id: 'u1'}],
      maps: [ { _id: 'm1', versions: ['v1'], frames: [ ], framesInfo: [ ] } ]
    }
    const result = {
      users: [ { _id: 'u1'}],
      maps: [ { _id: 'm1', versions: ['v1'], frames: ['v1'], framesInfo: [ {frameId: 'fn'} ] } ]
    }
    expect(await resolveMutation(test, 'createMapFrameImport', [maps, 'm1', '', 'fn'])).toEqual(result)
  })
  test('createMapFrameImport.withFrames', async() => {
    const test = {
      users: [ { _id: 'u1'}],
      maps: [ { _id: 'm1', versions: ['v1'], frames: ['f1', 'f2', 'f3'], framesInfo: [ {frameId: 'f1'}, {frameId: 'f2'}, {frameId: 'f3'} ] } ]
    }
    const result = {
      users: [ { _id: 'u1'}],
      maps: [ { _id: 'm1', versions: ['v1'], frames: ['f1', 'f2', 'v1', 'f3'], framesInfo: [ { frameId: 'f1'}, {frameId: 'f2'}, {frameId: 'fn'}, {frameId: 'f3'} ] } ]
    }
    expect(await resolveMutation(test, 'createMapFrameImport', [maps, 'm1', 'f2', 'fn'])).toEqual(result)
  })
  test('createMapFrameDuplicate', async() => {
    const test = {
      users: [ { _id: 'u1'}],
      maps: [ { _id: 'm1', frames: [ 'f1', 'f2', 'f3' ], framesInfo: [ {frameId: 'f1id'}, {frameId: 'f2id'}, {frameId: 'f3id'} ] } ]
    }
    const result = {
      users: [ { _id: 'u1'}],
      maps: [ { _id: 'm1', frames: [ 'f1', 'f2', 'f2', 'f3' ], framesInfo: [ {frameId: 'f1id'}, {frameId: 'f2id'},  {frameId: 'f_id'}, {frameId: 'f3id'} ] } ]
    }
    expect(await resolveMutation(test, 'createMapFrameDuplicate', [maps, 'm1', 'f2id', 'f_id'])).toEqual(result)
  })
  test('deleteMap.owned', async() => {
    const test = {
      users: [
        { _id: 'u1', sessions: [{sessionId: 's1', mapId: 'm1', frameId: ''}], tabMapIdList: ['m1', 'm2'] },
        { _id: 'u2', sessions: [{sessionId: 's1', mapId: 'm1', frameId: ''}], tabMapIdList: ['m1', 'm3'] },
        { _id: 'u3', sessions: [{sessionId: 's1', mapId: 'm1', frameId: ''}], tabMapIdList: ['m1', 'm4'] },

      ],
      maps: [
        { _id: 'm1', ownerUser: 'u1' },
        { _id: 'm2', ownerUser: 'u1' },
        { _id: 'm3', ownerUser: 'u2' },
        { _id: 'm4', ownerUser: 'u3' },
      ],
      shares: [
        { _id: 's1', ownerUser: 'u1', shareUser: 'u2', sharedMap: 'm1' },
        { _id: 's2', ownerUser: 'u1', shareUser: 'u3', sharedMap: 'm1' },
      ],
    }
    const result = {
      users: [
        { _id: 'u1', sessions: [{sessionId: 's1', mapId: 'm2', frameId: ''}], tabMapIdList: ['m2'] },
        { _id: 'u2', sessions: [{sessionId: 's1', mapId: 'm3', frameId: ''}], tabMapIdList: ['m3'] },
        { _id: 'u3', sessions: [{sessionId: 's1', mapId: 'm4', frameId: ''}], tabMapIdList: ['m4'] },
      ],
      maps: [
        { _id: 'm1', ownerUser: 'u1' },
        { _id: 'm2', ownerUser: 'u1' },
        { _id: 'm3', ownerUser: 'u2' },
        { _id: 'm4', ownerUser: 'u3' },
      ],
      shares: []
    }
    expect(await resolveMutation(test, 'deleteMap', [users, shares, 'u1', 's1', 'm1'])).toEqual(result)
  })
  test('deleteMap.notOwned', async() => {
    const test = {
      users: [
        { _id: 'u1', sessions: [{sessionId: 's1', mapId: 'm1', frameId: ''}], tabMapIdList: ['m1', 'm2'] },
        { _id: 'u2', sessions: [{sessionId: 's1', mapId: 'm1', frameId: ''}], tabMapIdList: ['m1', 'm3'] },
        { _id: 'u3', sessions: [{sessionId: 's1', mapId: 'm1', frameId: ''}], tabMapIdList: ['m1', 'm4'] },
      ],
      maps: [
        { _id: 'm1', ownerUser: 'u2' },
        { _id: 'm2', ownerUser: 'u1' },
        { _id: 'm3', ownerUser: 'u2' },
        { _id: 'm4', ownerUser: 'u3' },
      ],
      shares: [
        { _id: 's1', ownerUser: 'u2', shareUser: 'u1', sharedMap: 'm1' },
        { _id: 's2', ownerUser: 'u2', shareUser: 'u3', sharedMap: 'm1' },
      ],
    }
    const result = {
      users: [
        { _id: 'u1', sessions: [{sessionId: 's1', mapId: 'm2', frameId: ''}], tabMapIdList: ['m2'] },
        { _id: 'u2', sessions: [{sessionId: 's1', mapId: 'm1', frameId: ''}], tabMapIdList: ['m1', 'm3'] },
        { _id: 'u3', sessions: [{sessionId: 's1', mapId: 'm1', frameId: ''}], tabMapIdList: ['m1', 'm4'] },
      ],
      maps: [
        { _id: 'm1', ownerUser: 'u2' },
        { _id: 'm2', ownerUser: 'u1' },
        { _id: 'm3', ownerUser: 'u2' },
        { _id: 'm4', ownerUser: 'u3' },
      ],
      shares: [
        { _id: 's2', ownerUser: 'u2', shareUser: 'u3', sharedMap: 'm1' },
      ],
    }
    expect(await resolveMutation(test, 'deleteMap', [users, shares, 'u1', 's1', 'm1'])).toEqual(result)
  })
  test('deleteMapFrame.fromStart', async() => {
    const test = {
      users: [ { _id: 'u1', sessions: [ { sessionId: 's1', mapId: 'm1', frameId: 'f1' } ] } ],
      maps: [ { _id: 'm1', frames: [ 'f1', 'f2' ], framesInfo: [ {frameId: 'f1'}, {frameId: 'f2'} ] } ]
    }
    const result = {
      users: [ { _id: 'u1', sessions: [ { sessionId: 's1', mapId: 'm1', frameId: 'f2' } ] } ],
      maps: [ { _id: 'm1', frames: [ 'f2' ], framesInfo: [ {frameId: 'f2'} ] } ]
    }
    expect(await resolveMutation(test, 'deleteMapFrame', [users, maps, 'u1', 's1', 'm1', 'f1'])).toEqual(result)
  })
  test('deleteMapFrame.fromEnd', async() => {
    const test = {
      users: [ { _id: 'u1', sessions: [ { sessionId: 's1', mapId: 'm1', frameId: 'f2' } ] } ],
      maps: [ { _id: 'm1', frames: [ 'f1', 'f2' ], framesInfo: [ {frameId: 'f1'}, {frameId: 'f2'} ] } ]
    }
    const result = {
      users: [ { _id: 'u1', sessions: [ { sessionId: 's1', mapId: 'm1', frameId: 'f1' } ] } ],
      maps: [ { _id: 'm1', frames: [ 'f1' ], framesInfo: [ {frameId: 'f1'} ] } ]
    }
    expect(await resolveMutation(test, 'deleteMapFrame', [users, maps, 'u1', 's1', 'm1', 'f2'])).toEqual(result)
  })
  test('deleteMapFrame.last', async() => {
    const test = {
      users: [ { _id: 'u1', sessions: [ { sessionId: 's1', mapId: 'm1', frameId: 'f2' } ] } ],
      maps: [ { _id: 'm1', frames: [ 'f1' ], framesInfo: [ {frameId: 'f1'} ] } ]
    }
    const result = {
      users: [ { _id: 'u1', sessions: [ { sessionId: 's1', mapId: 'm1', frameId: '' } ] } ],
      maps: [ { _id: 'm1', frames: [ ], framesInfo: [ ] } ]
    }
    expect(await resolveMutation(test, 'deleteMapFrame', [users, maps, 'u1', 's1', 'm1', 'f1'])).toEqual(result)
  })
  test('saveMap', async() => {
    const original = [
      {nodeId: 's', a: 'vo'},
      {nodeId: 't', a: 'vo', b: 'vo', c: 'vo', d: 'vo', e: 'vo', f: 'vo', g: 'vo', h: 'vo', i: 'vo'},
    ]
    const mutationA = [
      {nodeId: 's', a: 'vo'},
      {nodeId: 't', a: 'vo', b: 'vo', c: 'vo', d: 'va', e: 'va', f: 'va', j: 'va', l: 'vab'}
    ]
    const mutationB = [
      {nodeId: 's', a: 'vo'},
      {nodeId: 't', a: 'vo', b: 'vb', d: 'vo', e: 'vb', g: 'vo', h: 'vb', k: 'vb', l: 'vab'}
    ]
    const mergeAB = [
      {nodeId: 's', a: 'vo'},
      {nodeId: 't', a: 'vo', b: 'vb', d: 'va', e: 'va', j: 'va', k: 'vb', l: 'vab'}
    ]
    const test = {
      users: [ { _id: 'u1'} ],
      maps: [ {
        _id: 'm1',
        ownerUser:'u1',
        versionsInfo: [
          { modifierType: "user", userId: "user0", sessionId: 's1', versionId: 1 }
        ],
        versions: [ original, mutationA ]
      } ]
    }
    const result = {
      users: [ { _id: 'u1'} ],
      maps: [
        {
          _id: 'm1',
          ownerUser:'u1',
          versionsInfo: [
            { modifierType: "user", userId: "user0", sessionId: 's1', versionId: 1 },
            { modifierType: "user", userId: "u1", sessionId: 's1', versionId: 2 }
          ],
          versions: [ original, mutationA, mergeAB ]
        }
      ]
    }
    expect(await resolveMutation(test, 'saveMap', [maps, 'm1', 's1', 'map', mutationB])).toEqual(result)
  })
  test('saveMapFrame', async() => {
    const test = {
      users: [ {_id: 'u1'} ],
      maps: [ { _id: 'm1', ownerUser: 'u1', frames: [ 'mf1', 'omf', 'mf2' ], framesInfo: [ {frameId: 'f1id'}, {frameId: 'f2id'}, {frameId: 'f3id'} ] }]
    }
    const result = {
      users: [ {_id: 'u1'} ],
      maps: [ { _id: 'm1', ownerUser: 'u1', frames: [ 'mf1', 'nmf', 'mf2' ], framesInfo: [ {frameId: 'f1id'}, {frameId: 'f2id'}, {frameId: 'f3id'} ] }]
    }
    expect(await resolveMutation(test, 'saveMapFrame', [maps, 'm1', 'f2id', 'nmf'])).toEqual(result)
  })
  test('deleteUnusedMaps', async() => {
    const test = {
      users: [
        {_id: 'u1', tabMapIdList: ['map10', 'map20'] },
        {_id: 'u2', tabMapIdList: ['map30'] }
      ],
      maps:  [
        { _id: 'map10', path: [] },
        { _id: 'map11', path: ['map10'] },
        { _id: 'map12', path: ['map10', 'map11'] },
        { _id: 'map20', path: [] },
        { _id: 'map22', path: ['map20', 'map21'] },
        { _id: 'map30', path: [] },
        { _id: 'map40', path: [] },
        { _id: 'map41', path: ['map40'] },
      ]
    }
    const result = {
      users: [
        {_id: 'u1', tabMapIdList: ['map10', 'map20'] },
        {_id: 'u2', tabMapIdList: ['map30'] }
      ],
      maps:  [
        { _id: 'map10', path: [] },
        { _id: 'map11', path: ['map10'] },
        { _id: 'map12', path: ['map10', 'map11'] },
        { _id: 'map20', path: [] },
        { _id: 'map30', path: [] },
      ]
    }
    expect(await resolveMutation(test, 'deleteUnusedMaps', [users, maps])).toEqual(result)
  })
})
