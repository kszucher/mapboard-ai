const genNodeId = () => {
  const alphanumeric = '0123456789abcdefghijklmnopqrstuvwxyz'
  const randomAlphanumeric = { $substr: [ alphanumeric, { $toInt: { $multiply: [ { $rand: {} }, alphanumeric.length -  1 ] } }, 1 ] }
  const randomAlphanumeric8digit = new Array(8).fill(randomAlphanumeric)
  return { $concat: ['node', ...randomAlphanumeric8digit] }
}

async function selectMap(users, userId, mapId) {
  await users.findOneAndUpdate(
    { _id: userId },
    [{
      $set: {
        mapSelected: mapId,
        dataFrameSelected: -1
      }
    }]
  )
}

async function selectFirstMapFrame (users, userId) {
  await users.aggregate(
    [
      { $match: { _id: userId } },
      { $lookup: { from: "maps", localField: 'mapSelected', foreignField: "_id", as: 'map' } },
      { $unwind: "$map" },
      { $set: {
          dataFrameSelected: {
            $cond: {
              if: { $gt: [ { $size: "$map.dataFrames" }, 0 ] },
              then: 0,
              else: -1
            }
          }
        }
      },
      { $unset: 'map' },
      { $merge: 'users' }
    ]
  ).toArray()
}

async function selectPrevMapFrame (users, userId) {
  await users.aggregate(
    [
      { $match: { _id: userId } },
      { $lookup: { from: "maps", localField: 'mapSelected', foreignField: "_id", as: 'map' } },
      { $unwind: "$map" },
      { $set: {
          dataFrameSelected: {
            $cond: {
              if: { $and: [ { $eq: [ "$dataFrameSelected", 0 ] }, { $eq: [ { $size: "$map.dataFrames" }, 0 ] } ] },
              then: -1,
              else: {
                $cond: {
                  if: { $gt: [ "$dataFrameSelected", 0 ] },
                  then: { $subtract: [ "$dataFrameSelected", 1 ] },
                  else: "$dataFrameSelected"
                }
              }
            }
          }
        }
      },
      { $unset: 'map' },
      { $merge: 'users' }
    ]
  ).toArray()
}

async function selectNextMapFrame (users, userId) {
  await users.aggregate(
    [
      { $match: { _id: userId } },
      { $lookup: { from: "maps", localField: 'mapSelected', foreignField: "_id", as: 'map' } },
      { $unwind: "$map" },
      { $set: {
          dataFrameSelected: {
            $cond: {
              if: { $lt: ["$dataFrameSelected", { $subtract: [{ $size: "$map.dataFrames" }, 1] }] },
              then: { $add: ["$dataFrameSelected", 1] },
              else: "$dataFrameSelected"
            }
          }
        }
      },
      { $unset: 'map' },
      { $merge: 'users' }
    ]
  ).toArray()
}

async function createMapInTab(users, userId, mapId) {
  await users.findOneAndUpdate(
    { _id: userId },
    [{
      $set: {
        tabMapIdList: { $concatArrays: [ "$tabMapIdList", [ mapId ] ] },
        mapSelected: mapId,
      }
    }]
  )
}

async function mutateFrame (maps, userId, mutation) {
  await maps.aggregate(
    [
      { $lookup: { from: "users", localField: 'ownerUser', foreignField: "_id", as: 'user' } },
      { $unwind: '$user' },
      { $match: { $expr: { $and: [ { $eq: [ '$_id', '$user.mapSelected' ] }, { $eq: [ '$user._id', userId ] } ] } } },
      { $set: { dataFrames: mutation } },
      { $unset: 'user'},
      { $merge: 'maps' }
    ]
  ).toArray()
}

async function createMapFrameImport (maps, userId) {
  await mutateFrame(maps, userId, {
    $concatArrays: [
      { $slice: [ "$dataFrames", { $add: [ '$user.dataFrameSelected', 1 ] } ] },
      [ { $last: '$dataHistory' } ],
      { $slice: [ "$dataFrames", { $add: [ 1, '$user.dataFrameSelected' ] }, { $size: "$dataFrames" } ] }
    ]
  })
}

async function createMapFrameDuplicate (maps, userId) {
  await mutateFrame(maps, userId, {
    $concatArrays: [
      { $slice: [ "$dataFrames", { $add: [ '$user.dataFrameSelected', 1 ] } ] },
      [ { $arrayElemAt: [ "$dataFrames", '$user.dataFrameSelected' ] } ],
      { $slice: [ "$dataFrames", { $add: [ 1, '$user.dataFrameSelected' ] }, { $size: "$dataFrames" } ] }
    ]
  })
}

async function moveUpMapInTab (users, userId) {
  const tabIndex = { $indexOfArray: [ "$tabMapIdList", "$mapSelected" ] }
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

async function moveDownMapInTab (users, userId) {
  const tabIndex = { $indexOfArray: [ "$tabMapIdList", "$mapSelected" ] }
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

async function deleteMapFromUsers (users, filter) {
  const mapId = filter.tabMapIdList
  await users.updateMany(
    filter,
    [{
      $set: {
        mapSelected: {
          $cond: {
            if: { $eq: [ { $indexOfArray: [ "$tabMapIdList", mapId ] }, 0 ] },
            then: {
              $cond: {
                if: { $gt: [ { $size: "$tabMapIdList" }, 1 ] },
                then: { $arrayElemAt: [ "$tabMapIdList", 1 ] },
                else: null
              }
            },
            else: { $arrayElemAt: [ "$tabMapIdList", { $subtract: [ { $indexOfArray: [ "$tabMapIdList", mapId ] }, 1 ] } ] }
          }
        },
        tabMapIdList : {
          $filter : {
            input: "$tabMapIdList",
            as: "tabMapId",
            cond: { $ne: [ "$$tabMapId", mapId ] } }
        },
      }
    }]
  )
}

async function deleteMapFromShares (shares, filter) {
  await shares.deleteMany(filter)
}

async function deleteMapFrame (maps, userId) {
  await mutateFrame(maps, userId, {
    $concatArrays: [
      { $slice: [ "$dataFrames", '$user.dataFrameSelected' ] },
      { $slice: [ "$dataFrames", { $add: [ 1, '$user.dataFrameSelected' ] }, { $size: "$dataFrames" } ] }
    ]
  })
}

async function saveMap (maps, mapId, mergeType, mergeData) {
  const newMap = mergeType === 'map' ?  mergeData : { $concatArrays: [ { $last: '$dataHistory' }, [ mergeData ] ] }
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
                              { $eq: [ { $size: "$dataHistory" }, 1 ] },
                              { $and: [
                                  { $eq: [ { $getField: { field: 'modifierType', input: { $last: '$dataHistoryModifiers' } } }, 'user' ] },
                                  { $eq: [ { $getField: { field: 'userId', input: { $last: '$dataHistoryModifiers' } } }, '$ownerUser' ] },
                                  { $eq: [ { $getField: { field: 'sessionId', input: { $last: '$dataHistoryModifiers' } } }, 0] }
                                ]
                              }
                            ]
                          },
                          then: { $last: "$dataHistory" },
                          else: { $arrayElemAt: [ "$dataHistory", -2 ] }
                        }
                      }, 'O'),
                    getValuesByNodeIdAndNodePropId(
                      {
                        $cond: {
                          if: {
                            $or: [
                              { $eq: [ { $size: "$dataHistory" }, 1 ] },
                              { $and: [
                                  { $eq: [ { $getField: { field: 'modifierType', input: { $last: '$dataHistoryModifiers' } } }, 'user' ] },
                                  { $eq: [ { $getField: { field: 'userId', input: { $last: '$dataHistoryModifiers' } } }, '$ownerUser' ] },
                                  { $eq: [ { $getField: { field: 'sessionId', input: { $last: '$dataHistoryModifiers' } } }, 0] }
                                ]
                              }
                            ]
                          },
                          then: '$newMap',
                          else: { $last: "$dataHistory" }
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
          "data.dataHistory": {
            $concatArrays: [
              "$data.dataHistory",
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
          "data.dataHistoryModifiers": {
            $concatArrays: [
              "$data.dataHistoryModifiers",
              [{
                modifierType: { map: 'user', node: 'server' }[mergeType],
                userId: '$data.ownerUser',
                sessionId: 0,
              }]
            ]
          }
        }
      },
      { $replaceRoot: { newRoot: "$data" }, },
      { $merge: { into: "maps", on: "_id",  whenMatched: "replace", whenNotMatched: "insert" } }
    ]
  ).toArray()
}

async function saveMapFrame (maps, mapId, dataFrameSelected, mapData) {
  await maps.aggregate(
    [
      { $lookup: { from: "users", localField: 'ownerUser', foreignField: "_id", as: 'user' } },
      { $unwind: '$user' },
      { $match: { _id: mapId } },
      {
        $set: {
          dataFrames: {
            $cond: {
              if: { $ne: [ "$user.dataFrameSelected", -1 ] },
              then: {
                $concatArrays: [
                  { $slice: [ "$dataFrames", dataFrameSelected ] },
                  [ mapData ],
                  { $slice: [ "$dataFrames", { $add: [ 1, dataFrameSelected ] }, { $size: "$dataFrames" } ] }
                ]
              },
              else: "$dataFrames"
            }
          }
        }
      },
      { $unset: 'user' },
      { $merge: 'maps' }
    ]
  ).toArray()
}

async function nodeMapFun (maps, fun) {
  await maps.aggregate(
    [
      { $set: { dataFrames: { $map: { input: '$dataFrames', as: "map", in: { $map: { input: "$$map", as: "node", in: fun } } } } } },
      { $set: { dataHistory: { $map: { input: '$dataHistory', as: "map", in: { $map: { input: "$$map", as: "node", in: fun } } } } } },
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
  genNodeId,
  selectMap,
  selectFirstMapFrame,
  selectPrevMapFrame,
  selectNextMapFrame,
  createMapInTab,
  createMapFrameImport,
  createMapFrameDuplicate,
  moveUpMapInTab,
  moveDownMapInTab,
  deleteMapFromUsers,
  deleteMapFromShares,
  deleteMapFrame,
  saveMap,
  saveMapFrame,
  createNodeProp,
  createNodePropIfMissing,
  updateNodePropValueBasedOnPreviousValue,
  updateNodePropKey,
  removeNodeProp,
  deleteUnusedMaps
}
