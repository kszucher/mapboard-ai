async function getMapData(collectionMaps, mapId) {
    return (await collectionMaps.findOne({_id: mapId})).data
}

async function getPlaybackMapData(collectionMaps, mapId, frameSelected) {
    return (await collectionMaps.findOne({_id: mapId})).dataPlayback[frameSelected]
}

async function getFrameLen(collectionMaps, mapId) {
    return (await collectionMaps.findOne({_id: mapId})).dataPlayback.length
}

async function getMapProps(collectionMaps, mapId) {
    const currMap = await collectionMaps.findOne({_id: mapId})
    const {path, ownerUser} = currMap
    return {path, ownerUser}
}

async function getShareProps(collectionShares, shareId) {
    const currShare = await collectionShares.findOne({_id: shareId})
    const {shareUser, sharedMap} = currShare
    return {shareUser, sharedMap}
}

async function getMapNameList(collectionMaps, mapIdList) {
    let mapNameList = []
    await collectionMaps.aggregate([
        {$match: {_id: {$in: mapIdList}}},
        {$addFields: {"__order": {$indexOfArray: [mapIdList, "$_id"]}}},
        {$sort: {"__order": 1}},
    ]).forEach(function (m) {mapNameList.push(m.data[1].content)})
    return mapNameList
}

async function getUserEmail(collectionUsers, userId) {
    return (await collectionUsers.findOne({_id: userId})).email
}

async function getUserShares(collectionUsers, collectionMaps, collectionShares, userId) {
    let ownerUserData = await collectionShares.find({ownerUser: userId}).toArray()
    let shareDataExport = []
    for (let i = 0; i < ownerUserData.length; i++) {
        shareDataExport.push({
            '_id': ownerUserData[i]._id,
            'id': i,
            'map': (await getMapNameList(collectionMaps, [ownerUserData[i].sharedMap]))[0],
            'shareUserEmail': await getUserEmail(collectionUsers, ownerUserData[i].shareUser),
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
            'map': (await getMapNameList(collectionMaps, [shareUserData[i].sharedMap]))[0],
            'shareUserEmail': await getUserEmail(collectionUsers, shareUserData[i].ownerUser),
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
                // TODO: vajon itt egy újabb set, ami a tabMapSelected-en alapul, képes a legfrissebb értékkel set-elni valamit?
                // ha igen, akkor a breadcrumb még mindig nincs meg, hanem a tabMapIdListből kell kivadászni, ez is kérdés hogy lehet-e
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

async function deleteMapAll (collectionUsers, collectionShares, mapIdToDelete) {
    await deleteMapFromUsers(collectionUsers, mapIdToDelete)
    await deleteMapFromShares(collectionShares, mapIdToDelete)
}

async function deleteMapOne (collectionUsers, collectionShares, mapIdToDelete, userId) {
    await deleteMapFromUsers(collectionUsers, mapIdToDelete, {_id: userId})
    await deleteMapFromShares(collectionShares, mapIdToDelete, {shareUser: userId})
}

// in case I want to remove share for ALL user I ever shared it with: "deleteMapAllButOne"
// https://stackoverflow.com/questions/18439612/mongodb-find-all-except-from-one-or-two-criteria

module.exports = {
    getMapData,
    getFrameLen,
    getPlaybackMapData,
    getMapProps,
    getShareProps,
    getMapNameList,
    getUserShares,
    deleteMapAll,
    deleteMapOne
}
