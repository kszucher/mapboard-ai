async function getMapData(mapId) {
    return (await collectionMaps.findOne({_id: mapId})).data
}

async function getPlaybackMapData(mapId, frameSelected) {
    return (await collectionMaps.findOne({_id: mapId})).dataPlayback[frameSelected]
}

async function getFrameLen(mapId) {
    return (await collectionMaps.findOne({_id: mapId})).dataPlayback.length
}

async function getMapProps(mapId) {
    const currMap = await collectionMaps.findOne({_id: mapId})
    const {path, ownerUser} = currMap
    return {path, ownerUser}
}

async function getMapNameList(mapIdList) {
    let mapNameList = []
    await collectionMaps.aggregate([
        {$match: {_id: {$in: mapIdList}}},
        {$addFields: {"__order": {$indexOfArray: [mapIdList, "$_id"]}}},
        {$sort: {"__order": 1}},
    ]).forEach(function (m) {mapNameList.push(m.data[1].content)})
    return mapNameList
}

async function getUserEmail(userId) {
    return (await collectionUsers.findOne({_id: userId})).email
}

async function getUserShares(userId) {
    let ownerUserData = await collectionShares.find({ownerUser: userId}).toArray()
    let shareDataExport = []
    for (let i = 0; i < ownerUserData.length; i++) {
        shareDataExport.push({
            '_id': ownerUserData[i]._id,
            'id': i,
            'map': (await getMapNameList([ownerUserData[i].sharedMap]))[0],
            'shareUserEmail': await getUserEmail(ownerUserData[i].shareUser),
            'access': ownerUserData[i].access,
            'status': ownerUserData[i].status
        })
    }
    let shareUserData = await collectionShares.find({shareUser: userId}).toArray()
    let shareDataImport = []
    for (let i = 0; i < shareUserData.length; i++) {
        shareDataImport.push({
            '_id': shareUserData[i]._id,
            'id': i,
            'map': (await getMapNameList([shareUserData[i].sharedMap]))[0],
            'shareUserEmail': await getUserEmail(shareUserData[i].ownerUser),
            'access': shareUserData[i].access,
            'status': shareUserData[i].status
        })
    }
    return {shareDataExport, shareDataImport}
}

async function deleteMapFromUsers (collectionUsers, mapIdToDelete, userFilter = {}) {
    const filter = {tabMapIdList: mapIdToDelete, ...userFilter}
    await collectionUsers.updateMany(
        filter,
        [
            {
                $set: {
                    tabMapSelected: {
                        $cond: {
                            if: {$eq: ["$tabMapSelected", {$indexOfArray: ["$tabMapIdList", mapIdToDelete]}]},
                            then: {
                                $cond: {
                                    if: {$gt: ["$tabMapSelected", 0]},
                                    then: {$subtract: ["$tabMapSelected", 1]},
                                    else: 0
                                }},
                            else: "$tabMapSelected"
                        }
                    }
                }
            }
        ]
    )
    await collectionUsers.updateMany(
        filter,
        {$pull: {tabMapIdList: mapIdToDelete}}
    )
}

async function deleteMapFromShares(collectionShares, mapIdToDelete, userFilter = {}) {
    const filter = {sharedMap: mapIdToDelete, ...userFilter}
    await collectionShares.deleteMany(
        filter
    )
}

module.exports = {
    getMapData,
    getFrameLen,
    getPlaybackMapData,
    getMapProps,
    getUserShares,
    deleteMapFromUsers,
    deleteMapFromShares
}
