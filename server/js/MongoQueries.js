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

async function changeNodeProp (maps, mapId, nodeProp, nodePropValFrom, nodePropValTo) {
  await maps.updateOne(
    { _id: mapId },
    [{
      $set: {
        dataFrames: {
          $map: {
            input: "$dataFrames",
            as: "map",
            in: {
              $map: {
                input: "$$map",
                as: "node",
                in: {
                  // LIMITATION: can not set KEY, only VALUE, but can set OTHER prop too
                  $cond: {
                    if: {
                      $eq: [`$$node.${nodeProp}`, nodePropValFrom]
                    },
                    then: {
                      $setField: {
                        field: nodeProp,
                        input: '$$node',
                        value: nodePropValTo
                      }
                    },
                    else: "$$node"
                  }
                  // LIMITATION: can not set OTHER prop, only ME, but KEY too
                  // $arrayToObject: {
                  //   $filter: {
                  //     input: {
                  //       $map: {
                  //         input: {
                  //           $objectToArray: "$$node"
                  //         },
                  //         as: "nodeProp",
                  //         in: {
                  //           $cond: {
                  //             if: {
                  //               $eq: [ "$$nodeProp.v", nodePropValFrom ]
                  //             },
                  //             then: {
                  //               $setField: {
                  //                 field: "v", // improvement: this can change 'k' as key
                  //                 input: '$$nodeProp',
                  //                 value: nodePropValTo, // can be REMOVE that is filtered out
                  //               }
                  //             },
                  //             else: "$$nodeProp"
                  //           }
                  //         }
                  //       }
                  //     },
                  //     as: "nodeProp",
                  //     cond: { $ne: [ "$$nodeProp.v", 'REMOVE' ] }
                  //   }
                  // }
                }
              }
            }
          }
        }
      }
    }]
  )
}

async function mergeMap (maps, mapId, mapData) {
  await maps.updateOne(
    { _id: mapId },
    [
      // {
      //   $set: {
      //     // helperArray based on
      //   }
      // },
      {
        $set: {
          helperArray: {
            $map: {
              input: mapData,
              as: "node",
              in: {
                $map: {
                  input: {
                    $objectToArray: "$$node"
                  },
                  as: "nodeProp",
                  in: {
                    $cond: {
                      if: {
                        $eq: [ "$$nodeProp.k", 'a' ]
                      },
                      then: {
                        $setField: {
                          field: "new",
                          input: {},
                          value: {
                            $setField: {
                              field: 'cica',
                              input: '$$nodeProp',
                              value: 5
                            }
                          },
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
      },
      // {
      //   $set: {
      //     // concat to dataHistory the gained from helperArray
      //   }
      // },
      // {
      //   $unset: {
      //     // remove helperArray
      //   }
      // },
    ]
  )
}

module.exports = {
  getUserShares,
  nameLookup,
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
  changeNodeProp,
  mergeMap,
}
