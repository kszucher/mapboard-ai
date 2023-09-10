const { ACCESS_TYPES } = require('./Types')
const { getIndexOfFrameId } = require('./MongoHelpers')

async function openWorkspace(users, userId, sessionId) {
  const getMapNameList = (mapIdList, mapNameList) => (
    {
      $lookup: {
        from: "maps",
        localField: mapIdList,
        foreignField: "_id",
        let: { originalArray: `$${mapIdList}` },
        pipeline: [
          { $set: { "order": { $indexOfArray: [ '$$originalArray', '$_id' ] } } },
          { $replaceWith: {
              name: {
                $getField: {
                  field: 'content',
                  input: {
                    $first: {
                      $filter: {
                        input: { $last: '$versions' },
                        as: 'node',
                        cond: { $eq: [ "$$node.path", [ 'r', 0 ] ] },
                      }
                    }
                  }
                }
              },
              order: '$order'
            }
          },
          { $sort: { "order": 1 } },
          { $replaceWith: {
              name: '$name'
            }
          },
        ],
        as: mapNameList
      }
    }
  )
  return (
    await users.aggregate(
      [
        { $match: { _id: userId } },
        {
          $set: {
            session: {
              $first: {
                $filter: {
                  input: '$sessions',
                  as: 'session',
                  cond: { $eq: [ "$$session.sessionId", sessionId ] }
                }
              }
            }
          }
        },
        { $set: { mapId: '$session.mapId' } },
        { $set: { frameId: '$session.frameId' } },
        { $lookup: { from: "maps", localField: "mapId", foreignField: "_id", as: "mapList" }, },
        { $set: { map: { $first: "$mapList" } } },
        { $set: { framesInfo: '$map.framesInfo' } },
        { $set: { 'breadcrumbMapIdList': { $concatArrays: [ '$map.path', [ "$mapId" ] ] } } },
        { $lookup: { from: "shares", localField: "breadcrumbMapIdList", foreignField: "sharedMap", as: "shareList" } },
        { $set: { 'share': { $first: "$shareList" } } },
        {
          $set: {
            access: {
              $cond: { // TODO cond tests-reducers
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
            mapDataList: {
              $cond: {
                if: { $eq: [ '$frameId', '' ] },
                then: [{ $last: '$map.versions' }],
                else: [{ $arrayElemAt: [ '$map.frames', getIndexOfFrameId('$frameId') ] }]
              }
            }
          }
        },
        {
          $set: {
            breadcrumbMapIdList: {
              $cond: { // TODO cond tests-reducers
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
        { $set: { frameIdList: { $map: { input: "$framesInfo", as: "elem", in: "$$elem.frameId" } } } },
        getMapNameList('tabMapIdList', 'tabMapNameList'),
        getMapNameList('breadcrumbMapIdList', 'breadcrumbMapNameList'),
        { $set: { tabId: { $indexOfArray: [ '$tabMapIdList', { $first: '$breadcrumbMapIdList' } ] } } },
        {
          $replaceWith: {
            name: '$name',
            colorMode: '$colorMode',
            access: "$access",
            tabId: '$tabId',
            mapId: '$mapId',
            frameId: '$frameId',
            mapDataList: '$mapDataList',
            tabMapIdList: "$tabMapIdList",
            tabMapNameList: "$tabMapNameList",
            breadcrumbMapIdList: "$breadcrumbMapIdList",
            breadcrumbMapNameList: "$breadcrumbMapNameList",
            frameIdList: "$frameIdList",
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
                    input: { $last: "$map.versions" },
                    as: 'node',
                    cond: { $eq: [ "$$node.path", [ 'r', 0 ] ] },
                  }}, 0 ]
              }
            }
          }
        }
      },
      { $unset: [ "sharedMap", "map", "ownerUser", "shareUser", "user" ] },
    ]
  )
  const shareDataExport = (await shares.aggregate(getShareData('export')).toArray())
  const shareDataImport = (await shares.aggregate(getShareData('import')).toArray())
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
                      '$versions',
                      '$frames'
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
