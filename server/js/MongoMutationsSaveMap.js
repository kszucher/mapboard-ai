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

module.exports = {
  saveMap,
}
