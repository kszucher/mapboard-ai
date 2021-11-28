async function getUserByEmail(usersColl, email) {
    return (await usersColl.findOne({ email }))
}

async function getUser(usersColl, cred) {
    const {email, password} = cred
    return (await usersColl.findOne({ email, password }))
}

async function getMapData(mapsColl, mapId) {
    return (await mapsColl.findOne({_id: mapId})).data
}

async function getPlaybackMapData(mapsColl, mapId, frameSelected) {
    return (await mapsColl.findOne({_id: mapId})).dataPlayback[frameSelected]
}

async function getFrameLen(mapsColl, mapId) {
    return (await mapsColl.findOne({_id: mapId})).dataPlayback.length
}

async function getMapProps(mapsColl, mapId) {
    const currMap = await mapsColl.findOne({_id: mapId})
    const {path, ownerUser} = currMap
    return {path, ownerUser}
}

async function getShareProps(sharesColl, shareId) {
    const currShare = await sharesColl.findOne({_id: shareId})
    const {shareUser, sharedMap} = currShare
    return {shareUser, sharedMap}
}

async function getMapNameList(mapsColl, mapIdList) {
    let mapNameList = []
    await mapsColl.aggregate([
        {$match: {_id: {$in: mapIdList}}},
        {$addFields: {"__order": {$indexOfArray: [mapIdList, "$_id"]}}},
        {$sort: {"__order": 1}},
    ]).forEach(function (m) {mapNameList.push(m.data[1].content)})
    return mapNameList
}

async function getUserEmail(usersColl, userId) {
    return (await usersColl.findOne({_id: userId})).email
}

async function getUserShares(usersColl, mapsColl, sharesColl, userId) {
    let ownerUserData = await sharesColl.find({ownerUser: userId}).toArray()
    let shareDataExport = []
    for (let i = 0; i < ownerUserData.length; i++) {
        shareDataExport.push({
            '_id': ownerUserData[i]._id,
            'id': i,
            'map': (await getMapNameList(mapsColl, [ownerUserData[i].sharedMap]))[0],
            'shareUserEmail': await getUserEmail(usersColl, ownerUserData[i].shareUser),
            'access': ownerUserData[i].access,
            'status': ownerUserData[i].status
        })
    }
    let shareUserData = await sharesColl.find({shareUser: userId}).toArray()
    let shareDataImport = []
    for (let i = 0; i < shareUserData.length; i++) {
        shareDataImport.push({
            '_id': shareUserData[i]._id,
            'id': i,
            'map': (await getMapNameList(mapsColl, [shareUserData[i].sharedMap]))[0],
            'shareUserEmail': await getUserEmail(usersColl, shareUserData[i].ownerUser),
            'access': shareUserData[i].access,
            'status': shareUserData[i].status
        })
    }
    return {shareDataExport, shareDataImport}
}

async function deleteMapFromUsers (usersColl, mapIdToDelete, userFilter = {}) {
    const filter = {tabMapIdList: mapIdToDelete, ...userFilter}
    await usersColl.updateMany(
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
                        $cond: {
                            if: {$in: [mapIdToDelete, "$breadcrumbMapIdList"]},
                            then: [{$arrayElemAt: ["$tabMapIdList", "$tabMapSelected"]}],
                            else: "$breadcrumbMapIdList"
                        }
                    }
                }
            },
        ]
    )
}

async function deleteMapFromShares(sharesColl, mapIdToDelete, userFilter = {}) {
    const filter = {sharedMap: mapIdToDelete, ...userFilter}
    await sharesColl.deleteMany(
        filter
    )
}

async function deleteMapAll (usersColl, sharesColl, mapIdToDelete) {
    await deleteMapFromUsers(usersColl, mapIdToDelete)
    await deleteMapFromShares(sharesColl, mapIdToDelete)
}

async function deleteMapOne (usersColl, sharesColl, mapIdToDelete, userId) {
    await deleteMapFromUsers(usersColl, mapIdToDelete, {_id: userId})
    await deleteMapFromShares(sharesColl, mapIdToDelete, {shareUser: userId})
}

// in case I want to remove share for ALL user I ever shared it with: "deleteMapAllButOne"
// https://stackoverflow.com/questions/18439612/mongodb-find-all-except-from-one-or-two-criteria

module.exports = {
    getUserByEmail,
    getUser,
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
