async function toggleColorMode (users, userId) {
  await users.findOneAndUpdate(
    { _id: userId },
    [ { $set: { colorMode: { $cond: { if: { $eq: [ '$colorMode', 'dark' ] }, then: 'light', else: 'dark' } } } } ]
  )
}

async function resetSessions (sessions, userId) {
  await sessions.aggregate(
    [
      { $match: { $expr: { $ne: [ '$userId', userId ] } } },
      { $out: 'sessions' }
    ]
  ).toArray()
}

async function selectMap (users, userId, sessions, jwtId, mapId) {
  await sessions.findOneAndUpdate(
    { jwtId },
    [ { $set: { mapId } } ]
  )
  await users.findOneAndUpdate(
    { _id: userId },
    [ { $set: { lastSelectedMap: mapId } } ]
  )
}

async function moveUpMapInTab (users, userId, mapId) {
  await users.findOneAndUpdate(
    { _id: userId },
    [
      { $set: { tabIndex: { $indexOfArray: [ "$tabMapIdList", mapId ] } } },
      {
        $set: {
          tabMapIdList: {
            $cond: {
              if: { $gt: [ '$tabIndex', 0 ] },
              then: {
                $concatArrays: [
                  { $slice: [ "$tabMapIdList", { $subtract: [ '$tabIndex', 1 ] } ] },
                  [ { $arrayElemAt: [ "$tabMapIdList", '$tabIndex' ] } ],
                  [ { $arrayElemAt: [ "$tabMapIdList", { $subtract: [ '$tabIndex', 1 ] } ] } ],
                  { $slice: [ "$tabMapIdList", { $add: [ '$tabIndex', 1 ] }, { $size: "$tabMapIdList" } ] }
                ]
              },
              else: "$tabMapIdList",
            }
          }
        }
      },
      { $unset: 'tabIndex' }
    ]
  )
}

async function moveDownMapInTab (users, userId, mapId) {
  await users.findOneAndUpdate(
    { _id: userId },
    [
      { $set: { tabIndex: { $indexOfArray: [ "$tabMapIdList", mapId ] } } },
      {
        $set: {
          tabMapIdList: {
            $cond: {
              if: { $and: [ { $ne: ['$tabIndex', -1 ] }, { $lt: [ '$tabIndex', { $subtract: [ { $size: "$tabMapIdList" }, 1 ] } ] } ] },
              then: {
                $concatArrays: [
                  { $slice: [ "$tabMapIdList", '$tabIndex' ] },
                  [ { $arrayElemAt: [ "$tabMapIdList", { $add: [ '$tabIndex', 1 ] } ] } ],
                  [ { $arrayElemAt: [ "$tabMapIdList", '$tabIndex' ] } ],
                  { $slice: [ "$tabMapIdList", { $add: [ '$tabIndex', 2 ] }, { $size: "$tabMapIdList" } ] }
                ]
              },
              else: "$tabMapIdList",
            }
          }
        }
      },
      { $unset: 'tabIndex' }
    ]
  )
}

async function appendMapInTab (users, userId, mapId) {
  await users.findOneAndUpdate(
    { _id: userId },
    [ { $set: { tabMapIdList: { $concatArrays: [ "$tabMapIdList", [ mapId ] ] } } } ]
  )
}

async function deleteMap (users, shares, sessions, userId, mapId) {
  await users.aggregate(
    [
      { $lookup: { from: "maps", localField: '_id', foreignField: "ownerUser", pipeline: [ { $match: { _id: mapId } } ], as: "map" } },
      { $lookup: { from: "shares", localField: '_id', foreignField: "shareUser", pipeline: [ { $match: { sharedMap: mapId } } ], as: 'share' } },
      { $match: {
          $expr: {
            $or: [
              {
                $and: [
                  { $eq: [ '$_id', userId ] },
                  { $eq: [ userId, { $getField: { field: 'ownerUser', input: { $first: '$map' } } } ] },
                ]
              },
              {
                $and: [
                  { $eq: [ '$_id', { $getField: { field: 'shareUser', input: { $first: '$share' } } } ] },
                  { $eq: [ userId, { $getField: { field: 'ownerUser', input: { $first: '$share' } } } ] },
                ]
              },
            ]
          }
        }
      },
      { $unset: 'map' },
      { $unset: 'share' },
      {
        $set: {
          tabMapIdList : {
            $filter : {
              input: "$tabMapIdList",
              as: "tabMapId",
              cond: { $ne: [ "$$tabMapId", mapId ] } }
          },
        }
      },
      { $merge: 'users' }
    ]
  ).toArray()
  await shares.aggregate(
    [
      {
        $match: {
          $expr: {
            $not: {
              $and: [
                { $eq: [ mapId, '$sharedMap' ] },
                { $or: [ { $eq: [ userId, '$ownerUser' ] }, { $eq: [ userId, '$shareUser' ] } ] }
              ]
            }
          }
        }
      },
      { $out: 'shares' }
    ]
  ).toArray()
  await sessions.aggregate(
    [
      { $match: { mapId } },
      { $set: { mapId: '' } },
      { $merge: 'sessions' }
    ]
  ).toArray()
}

async function deleteShare (users, shares, sessions, shareId) {
  const share = await shares.findOne({ _id: shareId })
  await users.aggregate(
    [
      { $match: { $expr: { $eq: [ '$_id', share.shareUser ] } } },
      {
        $set: {
          tabMapIdList : {
            $filter : {
              input: "$tabMapIdList",
              as: "tabMapId",
              cond: { $ne: [ "$$tabMapId", share.sharedMap ] } }
          },
        }
      },
      { $merge: 'users' }
    ]
  ).toArray()
  await sessions.aggregate(
    [
      { $match: { $expr: { $and : [ { $eq: [ '$mapId', share.sharedMap ] }, { $eq: [ '$userId', share.shareUser ] } ] } } },
      { $set: { mapId: '' } },
      { $merge: 'sessions' }
    ]
  ).toArray()
  await shares.deleteOne({ _id: shareId })
}

async function saveMap (maps, mapId, jwtId, mergeType, mergeData) {
  const newMap = mergeType === 'map' ?  mergeData : { $concatArrays: [ { $last: '$versions' }, [ mergeData ] ] }
  const shouldAppend = () => ({
    $or: [
      { $eq: [ { $size: "$versions" }, 1 ] },
      { $and: [
          { $eq: [ { $getField: { field: 'modifierType', input: { $last: '$versionsInfo' } } }, 'user' ] },
          { $eq: [ { $getField: { field: 'userId', input: { $last: '$versionsInfo' } } }, '$ownerUser' ] },
          { $eq: [ { $getField: { field: 'jwtId', input: { $last: '$versionsInfo' } } }, jwtId] }
        ]
      }
    ]
  })
  const getValuesByNodeIdAndNodePropId = (input, mutationId) => (
    {
      $objectToArray: {
        $mergeObjects: {
          $map: {
            input: {
              $filter: {
                input: input,
                as: 'node',
                cond: { $ne: [ {$type: "$$node.nodeId"}, 'missing' ] }
              }
            },
            as: "node",
            in: {
              $arrayToObject: {
                $map: {
                  input: { $objectToArray: '$$node' },
                  as: "nodeProp",
                  in: {
                    k: { $concat: ['$$node.nodeId', '$$nodeProp.k'] },
                    v: {
                      nodeId: '$$node.nodeId',
                      nodePropId: "$$nodeProp.k",
                      [ 'value' + mutationId ]: "$$nodeProp.v",
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  )
  await maps.aggregate(
    [
      { $match: { _id: mapId } },
      {
        $facet: {
          data: [],
          groupResult: [
            {
              $set: { newMap }
            },
            {
              $set: {
                helperArray: {
                  $concatArrays: [
                    getValuesByNodeIdAndNodePropId({ $cond: { if: shouldAppend(), then: { $last: "$versions" }, else: { $arrayElemAt: [ "$versions", -2 ] } } }, 'O'),
                    getValuesByNodeIdAndNodePropId({ $cond: { if: shouldAppend(), then: '$newMap', else: { $last: "$versions" } } }, 'A'),
                    getValuesByNodeIdAndNodePropId('$newMap', 'B')
                  ]
                }
              }
            },
            { $unwind: '$helperArray' },
            { $group: { _id: "$helperArray.k", nodePropInfo: { $mergeObjects: "$helperArray.v" } } },
            // { $sort: { '_id' : 1 } }, // use only for testing
            { $unwind: '$nodePropInfo' },
            { $group: { _id: "$nodePropInfo.nodeId", nodePropInfoArray: { $push: "$nodePropInfo" } } },
            // { $sort: { '_id' : 1 } }, // use only for testing
          ]
        }
      },
      { $unwind: "$data", },
      {
        $set: {
          "data.versions": {
            $concatArrays: [
              "$data.versions",
              [{
                $map: {
                  input: '$groupResult',
                  as: "node",
                  in: {
                    $arrayToObject: {
                      $filter: {
                        input: {
                          $map: {
                            input: '$$node.nodePropInfoArray',
                            as: "npi",
                            in: {
                              $switch: {
                                branches: [
                                  {
                                    case: {
                                      $and: [
                                        { $and: [ "$$npi.valueO", "$$npi.valueA", "$$npi.valueB" ] },
                                        { $and: { $eq: [ "$$npi.valueO", "$$npi.valueA" ] } },
                                        { $and: { $eq: [ "$$npi.valueO", "$$npi.valueB" ] } }
                                      ]
                                    },
                                    then: { k: '$$npi.nodePropId', v: '$$npi.valueO' }
                                  },
                                  {
                                    case: {
                                      $and: [
                                        { $and: [ "$$npi.valueO", "$$npi.valueA", "$$npi.valueB" ] },
                                        { $and: { $eq: [ "$$npi.valueO", "$$npi.valueA" ] } },
                                        { $and: { $not: { $eq: [ "$$npi.valueO", "$$npi.valueB" ] } } }
                                      ]
                                    },
                                    then: { k: '$$npi.nodePropId', v: '$$npi.valueB' }
                                  },
                                  {
                                    case: {
                                      $and: [
                                        { $and: [ "$$npi.valueO", "$$npi.valueA", "$$npi.valueB" ] },
                                        { $and: { $not: { $eq: [ "$$npi.valueO", "$$npi.valueA" ] } } },
                                      ]
                                    },
                                    then: { k: '$$npi.nodePropId', v: '$$npi.valueA' }
                                  },
                                  {
                                    case: {
                                      $and: [ { $not: "$$npi.valueO" }, "$$npi.valueA", { $not: "$$npi.valueB" } ]
                                    },
                                    then: { k: '$$npi.nodePropId', v: '$$npi.valueA' }
                                  },
                                  {
                                    case: {
                                      $and: [ { $not: '$$npi.valueO' }, { $not: "$$npi.valueA" }, "$$npi.valueB" ]
                                    },
                                    then: { k: '$$npi.nodePropId', v: '$$npi.valueB' }
                                  },
                                  {
                                    case: {
                                      $and: [ { $not: '$$npi.valueO' }, "$$npi.valueA", "$$npi.valueB" ]
                                    },
                                    then: { k: '$$npi.nodePropId', v: '$$npi.valueB' }
                                  },
                                ],
                                default: '$$REMOVE'
                              }
                            }
                          }
                        },
                        as: "elem",
                        cond: { $ne: [ "$$elem", null ] }
                      }
                    }
                  }
                }
              }]
            ]
          },
          "data.versionsInfo": {
            $concatArrays: [
              "$data.versionsInfo",
              [{
                modifierType: { map: 'user', node: 'server' }[mergeType],
                userId: '$data.ownerUser',
                jwtId,
                versionId: { $add: [ { $getField: { field: 'versionId', input: { $last: '$data.versionsInfo' } } }, 1 ] }
              }]
            ]
          }
        }
      },
      { $replaceRoot: { newRoot: "$data" } },
      { $merge: "maps" }
    ]
  ).toArray()
}

async function deleteUnusedMaps(users, maps) {
  const allTabMap = await users.distinct('tabMapIdList')
  await maps.aggregate(
    [
      {
        $match: {
          $expr: {
            $or: [
              { $and: [ { $eq: [ { $size: '$path' }, 0 ] }, { $setIsSubset: [ ['$_id'], allTabMap ] } ] },
              { $gt: [ { $size: '$path' }, 0 ] }
            ]
          }
        }
      },
      { $out: 'maps' }
    ]
  ).toArray()
  const allMapWithoutTabOrphans = await maps.distinct('_id')
  await maps.aggregate(
    [
      { $match: { $expr: { $setIsSubset: [ '$path', allMapWithoutTabOrphans ] } } },
      { $out: 'maps' }
    ]
  ).toArray()
}

module.exports = {
  toggleColorMode,
  resetSessions,
  selectMap,
  moveUpMapInTab,
  moveDownMapInTab,
  appendMapInTab,
  deleteMap,
  deleteShare,
  saveMap,
  deleteUnusedMaps
}
