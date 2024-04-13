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
          { $replaceWith: { name: '$name', order: '$order' } },
          { $sort: { "order": 1 } },
          { $replaceWith: { name: '$name' } },
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
            isShared: {
              $cond: {
                if: { $ne: [ '$map.ownerUser', userId ] },
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
                if: { $eq: [ '$map.ownerUser', userId ] },
                then: ACCESS_TYPES.EDIT,
                else: '$share.access'
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
            isShared: '$isShared',
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
