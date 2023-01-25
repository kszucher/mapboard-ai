const { ACCESS_TYPES } = require('./Types')

async function openWorkspace(users, userId) {
  const getMapNameList = (mapIdList, mapNameList) => (
    {
      $lookup: {
        from: "maps",
        localField: mapIdList,
        foreignField: "_id",
        let: { originalArray: `$${mapIdList}` },
        pipeline: [
          { $set: { "order": { $indexOfArray: [ '$$originalArray', '$_id' ] } } },
          { $sort: { "order": 1 } },
          { $replaceWith: {
              name: {
                $getField: {
                  field: 'content',
                  input: {
                    $first: {
                      $filter: {
                        input: {
                          $last: '$dataHistory'
                        },
                        as: 'elem',
                        cond: { $eq: [ "$$elem.path", [ 'r', 0 ] ] },
                      }
                    }
                  }
                }
              }
            }
          }
        ],
        as: mapNameList
      }
    }
  )
  return (
    await users.aggregate(
      [
        { $match: { _id: userId } },
        { $lookup: { from: "maps", localField: "mapSelected", foreignField: "_id", as: "mapList" }, },
        { $set: { 'map': { $first: "$mapList" } } },
        { $set: { 'breadcrumbMapIdList': { $concatArrays: [ '$map.path', [ "$mapSelected" ] ] } } },
        { $lookup: { from: "shares", localField: "breadcrumbMapIdList", foreignField: "sharedMap", as: "shareList" } },
        { $set: { 'share': { $first: "$shareList" } } },
        { $set: { 'dataFramesLen': { $size: '$map.dataFrames' } } },
        {
          $set: {
            mapDataList: [{
              $cond: {
                if: { $eq: [ '$dataFrameSelected', -1 ] },
                then: { $last: '$map.dataHistory' },
                else: { $arrayElemAt: ['$map.dataFrames', '$dataFrameSelected'] }
              }
            }]
          }
        },
        {
          $set: {
            'access': {
              $cond: {
                if: { $eq: [ '$map.ownerUser', userId ] },
                then: ACCESS_TYPES.EDIT,
                else: {
                  $cond: {
                    if: { $ne: [ { $type: '$share' }, 'missing' ] },
                    then: '$share.access',
                    else: ACCESS_TYPES.UNAUTHORIZED
                  }
                }
              }
            }
          }
        },
        {
          $set: {
            'breadcrumbMapIdList': {
              $cond: {
                if: { $eq: [ '$map.ownerUser', userId ] },
                then: '$breadcrumbMapIdList',
                else: {
                  $cond: {
                    if: { $ne: [ { $type: '$share' }, 'missing' ] },
                    then: {
                      $slice: [
                        '$breadcrumbMapIdList',
                        {
                          $subtract: [
                            { $indexOfArray: [ '$breadcrumbMapIdList', '$share.sharedMap' ] },
                            { $size: '$breadcrumbMapIdList' }
                          ]
                        }
                      ]
                    },
                    else: []
                  }
                }
              }
            }
          }
        },
        getMapNameList('breadcrumbMapIdList', 'breadcrumbMapNameList'),
        getMapNameList('tabMapIdList', 'tabMapNameList'),
        { $set: { tabMapSelected: { $indexOfArray: [ '$tabMapIdList', { $first: '$breadcrumbMapIdList' } ] } } },
        {
          $replaceWith: {
            name: '$name',
            colorMode: '$colorMode',
            mapId: '$mapSelected', // TODO use mapSelected
            dataFrameSelected: '$dataFrameSelected',
            dataFramesLen: '$dataFramesLen',
            mapDataList: '$mapDataList',
            access: "$access",
            breadcrumbMapIdList: "$breadcrumbMapIdList",
            breadcrumbMapNameList: "$breadcrumbMapNameList",
            tabMapIdList: "$tabMapIdList",
            tabMapNameList: "$tabMapNameList",
            tabMapSelected: '$tabMapSelected',
          }
        }
      ]
    ).toArray()
  )
}

async function getUserShares(shares, userId) {
  const getShareData = (shareType) => (
    [
      { $match: { [ { export: 'ownerUser', import: 'shareUser' }[shareType] ]: userId } },
      { $lookup: {
          from: "users",
          localField: { export: 'shareUser', import: 'ownerUser' }[shareType],
          foreignField: "_id",
          as: 'user'
        }
      },
      { $unwind: "$user" },
      { $set: { [ { export: 'shareUserEmail', import: 'ownerUserEmail' }[shareType] ]: "$user.email" } },
      { $lookup: {
          from: "maps",
          localField: "sharedMap",
          foreignField: "_id",
          as: 'map'
        }
      },
      { $unwind: "$map" },
      { $set: {
          sharedMapName: {
            $getField: {
              field: 'content',
              input: {
                $arrayElemAt: [{
                  $filter: {
                    input: { $last: "$map.dataHistory" },
                    as: 'elem',
                    cond: { $eq: [ "$$elem.path", [ 'r', 0 ] ] },
                  }}, 0 ]
              }
            }
          }
        }
      },
      { $unset: [ "sharedMap", "map", "ownerUser", "shareUser", "user" ] },
    ]
  )
  const shareDataExport = await shares.aggregate(getShareData('export')).toArray()
  const shareDataImport = await shares.aggregate(getShareData('import')).toArray()
  return { shareDataExport, shareDataImport }
}

async function nodeMapReduceFun (maps, condition, reducerInitialValue, reducerIn, otherStages) {
  return await maps.aggregate(
    [
      {
        $project: {
          subResult: {
            $reduce: {
              input: {
                $map: {
                  input: {
                    $concatArrays: [
                      '$dataHistory',
                      '$dataFrames'
                    ]
                  },
                  as: "map",
                  in: {
                    $reduce: {
                      input: {
                        $map: {
                          input: "$$map",
                          as: "node",
                          in: condition
                        }
                      },
                      initialValue: reducerInitialValue,
                      in: reducerIn
                    }
                  }
                }
              },
              initialValue: reducerInitialValue,
              in: reducerIn
            }
          }
        }
      },
      ...otherStages
    ]
  ).toArray()
}

async function countNodes (maps) {
  return await nodeMapReduceFun(maps,
    true,
    0,
    { $add : [ "$$value", { $toInt: "$$this" } ] },
    [{ $group: { _id: null, result: { $sum: "$subResult" } } }]
  )
}

async function countNodesBasedOnNodePropExistence (maps, nodePropKey) {
  return await nodeMapReduceFun(maps,
    { $ne: [ { $type: `$$node.${nodePropKey}` }, 'missing' ] },
    0,
    { $add : [ "$$value", { $toInt: "$$this" } ] },
    [{ $group: { _id: null, result: { $sum: "$subResult" } } }]
  )
}

async function countNodesBasedOnNodePropValue (maps, nodePropKey, nodePropValue) {
  return await nodeMapReduceFun(maps,
    { $eq: [ `$$node.${nodePropKey}`, nodePropValue ] },
    0,
    { $add : [ "$$value", { $toInt: "$$this" } ] },
    [{ $group: { _id: null, result: { $sum: "$subResult" } } }]
  )
}

async function findDeadLinks (maps) {
  const allMap = await maps.distinct('_id')
  const allMapAsString = allMap.map(el => el.toString())
  const queryResult = await nodeMapReduceFun(maps,
    {
      $cond: {
        if: {
          $and: [
            { $eq: ['$$node.linkType', 'internal'] },
            { $not: { $setIsSubset: [['$$node.link'], allMapAsString] } }
          ]
        },
        then: [
          {
            mapContent: { $getField: { field: 'content', input: { $arrayElemAt: ['$$map', 1] } } },
            nodeContent: '$$node.content',
          }
        ],
        else: []
      }
    },
    [],
    { $setUnion: ["$$value", "$$this"] },
    [{
      $group: {
        _id: 'null',
        result: {
          $addToSet: {
            $cond: {
              if: { $ne: [{ $size: '$subResult' }, 0] },
              then: {
                mapId: '$_id',
                info: '$subResult',
              },
              else: '$$REMOVE'
            }
          }
        }
      }
    }]
  )
  return queryResult[0].result.sort((a, b) => (a.mapId > b.mapId) ? 1 : -1) // needed until $sortArray is unavailable
}

module.exports = {
  openWorkspace,
  getUserShares,
  countNodes,
  countNodesBasedOnNodePropExistence,
  countNodesBasedOnNodePropValue,
  findDeadLinks
}
