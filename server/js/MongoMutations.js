const { getLastElemField, getIndexOfFrameId, getFrameIdOfIndex, getSessionField, setSession } = require('./MongoHelpers')

async function updateWorkspace(users, userId, sessionId) {
  await users.aggregate(
    [
      { $match: {_id: userId } },
      {
        $set: {
          sessions: {
            $switch: {
              branches: [
                {
                  case: { $eq: [ { $size: '$sessions' }, 0 ] },
                  then: [{
                    sessionId,
                    mapId: { $arrayElemAt: [ '$tabMapIdList', 0 ] },
                    frameId: ''
                  }],
                },
                {
                  case: {
                    $eq: [ {
                      $size: {
                        $filter: {
                          input: '$sessions',
                          as: 'session',
                          cond: { $eq: [ "$$session.sessionId", sessionId ] }
                        }
                      }
                    }, 0 ]
                  },
                  then: {
                    $concatArrays: [
                      '$sessions',
                      [{
                        sessionId,
                        mapId: getLastElemField('mapId', '$sessions'),
                        frameId: getLastElemField('frameId', '$sessions')
                      }]
                    ]
                  }
                }],
              default: '$sessions'
            }
          }
        }
      },
      { $set: { signInCount: { $add: [ '$signInCount', 1 ] } } },
      { $out: 'users' }
    ]
  ).toArray()
}

async function toggleColorMode(users, userId) {
  await users.findOneAndUpdate(
    { _id: userId },
    [{ $set: { colorMode: { $cond: { if: { $eq: [ '$colorMode', 'dark' ] }, then: 'light', else: 'dark' } } } }]
  )
}

async function selectMap(users, userId, sessionId, mapId, frameId) {
  await users.aggregate([
      { $match: {_id: userId } },
      {...setSession(sessionId, mapId, frameId)},
      { $out: 'users' }
    ]
  ).toArray()
}

async function moveUpMapInTab (users, userId, mapId) {
  const tabIndex = { $indexOfArray: [ "$tabMapIdList", mapId ] }
  await users.findOneAndUpdate(
    { _id: userId },
    [{
      $set: {
        tabMapIdList: {
          $cond: {
            if: { $eq: [ tabIndex, 0 ] },
            then: "$tabMapIdList",
            else: {
              $concatArrays: [
                { $slice: [ "$tabMapIdList", { $subtract: [ tabIndex, 1 ] } ] },
                [ { $arrayElemAt: ["$tabMapIdList", tabIndex] } ],
                [ { $arrayElemAt: ["$tabMapIdList", { $subtract: [ tabIndex, 1 ] } ] } ],
                { $slice: [ "$tabMapIdList", { $add: [ tabIndex, 1 ] }, { $size: "$tabMapIdList" } ] }
              ]
            }
          }
        }
      }
    }]
  )
}

async function moveDownMapInTab (users, userId, mapId) {
  const tabIndex = { $indexOfArray: [ "$tabMapIdList", mapId ] }
  await users.findOneAndUpdate(
    { _id: userId },
    [{
      $set: {
        tabMapIdList: {
          $cond: {
            if: { $eq: [ tabIndex, { $subtract: [ { $size: "$tabMapIdList" }, 1 ] } ] },
            then: "$tabMapIdList",
            else: {
              $concatArrays: [
                { $slice: [ "$tabMapIdList", tabIndex ] },
                [ { $arrayElemAt: ["$tabMapIdList", { $add: [ tabIndex, 1 ] } ] } ],
                [ { $arrayElemAt: ["$tabMapIdList", tabIndex] } ],
                { $slice: [ "$tabMapIdList", { $add: [ tabIndex, 2 ] }, { $size: "$tabMapIdList" } ] }
              ]
            }
          }
        }
      }
    }]
  )
}

async function appendMapInTab(users, userId, mapId) {
  await users.findOneAndUpdate(
    { _id: userId },
    [{ $set: { tabMapIdList: { $concatArrays: [ "$tabMapIdList", [ mapId ] ] } } }]
  )
}

async function createMapFrame (maps, mapId, frameId, newFrameId, source) {
  await maps.aggregate(
    [
      { $match: { _id: mapId } },
      {
        $set: {
          frames: {
            $concatArrays: [
              { $slice: [ "$frames", { $sum: [ getIndexOfFrameId(frameId), 1 ] } ] },
              [ source ],
              { $slice: [ "$frames", { $sum: [ getIndexOfFrameId(frameId), 1, { $multiply: [ -1, { $size: "$frames" } ] } ] } ] }
            ]
          },
          framesInfo: {
            $concatArrays: [
              { $slice: [ "$framesInfo", { $sum: [ getIndexOfFrameId(frameId), 1 ] } ] },
              [ { frameId: newFrameId } ],
              { $slice: [ "$framesInfo", { $sum: [ getIndexOfFrameId(frameId), 1, { $multiply: [ -1, { $size: "$framesInfo" } ] } ] } ] }
            ]
          }
        }
      },
      { $merge: 'maps' }
    ]
  ).toArray()
}

async function createMapFrameImport (maps, mapId, frameId, newFrameId) {
  await createMapFrame (maps, mapId, frameId, newFrameId, { $last: '$versions' })
}

async function createMapFrameDuplicate (maps, mapId, frameId, newFrameId) {
  await createMapFrame (maps, mapId, frameId, newFrameId, { $arrayElemAt: [ '$frames', getIndexOfFrameId(frameId) ] })
}

async function deleteMap (users, shares, userId, sessionId, mapId) {
  const mapTabIndex = { $indexOfArray: [ "$tabMapIdList", mapId ] }
  const mapInTab = { $ne: [ mapTabIndex, -1 ] }
  const tabSize = { $size: "$tabMapIdList" }
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
                  { $eq: [ '$_id', { $getField: { field: 'ownerUser', input: { $first: '$map' } } } ] },
                ]
              },
              {
                $and: [
                  { $eq: [ '$_id', { $getField: { field: 'shareUser', input: { $first: '$share' } } } ] },
                  { $eq: [ userId, { $getField: { field: 'ownerUser', input: { $first: '$share' } } } ] },
                ]
              },
              {
                $and: [
                  { $eq: [ '$_id', userId ] },
                  { $eq: [ '$_id', { $getField: { field: 'shareUser', input: { $first: '$share' } } } ] },
                ]
              }
            ]
          }
        }
      },
      { ...setSession(
          sessionId,
          {
            $switch: {
              branches: [
                {
                  case: { $and: [ mapInTab, { $eq: [ tabSize, 1 ] } ] },
                  then: ''
                },
                {
                  case: { $and: [ mapInTab, { $gt: [ tabSize, 1 ] }, { $eq: [ mapTabIndex, 0 ] } ] },
                  then: { $arrayElemAt: [ '$tabMapIdList', 1 ] }
                },
                {
                  case: { $and: [ mapInTab, { $gt: [ tabSize, 1 ] }, { $gt: [ mapTabIndex, 0 ] } ] },
                  then: { $arrayElemAt: [ '$tabMapIdList', { $subtract: [ mapTabIndex, 1 ] } ] }
                },
              ],
              default: getSessionField(sessionId, 'mapId')
            }
          },
          ''
        )
      },
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
      { $unset: 'map' },
      { $unset: 'share' },
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
}

async function deleteMapFrame (users, maps, userId, sessionId, mapId, frameId) {
  await users.aggregate(
    [
      { $match: { _id: userId } },
      { $set: { mapId } },
      { $lookup: { from: "maps", localField: 'mapId', foreignField: "_id", as: "mapList" } },
      { $set: { 'map': { $first: "$mapList" } } },
      { $set: { frames: '$map.frames' } },
      { $set: { framesInfo: '$map.framesInfo' } },
      {...setSession(
          sessionId,
          mapId,
          {
            $cond: {
              if: { $gt: [ getIndexOfFrameId(frameId), 0 ] },
              then: getFrameIdOfIndex({ $subtract: [ getIndexOfFrameId(frameId), 1 ] }),
              else: getFrameIdOfIndex(1)
            }
          }
        )
      },
      { $unset: [ 'mapId', 'mapList', 'map', 'frames', 'framesInfo' ] },
      { $out: 'users' }
    ]
  ).toArray()
  await maps.aggregate(
    [
      { $match: { _id: mapId } },
      {
        $set: {
          frames: {
            $concatArrays: [
              { $slice: [ "$frames", getIndexOfFrameId(frameId) ] },
              { $slice: [ "$frames", { $sum: [ getIndexOfFrameId(frameId), 1, { $multiply: [ -1, { $size: "$frames" } ] } ] } ] }
            ]
          },
          framesInfo: {
            $concatArrays: [
              { $slice: [ "$framesInfo", getIndexOfFrameId(frameId) ] },
              { $slice: [ "$framesInfo", { $sum: [getIndexOfFrameId(frameId), 1, { $multiply: [ -1, { $size: "$framesInfo" } ] } ] } ] }
            ]
          }
        }
      },
      { $merge: 'maps' }
    ]
  ).toArray()
}

async function saveMap (maps, mapId, sessionId, mergeType, mergeData) {
  const newMap = mergeType === 'map' ?  mergeData : { $concatArrays: [ { $last: '$versions' }, [ mergeData ] ] }
  const getValuesByNodeIdAndNodePropId = (input, mutationId) => (
    {
      $objectToArray: {
        $mergeObjects: {
          $map: {
            input: input,
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
                    getValuesByNodeIdAndNodePropId(
                      {
                        $cond: {
                          if: {
                            $or: [
                              { $eq: [ { $size: "$versions" }, 1 ] },
                              { $and: [
                                  { $eq: [ { $getField: { field: 'modifierType', input: { $last: '$versionsInfo' } } }, 'user' ] },
                                  { $eq: [ { $getField: { field: 'userId', input: { $last: '$versionsInfo' } } }, '$ownerUser' ] },
                                  { $eq: [ { $getField: { field: 'sessionId', input: { $last: '$versionsInfo' } } }, sessionId] }
                                ]
                              }
                            ]
                          },
                          then: { $last: "$versions" },
                          else: { $arrayElemAt: [ "$versions", -2 ] }
                        }
                      }, 'O'),
                    getValuesByNodeIdAndNodePropId(
                      {
                        $cond: {
                          if: {
                            $or: [
                              { $eq: [ { $size: "$versions" }, 1 ] },
                              { $and: [
                                  { $eq: [ { $getField: { field: 'modifierType', input: { $last: '$versionsInfo' } } }, 'user' ] },
                                  { $eq: [ { $getField: { field: 'userId', input: { $last: '$versionsInfo' } } }, '$ownerUser' ] },
                                  { $eq: [ { $getField: { field: 'sessionId', input: { $last: '$versionsInfo' } } }, sessionId] }
                                ]
                              }
                            ]
                          },
                          then: '$newMap',
                          else: { $last: "$versions" }
                        }
                      }, 'A'),
                    getValuesByNodeIdAndNodePropId('$newMap', 'B')
                  ]
                }
              }
            },
            { $unwind: '$helperArray' },
            { $group: { _id: "$helperArray.k", nodePropInfo: { $mergeObjects: "$helperArray.v" } } },
            { $sort: { '_id' : 1 } },
            { $unwind: '$nodePropInfo' },
            { $group: { _id: "$nodePropInfo.nodeId", nodePropInfoArray: { $push: "$nodePropInfo" } } },
            { $sort: { '_id' : 1 } },
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
                sessionId,
                // TODO add versionId
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

async function saveMapFrame (maps, mapId, frameId, mapData) {
  await maps.aggregate(
    [
      { $match: { _id: mapId } },
      {
        $set: {
          frames: {
            $cond: {
              if: { $ne: [ frameId, '' ] },
              then: {
                $concatArrays: [
                  { $slice: [ "$frames", getIndexOfFrameId(frameId) ] },
                  [ mapData ],
                  { $slice: [ "$frames", { $add: [ 1, getIndexOfFrameId(frameId) ] }, { $size: "$frames" } ] }
                ]
              },
              else: "$frames"
            }
          }
        }
      },
      { $merge: 'maps' }
    ]
  ).toArray()
}

async function nodeMapFun (maps, fun) {
  await maps.aggregate(
    [
      { $set: { frames: { $map: { input: '$frames', as: "map", in: { $map: { input: "$$map", as: "node", in: fun } } } } } },
      { $set: { versions: { $map: { input: '$versions', as: "map", in: { $map: { input: "$$map", as: "node", in: fun } } } } } },
      { $merge: 'maps' }
    ]
  ).toArray()
}

async function createNodeProp (maps, nodePropKey, nodePropValue) {
  return await nodeMapFun(maps,
    {
      $setField: {
        field: nodePropKey,
        input: '$$node',
        value: nodePropValue
      }
    }
  )
}

async function createNodePropIfMissing (maps, nodePropKey, nodePropValue) {
  return await nodeMapFun(maps,
    {
      $cond: {
        if: { $eq: [{ $type: `$$node.${nodePropKey}` }, 'missing'] },
        then: {
          $setField: {
            field: nodePropKey,
            input: '$$node',
            value: nodePropValue
          }
        },
        else: "$$node"
      }
    }
  )
}

async function updateNodePropKey (maps, nodePropKeyFrom, nodePropKeyTo) {
  return await nodeMapFun(maps,
    {
      $arrayToObject: {
        $map: {
          input: {
            $objectToArray: "$$node"
          },
          as: "nodeProp",
          in: {
            $cond: {
              if: {
                $eq: [ "$$nodeProp.k", nodePropKeyFrom ]
              },
              then: {
                $setField: {
                  field: "k",
                  input: '$$nodeProp',
                  value: nodePropKeyTo,
                }
              },
              else: "$$nodeProp"
            }
          }
        }
      }
    }
  )
}

async function updateNodePropValueBasedOnPreviousValue (maps, nodePropKey, nodePropValueFrom, nodePropValueTo) {
  return await nodeMapFun(maps,
    {
      $cond: {
        if: { $eq: [ `$$node.${nodePropKey}`, nodePropValueFrom ] },
        then: {
          $setField: {
            field: nodePropKey,
            input: '$$node',
            value: nodePropValueTo
          }
        },
        else: "$$node"
      }
    }
  )
}

async function removeNodeProp (maps, nodePropKey) {
  return await nodeMapFun(maps,
    {
      $setField: {
        field: nodePropKey,
        input: '$$node',
        value: '$$REMOVE'
      }
    }
  )
}

async function deleteUnusedMaps(users, maps) {
  const allTabMap = await users.distinct('tabMapIdList')
  await maps.aggregate(
    [
      {
        $match: {
          $expr: {
            $or: [
              { $and: [ { $eq: [ { $size: '$path' }, 1 ] }, { $setIsSubset: [ '$path', allTabMap ] } ] },
              { $gt: [ { $size: '$path' }, 1 ] }
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
  updateWorkspace,
  toggleColorMode,
  selectMap,
  moveUpMapInTab,
  moveDownMapInTab,
  appendMapInTab,
  createMapFrameImport,
  createMapFrameDuplicate,
  deleteMap,
  deleteMapFrame,
  saveMap,
  saveMapFrame,
  createNodeProp,
  createNodePropIfMissing,
  updateNodePropKey,
  updateNodePropValueBasedOnPreviousValue,
  removeNodeProp,
  deleteUnusedMaps
}
