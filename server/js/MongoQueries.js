async function getMapData(cMaps, mapId) {
    return (await cMaps.findOne({_id: mapId})).data
}

async function getPlaybackMapData(cMaps, mapId, frameSelected) {
    return (await cMaps.findOne({_id: mapId})).dataPlayback[frameSelected]
}

async function getFrameLen(cMaps, mapId) {
    return (await cMaps.findOne({_id: mapId})).dataPlayback.length
}

async function getMapProps(cMaps, mapId) {
    const currMap = await cMaps.findOne({_id: mapId})
    const {path, ownerUser} = currMap
    return {path, ownerUser}
}

async function getShareProps(cShares, shareId) {
    const currShare = await cShares.findOne({_id: shareId})
    const {shareUser, sharedMap} = currShare
    return {shareUser, sharedMap}
}

async function getMapNameList(cMaps, mapIdList) {
    let mapNameList = []
    await cMaps.aggregate([
        {$match: {_id: {$in: mapIdList}}},
        {$addFields: {"__order": {$indexOfArray: [mapIdList, "$_id"]}}},
        {$sort: {"__order": 1}},
    ]).forEach(function (m) {mapNameList.push(m.data[1].content)})
    return mapNameList
}

async function getUserEmail(cUsers, userId) {
    return (await cUsers.findOne({_id: userId})).email
}

async function getUserShares(cUsers, cMaps, cShares, userId) {
    let ownerUserData = await cShares.find({ownerUser: userId}).toArray()
    let shareDataExport = []
    for (let i = 0; i < ownerUserData.length; i++) {
        shareDataExport.push({
            '_id': ownerUserData[i]._id,
            'id': i,
            'map': (await getMapNameList(cMaps, [ownerUserData[i].sharedMap]))[0],
            'shareUserEmail': await getUserEmail(cUsers, ownerUserData[i].shareUser),
            'access': ownerUserData[i].access,
            'status': ownerUserData[i].status
        })
    }
    let shareUserData = await cShares.find({shareUser: userId}).toArray()
    let shareDataImport = []
    for (let i = 0; i < shareUserData.length; i++) {
        shareDataImport.push({
            '_id': shareUserData[i]._id,
            'id': i,
            'map': (await getMapNameList(cMaps, [shareUserData[i].sharedMap]))[0],
            'shareUserEmail': await getUserEmail(cUsers, shareUserData[i].ownerUser),
            'access': shareUserData[i].access,
            'status': shareUserData[i].status
        })
    }
    return {shareDataExport, shareDataImport}
}

async function deleteMapFromUsers (cUsers, mapIdToDelete, userFilter = {}) {
    const filter = {tabMapIdList: mapIdToDelete, ...userFilter}
    await cUsers.updateMany(
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
                                }
                            },
                            else: "$tabMapSelected"
                        }
                    },
                    tabMapIdList : {
                        $filter : {input: "$tabMapIdList", as:"tabMapId", cond: {$ne: ["$$tabMapId", mapIdToDelete]}}
                    },
                }
            },
            {
                $set: {
                    breadcrumbMapIdList: {
                        $arrayElemAt: ["$tabMapIdList", "$tabMapSelected"]
                    }
                }
            },
        ]
    )
}

async function deleteMapFromShares(cShares, mapIdToDelete, userFilter = {}) {
    const filter = {sharedMap: mapIdToDelete, ...userFilter}
    await cShares.deleteMany(
        filter
    )
}

async function deleteMapAll (cUsers, cShares, mapIdToDelete) {
    await deleteMapFromUsers(cUsers, mapIdToDelete)
    await deleteMapFromShares(cShares, mapIdToDelete)
}

async function deleteMapOne (cUsers, cShares, mapIdToDelete, userId) {
    await deleteMapFromUsers(cUsers, mapIdToDelete, {_id: userId})
    await deleteMapFromShares(cShares, mapIdToDelete, {shareUser: userId})
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
