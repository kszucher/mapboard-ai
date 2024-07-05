const { ACCESS_TYPES } = require('./Types')

async function openWorkspace(sessions, jwtId) {
  return (
    await sessions.aggregate(
      [
        { $match: { jwtId } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userList"
          }
        },
        {
          $set: { user: { $first: "$userList" } }
        },
        {
          $set: { tabMapIdList: "$user.tabMapIdList" }
        },
        {
          $set: {
            mapId: {
              $cond: {
                if: { $eq: [ '$mapId', '' ] },
                then: { $arrayElemAt: [ '$tabMapIdList', 0 ] }, // TODO test
                else: '$mapId'
              }
            }
          }
        },
        {
          $lookup: {
            from: "maps",
            localField: "mapId",
            foreignField: "_id",
            as: "mapList"
          }
        },
        {
          $set: { map: { $first: "$mapList" } }
        },
        {
          $set: { breadcrumbMapIdList: { $concatArrays: [ '$map.path', [ "$mapId" ] ] } }
        },
        {
          $lookup: {
            from: "shares",
            localField: "breadcrumbMapIdList",
            foreignField: "sharedMap",
            as: "shareList"
          }
        },
        {
          $set: { share: { $first: "$shareList" } } },
        {
          $set: {
            isShared: {
              $cond: {
                if: { $ne: [ '$map.ownerUser', '$user._id' ] },
                then: true,
                else: false
              }
            }
          }
        },
        {
          $set: {
            access: {
              $cond: {
                if: { $eq: [ '$map.ownerUser', '$user._id' ] },
                then: ACCESS_TYPES.EDIT,
                else: '$share.access'
              }
            }
          }
        },
        {
          $set: {
            mapDataList: [{ $last: '$map.versions' }]
          }
        },
        {
          $set: {
            breadcrumbMapIdList: {
              $cond: { // TODO cond tests-reducers
                if: { $eq: [ '$map.ownerUser', '$user._id' ] },
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
        {
          $lookup: {
            from: "maps",
            localField: 'tabMapIdList',
            foreignField: "_id",
            let: { originalArray: '$tabMapIdList' },
            pipeline: [
              { $set: { "order": { $indexOfArray: [ '$$originalArray', '$_id' ] } } },
              { $replaceWith: { name: '$name', order: '$order' } },
              { $sort: { "order": 1 } },
              { $replaceWith: { name: '$name' } },
            ],
            as: 'tabMapNameList'
          }
        },
        {
          $lookup: {
            from: "maps",
            localField: 'breadcrumbMapIdList',
            foreignField: "_id",
            let: { originalArray: '$breadcrumbMapIdList' },
            pipeline: [
              { $set: { "order": { $indexOfArray: [ '$$originalArray', '$_id' ] } } },
              { $replaceWith: { name: '$name', order: '$order' } },
              { $sort: { "order": 1 } },
              { $replaceWith: { name: '$name' } },
            ],
            as: 'breadcrumbMapNameList'
          }
        },
        {
          $set: { tabId: { $indexOfArray: [ '$tabMapIdList', { $first: '$breadcrumbMapIdList' } ] } }
        },
        {
          $replaceWith: {
            name: '$user.name',
            colorMode: '$user.colorMode',
            isShared: '$isShared',
            access: "$access",
            tabId: '$tabId',
            mapId: '$mapId',
            mapDataList: '$mapDataList',
            tabMapIdList: "$tabMapIdList",
            tabMapNameList: "$tabMapNameList",
            breadcrumbMapIdList: "$breadcrumbMapIdList",
            breadcrumbMapNameList: "$breadcrumbMapNameList",
          }
        }
      ]
    ).toArray()
  ).at(0)
}

async function getUserShares(shares, userId) {
  const getShareData = (shareType) => (
    [
      { $match: { [ { export: 'ownerUser', import: 'shareUser' }[shareType] ]: userId } },
      { $lookup: { from: "users", localField: { export: 'shareUser', import: 'ownerUser' }[shareType], foreignField: "_id", as: 'user' } },
      { $unwind: "$user" },
      { $set: { [ { export: 'shareUserEmail', import: 'ownerUserEmail' }[shareType] ]: "$user.email" } },
      { $lookup: { from: "maps", localField: "sharedMap", foreignField: "_id", as: 'map' } },
      { $unwind: "$map" },
      { $set: { sharedMapName: '$map.name' } },
      { $unset: [ "sharedMap", "map", "ownerUser", "shareUser", "user" ] },
    ]
  )
  const shareDataExport = (await shares.aggregate(getShareData('export')).toArray())
  const shareDataImport = (await shares.aggregate(getShareData('import')).toArray())
  return { shareDataExport, shareDataImport }
}

module.exports = {
  openWorkspace,
  getUserShares,
}
