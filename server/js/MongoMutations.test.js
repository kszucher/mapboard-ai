import { describe, expect, test,  beforeEach, afterEach } from 'vitest'
import { getElemById, mongoConnect, mongoDisconnect, resolveMutation } from './MongoTestUtils'
const { mergeBase, mergeMutationA, mergeMutationB, mergeResult } = require('./MongoTestData')

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
  test('toggleColorMode', async() => {
    const database = { users: [ {_id: 'u1', colorMode: 'light' } ] }
    const modified = await resolveMutation(database, 'toggleColorMode', [users, 'u1'])
    expect(getElemById(modified.users, 'u1').colorMode).toEqual('dark')
  })
  test('resetSessions', async() => {
    const database = { users: [ {_id: 'u1', session: ['a', 'b'] } ] }
    const modified = await resolveMutation(database, 'resetSessions', [users, 'u1'])
    expect(getElemById(modified.users, 'u1').sessions).toEqual([])
  })
  test('selectMap', async() => {
    const database = { users: [ {_id: 'u1', sessions: [ { sessionId: 's1' }, { sessionId: 's2' } ] } ] }
    const modified = await resolveMutation(database, 'selectMap', [users, 'u1', 's2', 'm1', 'frame1'])
    const expected = [ { sessionId: 's1' }, { sessionId: 's2', mapId: 'm1', frameId: 'frame1' } ]
    expect(getElemById(modified.users, 'u1').sessions).toEqual(expected)
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
    const database = { users: [ {_id: 'u1', tabMapIdList: ['m1', 'm2'] } ] }
    const modified = await resolveMutation(database, 'appendMapInTab', [users, 'u1', 'm3'])
    expect(getElemById(modified.users, 'u1').tabMapIdList).toEqual(['m1', 'm2', 'm3'])
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
    const getDatabase = ({frames, framesInfo}) => ({
      users: [ { _id: 'u1'}],
      maps: [ { _id: 'm1', frames, framesInfo } ]
    })
    expect(await resolveMutation(
      getDatabase({ frames: [ 'f1', 'f2', 'f3' ], framesInfo: [ {frameId: 'f1'}, {frameId: 'f2'}, {frameId: 'f3'} ] }),
      'createMapFrameDuplicate', [maps, 'm1', 'f2', 'fn'])).toEqual(
      getDatabase({ frames: [ 'f1', 'f2', 'f2', 'f3' ], framesInfo: [ {frameId: 'f1'}, {frameId: 'f2'},  {frameId: 'fn'}, {frameId: 'f3'} ] }),
    )
  })
  test('deleteMap', async() => {
    const getSessions = (mapId) => ({sessions: [{sessionId: 's1', mapId, frameId: ''}]})
    const database = {
      users: [
        { _id: 'u1', ...getSessions('map_o_1'), tabMapIdList: ['map_o_1', 'map_o_1_s_23456', 'map_o_2_s_1'] },
        { _id: 'u2', ...getSessions('map_o_2'), tabMapIdList: ['map_o_2', 'map_o_1_s_23456'] },
        { _id: 'u3', ...getSessions('map_o_1_s_23456'), tabMapIdList: ['map_o_3', 'map_o_1_s_23456'] },
        { _id: 'u4', ...getSessions('map_o_1_s_23456'), tabMapIdList: ['map_o_1_s_23456', 'map_o_4'] },
        { _id: 'u5', ...getSessions('map_o_5'), tabMapIdList: ['map_o_5'] },
        { _id: 'u6', ...getSessions('map_o_1_s_23456'), tabMapIdList: ['map_o_1_s_23456'] },
      ],
      maps: [
        { _id: 'map_o_1_s_23456', ownerUser: 'u1' },
        { _id: 'map_o_1', ownerUser: 'u1' },
        { _id: 'map_o_2_s_1', ownerUser: 'u2' },
        { _id: 'map_o_2', ownerUser: 'u2' },
        { _id: 'map_o_3', ownerUser: 'u3' },
        { _id: 'map_o_4', ownerUser: 'u4' },
        { _id: 'map_o_5', ownerUser: 'u5' },
        { _id: 'map_o_6', ownerUser: 'u6' },
      ],
      shares: [
        { _id: 'share_1_2', ownerUser: 'u1', shareUser: 'u2', sharedMap: 'map_o_1_s_23456' },
        { _id: 'share_1_3', ownerUser: 'u1', shareUser: 'u3', sharedMap: 'map_o_1_s_23456' },
        { _id: 'share_1_4', ownerUser: 'u1', shareUser: 'u4', sharedMap: 'map_o_1_s_23456' },
        { _id: 'share_1_5', ownerUser: 'u1', shareUser: 'u5', sharedMap: 'map_o_1_s_23456' },
        { _id: 'share_1_6', ownerUser: 'u1', shareUser: 'u6', sharedMap: 'map_o_1_s_23456' },
        { _id: 'share_2_1', ownerUser: 'u2', shareUser: 'u1', sharedMap: 'map_o_2_s_1' },
      ],
    }
    expect(
      await resolveMutation(database, 'deleteMap', [users, shares, 'u1', 's1', 'map_o_1_s_23456'])
    ).toEqual(
      { ...database,
        ...{
          users: [
            { _id: 'u1', ...getSessions('map_o_1'), tabMapIdList: ['map_o_1', 'map_o_2_s_1'] },
            { _id: 'u2', ...getSessions('map_o_2'), tabMapIdList: ['map_o_2'] },
            { _id: 'u3', ...getSessions('map_o_3'), tabMapIdList: ['map_o_3'] },
            { _id: 'u4', ...getSessions('map_o_4'), tabMapIdList: ['map_o_4'] },
            { _id: 'u5', ...getSessions('map_o_5'), tabMapIdList: ['map_o_5'] },
            { _id: 'u6', ...getSessions(''), tabMapIdList: [] },
          ],
          shares: [
            { _id: 'share_2_1', ownerUser: 'u2', shareUser: 'u1', sharedMap: 'map_o_2_s_1' },
          ]
        }
      }
    )
    expect(
      await resolveMutation(database, 'deleteMap', [users, shares, 'u2', 's1', 'map_o_1_s_23456'])
    ).toEqual(
      { ...database,
        ...{
          users: [
            { _id: 'u1', ...getSessions('map_o_1'), tabMapIdList: ['map_o_1', 'map_o_1_s_23456', 'map_o_2_s_1'] },
            { _id: 'u2', ...getSessions('map_o_2'), tabMapIdList: ['map_o_2'] },
            { _id: 'u3', ...getSessions('map_o_1_s_23456'), tabMapIdList: ['map_o_3', 'map_o_1_s_23456'] },
            { _id: 'u4', ...getSessions('map_o_1_s_23456'), tabMapIdList: ['map_o_1_s_23456', 'map_o_4'] },
            { _id: 'u5', ...getSessions('map_o_5'), tabMapIdList: ['map_o_5'] },
            { _id: 'u6', ...getSessions('map_o_1_s_23456'), tabMapIdList: ['map_o_1_s_23456'] },
          ],
          shares: [
            { _id: 'share_1_3', ownerUser: 'u1', shareUser: 'u3', sharedMap: 'map_o_1_s_23456' },
            { _id: 'share_1_4', ownerUser: 'u1', shareUser: 'u4', sharedMap: 'map_o_1_s_23456' },
            { _id: 'share_1_5', ownerUser: 'u1', shareUser: 'u5', sharedMap: 'map_o_1_s_23456' },
            { _id: 'share_1_6', ownerUser: 'u1', shareUser: 'u6', sharedMap: 'map_o_1_s_23456' },
            { _id: 'share_2_1', ownerUser: 'u2', shareUser: 'u1', sharedMap: 'map_o_2_s_1' },
          ],
        }
      }
    )
  })
  test('deleteMapFrame', async() => {
    const getDatabase = ({frameId, frames, framesInfo}) => ({
      users: [ { _id: 'u1', sessions: [ { sessionId: 's1', mapId: 'm1', frameId } ] } ],
      maps: [ { _id: 'm1', frames, framesInfo } ]
    })
    expect(await resolveMutation(
      getDatabase({ frameId: 'f1', frames: [ 'f1', 'f2' ], framesInfo: [ {frameId: 'f1'}, {frameId: 'f2'} ] }),
      'deleteMapFrame', [users, maps, 'u1', 's1', 'm1', 'f1'])).toEqual(
      getDatabase({ frameId: 'f2', frames: [ 'f2' ], framesInfo: [ {frameId: 'f2'} ] })
    )
    expect(await resolveMutation(
      getDatabase({ frameId: 'f2', frames: [ 'f1', 'f2' ], framesInfo: [ {frameId: 'f1'}, {frameId: 'f2'} ] }),
      'deleteMapFrame', [users, maps, 'u1', 's1', 'm1', 'f2'])).toEqual(
      getDatabase({ frameId: 'f1', frames: [ 'f1' ], framesInfo: [ {frameId: 'f1'} ] })
    )
    expect(await resolveMutation(
      getDatabase({ frameId: 'f2', frames: [ 'f1' ], framesInfo: [ {frameId: 'f1'} ] }),
      'deleteMapFrame', [users, maps, 'u1', 's1', 'm1', 'f1'])).toEqual(
      getDatabase({ frameId: '', frames: [ ], framesInfo: [ ] })
    )
  })
  test('saveMap', async() => {
    const database = {
      users: [{ _id: 'u1'}],
      maps: [
        { _id: 'm1',
          ownerUser:'u1',
          versionsInfo: [ { modifierType: "user", userId: "user0", sessionId: 's1', versionId: 1 } ],
          versions: [ mergeBase, mergeMutationA ]
        }
      ]
    }
    const modified = await resolveMutation(database, 'saveMap', [maps, 'm1', 's1', 'map', mergeMutationB])
    const expected = [
      {
        _id: 'm1',
        ownerUser:'u1',
        versionsInfo: [
          { modifierType: "user", userId: "user0", sessionId: 's1', versionId: 1 },
          { modifierType: "user", userId: "u1", sessionId: 's1', versionId: 2 }
        ],
        versions: [ mergeBase, mergeMutationA, mergeResult ]
      }
    ]
    expect(modified.maps).toEqual(expected)
  })
  test('saveMapFrame', async() => {
    const database = {
      users: [ {_id: 'u1'} ],
      maps: [ { _id: 'm1', ownerUser: 'u1', frames: [ 'mf1', 'omf', 'mf2' ], framesInfo: [ {frameId: 'f1id'}, {frameId: 'f2id'}, {frameId: 'f3id'} ] }]
    }
    const modified = await resolveMutation(database, 'saveMapFrame', [maps, 'm1', 'f2id', 'nmf'])
    expect(getElemById(modified.maps, 'm1').frames).toEqual([ 'mf1', 'nmf', 'mf2' ])
  })
  test('deleteUnusedMaps', async() => {
    const database = {
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
    const modified = await resolveMutation(database, 'deleteUnusedMaps', [users, maps])
    const expected = [
      { _id: 'map10', path: [] },
      { _id: 'map11', path: ['map10'] },
      { _id: 'map12', path: ['map10', 'map11'] },
      { _id: 'map20', path: [] },
      { _id: 'map30', path: [] },
    ]
    expect(modified.maps).toEqual(expected)
  })
})
