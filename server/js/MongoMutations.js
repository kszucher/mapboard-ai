async function replaceBreadcrumbs(users, userId, mapId) {
  await users.findOneAndUpdate(
    { _id: userId },
    [ { $set: { breadcrumbMapIdList: [ mapId ] } } ],
  )
}

async function appendBreadcrumbs(users, userId, mapId) {
  await users.findOneAndUpdate(
    { _id: userId },
    [{
      $set: {
        breadcrumbMapIdList: { $concatArrays: [ "$breadcrumbMapIdList", [ mapId ] ] } }
    }],
  )
}

async function sliceBreadcrumbs(users, userId, mapId) {
  await users.findOneAndUpdate(
    { _id: userId },
    [{
      $set: {
        breadcrumbMapIdList: {
          $slice: [ "$breadcrumbMapIdList", { $add: [ { $indexOfArray: ["$breadcrumbMapIdList", mapId ] }, 1 ] } ]
        }
      }
    }]
  )
}

async function appendTabsReplaceBreadcrumbs(users, userId, mapId) {
  await users.findOneAndUpdate(
    { _id: userId },
    [{
      $set: {
        tabMapIdList: {
          $concatArrays: [ "$tabMapIdList", [ mapId ] ]
        },
        breadcrumbMapIdList:
          [ mapId ]
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
        breadcrumbMapIdList: {
          $cond: {
            if: {$eq: [{$indexOfArray: ["$tabMapIdList", mapId]}, 0]},
            then: {
              $cond: {
                if: { $gt: [{ $size: "$tabMapIdList" }, 1] },
                then: [{ $arrayElemAt: ["$tabMapIdList", 1] }],
                else: []
              }
            },
            else: [{$arrayElemAt: ["$tabMapIdList", {$subtract: [{$indexOfArray: ["$tabMapIdList", mapId]}, 1]}]}]
          }
        },
        tabMapIdList : {
          $filter : {input: "$tabMapIdList", as:"tabMapId", cond: {$ne: ["$$tabMapId", mapId]}}
        }
      }
    }]
  )
}

async function deleteMapFromShares (shares, filter) {
  await shares.deleteMany(filter)
}

async function moveUpMapInTab (users, userId, mapId) {
  const tabIndex = { $indexOfArray: ["$tabMapIdList", mapId] }
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
  const tabIndex = { $indexOfArray: ["$tabMapIdList", mapId] }
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

async function openPrevFrame (maps, mapId) {
  await maps.findOneAndUpdate(
    { _id: mapId },
    [{
      $set: {
        frameSelected: {
          $cond: {
            if: { $gt: [ "$frameSelected", 0 ] },
            then: { $subtract: [ "$frameSelected", 1 ] },
            else: "$frameSelected"
          }
        }
      }
    }]
  )
}

async function openNextFrame (maps, mapId) {
  await maps.findOneAndUpdate(
    { _id: mapId },
    [{
      $set: {
        frameSelected: {
          $cond: {
            if: { $lt: [ "$frameSelected", { $subtract: [ { $size: "$dataFrames" }, 1 ] } ] },
            then: { $add: [ "$frameSelected", 1 ] },
            else: "$frameSelected"
          }
        }
      }
    }]
  )
}

async function importFrame (maps, mapId) {
  await maps.findOneAndUpdate(
    { _id: mapId },
    [
      { $set: { dataFrames: { $concatArrays: [ "$dataFrames", [ { $last: "$dataHistory" } ] ] } } },
      { $set: { frameSelected: { $subtract : [ { $size: "$dataFrames" }, 1 ] } } }
    ],
  )
}

async function duplicateFrame (maps, mapId) {
  await maps.findOneAndUpdate(
    { _id: mapId },
    [{
      $set: {
        dataFrames: {
          $concatArrays: [
            { $slice: [ "$dataFrames", { $add: [ "$frameSelected", 1 ] } ] },
            [ { $arrayElemAt: [ "$dataFrames", "$frameSelected" ] } ],
            { $slice: [ "$dataFrames", { $add: [ 1, "$frameSelected" ] }, { $size: "$dataFrames" } ] }
          ]
        },
        frameSelected: { $add : [ "$frameSelected", 1 ] }
      }
    }]
  )
}

async function deleteFrame (maps, mapId) {
  await maps.findOneAndUpdate(
    { _id: mapId },
    [{
      $set: {
        dataFrames: {
          $concatArrays: [
            { $slice: [ "$dataFrames", "$frameSelected" ] },
            { $slice: [ "$dataFrames", { $add: [ 1, "$frameSelected" ] }, { $size: "$dataFrames" } ] }
          ]
        },
        frameSelected: {
          $cond: {
            if: { $eq: [ "$frameSelected", 0 ] },
            then: {
              $cond: {
                if: { $eq: [ { $size: "$dataFrames" }, 1 ] },
                then: null,
                else: 0
              }
            },
            else: { $subtract: [ "$frameSelected", 1 ] }
          }
        }
      }
    }]
  )
}

async function mergeMap (
  maps,
  mapId,
  mergeType, /* 'map' or 'node' */
  mergeData /* map = array of nodes or node: { nodeId: 'string', linkType: 'string', link: 'string' } */
) {
  const newMap = mergeType === 'map'
    ?  mergeData
    : { $concatArrays: [ { $last: '$dataHistory' }, [ mergeData ] ] }
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
                    k: { $concat: ['$$node.n', '$$nodeProp.k'] },
                    v: {
                      nodeId: '$$node.n',
                      nodePropId: "$$nodeProp.k",
                      ['value' + mutationId]: "$$nodeProp.v",
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
                          if: { $eq: [ { $size: "$dataHistory" }, 1 ] },
                          then: { $last: "$dataHistory" },
                          else: { $arrayElemAt: [ "$dataHistory", -2 ] }
                        }
                      }, 'O'),
                    getValuesByNodeIdAndNodePropId({ $last: "$dataHistory" }, 'A'),
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
                                  }
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
          }
        }
      },
      { $replaceRoot: { newRoot: "$data" }, },
      { $merge: { into: "maps", on: "_id",  whenMatched: "replace", whenNotMatched: "insert" } }
    ]
  ).toArray()
}

async function changeNodePropKey (maps, nodePropKeyFrom, nodePropKeyTo) {
  const setDataSource = (dataSource) => (
    {
      $set: {
        [dataSource]: {
          $map: {
            input: `$${dataSource}`,
            as: "map",
            in: {
              $map: {
                input: "$$map",
                as: "node",
                in: {
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
              }
            }
          }
        }
      }
    }
  )
  await maps.aggregate(
    [
      { ...setDataSource('dataFrames') },
      { ...setDataSource('dataHistory') },
      { $merge: 'maps' }
    ]
  ).toArray()
}

async function setNodePropValueConditionally (maps, condition, nodePropKey, nodePropValueTo) {
  const setDataSource = (dataSource) => (
    {
      $set: {
        [dataSource]: {
          $map: {
            input: `$${dataSource}`,
            as: "map",
            in: {
              $map: {
                input: "$$map",
                as: "node",
                in: {
                  $cond: {
                    if: condition,
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
              }
            }
          }
        }
      }
    }
  )
  await maps.aggregate(
    [
      { ...setDataSource('dataFrames') },
      { ...setDataSource('dataHistory') },
      { $merge: 'maps' }
    ]
  ).toArray()
}

async function setNodePropValueIfMissing (maps, nodePropKey, nodePropValueTo) { // rename: createNodePropIfMissing
  return await setNodePropValueConditionally(maps, { $eq: [ { $type: `$$node.${nodePropKey}` }, 'missing' ] }, nodePropKey, nodePropValueTo)
}

async function setNodePropValueBasedOnPreviousValue (maps, nodePropKey, nodePropValueFrom, nodePropValueTo) { // rename: changeNodePropValueBasedOnPreviousValue
  return await setNodePropValueConditionally(maps, { $eq: [ `$$node.${nodePropKey}`, nodePropValueFrom ] }, nodePropKey, nodePropValueTo)
}

async function createNodeProp (maps, nodePropKey, nodePropValue) { // use the setNodePropValue query conditionally, where condition is simply TRUE
  const setDataSource = (dataSource) => (
    {
      $set: {
        [dataSource]: {
          $map: {
            input: `$${dataSource}`,
            as: "map",
            in: {
              $map: {
                input: "$$map",
                as: "node",
                in: {
                  $setField: {
                    field: nodePropKey,
                    input: '$$node',
                    value: nodePropValue
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
      { ...setDataSource('dataFrames') },
      { ...setDataSource('dataHistory') },
      { $merge: 'maps' }
    ]
  ).toArray()
}

async function removeNodeProp (maps, nodePropKey) {
  await createNodeProp(maps, nodePropKey, '$$REMOVE')
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
  replaceBreadcrumbs,
  appendBreadcrumbs,
  sliceBreadcrumbs,
  appendTabsReplaceBreadcrumbs,
  deleteMapFromUsers,
  deleteMapFromShares,
  moveUpMapInTab,
  moveDownMapInTab,
  openPrevFrame,
  openNextFrame,
  importFrame,
  duplicateFrame,
  deleteFrame,
  mergeMap,
  changeNodePropKey,
  setNodePropValueIfMissing,
  setNodePropValueBasedOnPreviousValue,
  createNodeProp,
  removeNodeProp,
  deleteUnusedMaps
}
