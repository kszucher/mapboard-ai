async function nameLookup(users, userId, mapIdList) {
  return (
    await users.aggregate(
      [
        {
          $match: { _id: userId }
        },
        {
          $lookup: {
            from: "maps",
            localField: mapIdList,
            foreignField: "_id",
            let: { originalArray: `$${mapIdList}` },
            pipeline: [
              { $set: { "order": { $indexOfArray: ['$$originalArray', '$_id'] } } },
              { $sort: { "order": 1 } },
            ],
            as: "fromMaps"
          },
        },
        {
          $unwind: '$fromMaps'
        },
        {
          $replaceWith: {
            "mapName": {
              $getField: {
                field: 'content',
                input: {
                  $arrayElemAt: [ { $last: '$fromMaps.dataHistory' }, 1 ]
                }
              }
            }
          }
        }
      ]
    ).toArray()
  ).map(el => el.mapName)
}

async function getUserShares(shares, userId) {
  const shareDataExport = await shares.aggregate(
    [
      { $match: { ownerUser: userId } },
      { $lookup: { from: "users", localField: "shareUser", foreignField: "_id", as: 'user' } },
      { $unwind: "$user" },
      { $set: { shareUserEmail: "$user.email" } },
      { $lookup: { from: "maps", localField: "sharedMap", foreignField: "_id", as: 'map' } },
      { $unwind: "$map" },
      { $set: { sharedMapName: { $getField: { field: 'content', input: { $arrayElemAt: [ { $last: "$map.dataHistory" }, 1 ] } } } } },
      { $unset: [ "sharedMap", "map", "ownerUser", "shareUser", "user" ] },
    ]
  ).toArray()
  const shareDataImport = await shares.aggregate(
    [
      { $match: { shareUser: userId } },
      { $lookup: { from: "users", localField: "ownerUser", foreignField: "_id", as: 'user' } },
      { $unwind: "$user" },
      { $set: { ownerUserEmail: "$user.email" } },
      { $lookup: { from: "maps", localField: "sharedMap", foreignField: "_id", as: 'map' } },
      { $unwind: "$map" },
      { $set: { sharedMapName: { $getField: { field: 'content', input: { $arrayElemAt: [ { $last: "$map.dataHistory" }, 1 ] } } } } },
      { $unset: [ "sharedMap", "map", "ownerUser", "shareUser", "user" ] },
    ]
  ).toArray()
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
  getUserShares,
  nameLookup,
  countNodes,
  countNodesBasedOnNodePropExistence,
  countNodesBasedOnNodePropValue,
  findDeadLinks
}
