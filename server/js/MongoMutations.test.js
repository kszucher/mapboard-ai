import { describe, expect, test,  beforeEach, afterEach } from 'vitest'
import { mongoConnect, mongoDisconnect, resolveMutation } from './MongoTestUtils'

let users, maps, shares, sessions

describe("MongoMutationsTests", async() => {
  beforeEach(async () => {
    const dbMutations = await mongoConnect()
    users = dbMutations.collection("users")
    maps = dbMutations.collection("maps")
    shares = dbMutations.collection("shares")
    sessions = dbMutations.collection("sessions")
  })
  afterEach(async () => {
    await mongoDisconnect()
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
    const test = {
      sessions: [
        {_id: 's1', jwtId: 'js1', userId: 'u1' },
        {_id: 's2', jwtId: 'js2', userId: 'u1'},
        {_id: 's3', jwtId: 'js3', userId: 'u2'}
      ] }
    const result = {
      sessions: [
        {_id: 's3', jwtId: 'js3', userId: 'u2'}
      ] }
    expect(await resolveMutation(test, 'resetSessions', [sessions, 'u1'])).toEqual(result)
  })
  test('selectMap', async() => {
    const test = {
      users: [ {_id: 'u1' } ],
      sessions: [
        { _id: 's1', jwtId: 'js1' },
        { _id: 's2', jwtId: 'js2' }
      ]
    }
    const result = {
      users: [ {_id: 'u1', lastSelectedMap: "m1" } ],
      sessions: [
        { _id: 's1', jwtId: 'js1' },
        { _id: 's2', jwtId: 'js2', mapId: 'm1' }
      ]
    }
    expect(await resolveMutation(test, 'selectMap', [users, 'u1', sessions, 'js2', 'm1', 'f1'])).toEqual(result)
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
  test('moveUpMapInTab.notIncluded', async() => {
    const test = { users: [ {_id: 'u1', tabMapIdList: ['m1', 'm2', 'm3'] } ] }
    const result = { users: [ {_id: 'u1', tabMapIdList: ['m1', 'm2', 'm3'] } ] }
    expect(await resolveMutation(test, 'moveUpMapInTab', [users, 'u1', 'm4'])).toEqual(result)
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
  test('moveDownMapInTab.notIncluded', async() => {
    const test = { users: [ {_id: 'u1', tabMapIdList: ['m1', 'm2', 'm3'] } ] }
    const result = { users: [ {_id: 'u1', tabMapIdList: ['m1', 'm2', 'm3'] } ] }
    expect(await resolveMutation(test, 'moveDownMapInTab', [users, 'u1', 'm4'])).toEqual(result)
  })
  test('appendMapInTab', async() => {
    const test = { users: [ {_id: 'u1', tabMapIdList: ['m1', 'm2'] } ] }
    const result = { users: [ {_id: 'u1', tabMapIdList: ['m1', 'm2', 'm3'] } ] }
    expect(await resolveMutation(test, 'appendMapInTab', [users, 'u1', 'm3'])).toEqual(result)
  })
  test('deleteMap', async() => {
    const test = {
      users: [
        { _id: 'u1', tabMapIdList: ['m1', 'm2'] },
        { _id: 'u2', tabMapIdList: ['m1', 'm3'] },
        { _id: 'u3', tabMapIdList: ['m1', 'm4'] },

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
      sessions: [
        {_id: 's1', jwtId: 'js1', userId: 'u1', mapId: 'm1'},
        {_id: 's2', jwtId: 'js2', userId: 'u2', mapId: 'm1'},
        {_id: 's3', jwtId: 'js3', userId: 'u3', mapId: 'm1'},
      ]
    }
    const result = {
      users: [
        { _id: 'u1', tabMapIdList: ['m2'] },
        { _id: 'u2', tabMapIdList: ['m3'] },
        { _id: 'u3', tabMapIdList: ['m4'] },
      ],
      maps: [
        { _id: 'm1', ownerUser: 'u1' },
        { _id: 'm2', ownerUser: 'u1' },
        { _id: 'm3', ownerUser: 'u2' },
        { _id: 'm4', ownerUser: 'u3' },
      ],
      shares: [],
      sessions: [
        {_id: 's1', jwtId: 'js1', userId: 'u1', mapId: ''},
        {_id: 's2', jwtId: 'js2', userId: 'u2', mapId: ''},
        {_id: 's3', jwtId: 'js3', userId: 'u3', mapId: ''},
      ]
    }
    expect(await resolveMutation(test, 'deleteMap', [users, shares, sessions, 'u1', 'm1'])).toEqual(result)
  })
  test('deleteShare', async() => {
    const test = {
      users: [
        { _id: 'u1', tabMapIdList: ['m1', 'm2'] },
        { _id: 'u2', tabMapIdList: ['m1', 'm3'] },
      ],
      maps: [
        { _id: 'm1', ownerUser: 'u2' },
        { _id: 'm2', ownerUser: 'u1' },
        { _id: 'm3', ownerUser: 'u2' },
      ],
      shares: [
        { _id: 's1', ownerUser: 'u1', shareUser: 'u2', sharedMap: 'm1' },
      ],
      sessions: [
        {_id: 's1', jwtId: 'js1', userId: 'u1', mapId: 'm1'},
        {_id: 's2', jwtId: 'js2', userId: 'u2', mapId: 'm1'},
      ]
    }
    const result = {
      users: [
        { _id: 'u1', tabMapIdList: ['m1', 'm2'] },
        { _id: 'u2', tabMapIdList: ['m3'] },
      ],
      maps: [
        { _id: 'm1', ownerUser: 'u2' },
        { _id: 'm2', ownerUser: 'u1' },
        { _id: 'm3', ownerUser: 'u2' },
      ],
      shares: [],
      sessions: [
        {_id: 's1', jwtId: 'js1', userId: 'u1', mapId: 'm1'},
        {_id: 's2', jwtId: 'js2', userId: 'u2', mapId: ''},
      ]
    }
    expect(await resolveMutation(test, 'deleteShare', [users, shares, sessions, 's1'])).toEqual(result)
  })
  test('saveMap', async() => {
    const test = {
      users: [ { _id: 'u1'}, { _id: 'u2'}, { _id: 'u3'} ],
      maps: [
        {
          _id: 'm1',
          ownerUser:'u1',
          versions: [
            [{nodeId: 's', a: 'vo'}, {nodeId: 't', a: 'vo', b: 'vo', c: 'vo', d: 'vo', e: 'vo', f: 'vo', g: 'vo', h: 'vo', i: 'vo'}],
            [{nodeId: 's', a: 'vo'}, {nodeId: 't', a: 'vo', b: 'vo', c: 'vo', d: 'va', e: 'va', f: 'va', j: 'va', l: 'vab'}],
          ],
          versionsInfo: [
            { modifierType: "user", userId: "u1", jwtId: 'j1', versionId: 0 },
            { modifierType: "user", userId: "u1", jwtId: 'j2', versionId: 1 }
          ],
        }
      ]
    }
    const result = {
      users: [ { _id: 'u1'}, { _id: 'u2'}, { _id: 'u3'} ],
      maps: [
        {
          _id: 'm1',
          ownerUser:'u1',
          versions: [
            [{nodeId: 's', a: 'vo'}, {nodeId: 't', a: 'vo', b: 'vo', c: 'vo', d: 'vo', e: 'vo', f: 'vo', g: 'vo', h: 'vo', i: 'vo'}],
            [{nodeId: 's', a: 'vo'}, {nodeId: 't', a: 'vo', b: 'vo', c: 'vo', d: 'va', e: 'va', f: 'va', j: 'va', l: 'vab'}],
            [{nodeId: 's', a: 'vo'}, {nodeId: 't', a: 'vo', b: 'vb', d: 'va', e: 'va', j: 'va', k: 'vb', l: 'vab'}],
          ],
          versionsInfo: [
            { modifierType: "user", userId: "u1", jwtId: 'j1', versionId: 0 },
            { modifierType: "user", userId: "u1", jwtId: 'j2', versionId: 1 },
            { modifierType: "user", userId: "u1", jwtId: 'j3', versionId: 2 }
          ],
        }
      ]
    }
    expect(await resolveMutation(test, 'saveMap', [maps, 'm1', 'j3', 'map',
      [{nodeId: 's', a: 'vo'}, {nodeId: 't', a: 'vo', b: 'vb', d: 'vo', e: 'vb', g: 'vo', h: 'vb', k: 'vb', l: 'vab'}]
    ])).toEqual(result)
  })
  test('deleteUnusedMaps', async() => {
    const test = {
      users: [
        {_id: 'u1', tabMapIdList: ['map10', 'map20'] },
        {_id: 'u2', tabMapIdList: ['map30'] }
      ],
      maps: [
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
      maps: [
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
