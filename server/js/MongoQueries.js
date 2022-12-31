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

async function countNodes (maps) {
  return await maps.aggregate(
    [
      {
        $project: {
          countPerMap: {
            $reduce: {
              input: {
                $map: {
                  input:  { $concatArrays: ['$dataHistory', '$dataFrames'] },
                  as: "map",
                  in: { $size: "$$map" }
                }
              },
              initialValue: 0,
              in: { $add : [ "$$value", { $toInt: "$$this" } ] }
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          countPerAllMap: { $sum: "$countPerMap" } },
      },
    ]
  ).toArray()
}

async function countNodesBasedOnNodePropExistence (maps, nodePropKey) {
  return await maps.aggregate(
    [
      {
        $project: {
          countPerMap: {
            $reduce: {
              input: {
                $map: {
                  input: { $concatArrays: [ '$dataHistory', '$dataFrames' ] },
                  as: "map",
                  in: {
                    $anyElementTrue: {
                      $map: {
                        input: "$$map",
                        as: "node",
                        in: { $ne: [ { $type: `$$node.${nodePropKey}` }, 'missing' ] }
                      }
                    }
                  }
                }
              },
              initialValue: 0,
              in: { $add : [ "$$value", { $toInt: "$$this" } ] }
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          countPerAllMap: { $sum: "$countPerMap" } },
      },
    ]
  ).toArray()
}

module.exports = {
  getUserShares,
  nameLookup,
  countNodes,
  countNodesBasedOnNodePropExistence,
}
