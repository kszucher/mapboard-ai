async function getUserByEmail(users, email) {
    return (await users.findOne({ email }))
}

async function getUser(users, cred) {
    const {email, password} = cred
    return (await users.findOne({ email, password }))
}

async function getMapData(maps, mapId) {
    return (await maps.findOne({_id: mapId})).data
}

async function getPlaybackMapData(maps, mapId, frameSelected) {
    return (await maps.findOne({_id: mapId})).dataPlayback[frameSelected]
}

async function getFrameSelected(maps, mapId) {
    return (await maps.findOne({_id: mapId})).frameSelected
}

async function getFrameLen(maps, mapId) {
    return (await maps.findOne({_id: mapId})).dataPlayback.length
}

async function getMapProps(maps, mapId) {
    const currMap = await maps.findOne({_id: mapId})
    const {path, ownerUser} = currMap
    return {path, ownerUser}
}

async function getShareProps(shares, shareId) {
    const currShare = await shares.findOne({_id: shareId})
    const {shareUser, sharedMap} = currShare
    return {shareUser, sharedMap}
}

async function getMapNameList(maps, mapIdList) {
    let mapNameList = []
    await maps.aggregate([
        {$match: {_id: {$in: mapIdList}}},
        {$addFields: {"__order": {$indexOfArray: [mapIdList, "$_id"]}}},
        {$sort: {"__order": 1}},
    ]).forEach(function (m) {mapNameList.push(m.data[1].content)})
    return mapNameList
}

async function getUserEmail(users, userId) {
    return (await users.findOne({_id: userId})).email
}

async function getUserShares(users, maps, shares, userId) {
    let ownerUserData = await shares.find({ownerUser: userId}).toArray()
    let shareDataExport = []
    for (let i = 0; i < ownerUserData.length; i++) {
        shareDataExport.push({
            '_id': ownerUserData[i]._id,
            'id': i,
            'map': (await getMapNameList(maps, [ownerUserData[i].sharedMap]))[0],
            'shareUserEmail': await getUserEmail(users, ownerUserData[i].shareUser),
            'access': ownerUserData[i].access,
            'status': ownerUserData[i].status
        })
    }
    let shareUserData = await shares.find({shareUser: userId}).toArray()
    let shareDataImport = []
    for (let i = 0; i < shareUserData.length; i++) {
        shareDataImport.push({
            '_id': shareUserData[i]._id,
            'id': i,
            'map': (await getMapNameList(maps, [shareUserData[i].sharedMap]))[0],
            'shareUserEmail': await getUserEmail(users, shareUserData[i].ownerUser),
            'access': shareUserData[i].access,
            'status': shareUserData[i].status
        })
    }
    return {shareDataExport, shareDataImport}
}

async function deleteMapFromUsers (users, mapIdToDelete, userFilter = {}) {
    const filter = {tabMapIdList: mapIdToDelete, ...userFilter}
    await users.updateMany(
        filter,
        [
            {
                $set: {
                    breadcrumbMapIdList: {
                        $cond: {
                            if: {$in: [mapIdToDelete, "$breadcrumbMapIdList"]},
                            then: {
                                $cond: {
                                    if: {$eq: [{$indexOfArray: ["$tabMapIdList", mapIdToDelete]}, 0]},
                                    then: {
                                        $cond: {
                                            if: { $gt: [{ $size: "$tabMapIdList" }, 1] },
                                            then: [{ $arrayElemAt: ["$tabMapIdList", 1] }],
                                            else: []
                                        }
                                    },
                                    else: [{$arrayElemAt: ["$tabMapIdList", {$subtract: [{$indexOfArray: ["$tabMapIdList", mapIdToDelete]}, 1]}]}]
                                }
                            },
                            else: "$breadcrumbMapIdList"
                        }
                    }
                }
            },
            {
                $set: {
                    tabMapIdList : {
                        $filter : {input: "$tabMapIdList", as:"tabMapId", cond: {$ne: ["$$tabMapId", mapIdToDelete]}}
                    }
                }
            }
        ]
    )
}

async function deleteMapFromShares(shares, mapIdToDelete, userFilter = {}) {
    const filter = {sharedMap: mapIdToDelete, ...userFilter}
    await shares.deleteMany(
        filter
    )
}

async function deleteMapAll (users, shares, mapIdToDelete) {
    await deleteMapFromUsers(users, mapIdToDelete)
    await deleteMapFromShares(shares, mapIdToDelete)
}

async function deleteMapOne (users, shares, mapIdToDelete, userId) {
    await deleteMapFromUsers(users, mapIdToDelete, {_id: userId})
    await deleteMapFromShares(shares, mapIdToDelete, {shareUser: userId})
}

async function deleteFrame (maps, mapId) {
    await maps.updateOne({ _id: mapId }, [
        {
            $set: {
                dataPlayback: {
                    $concatArrays: [
                        { $slice: [ "$dataPlayback", "$frameSelected" ] },
                        { $slice: [ "$dataPlayback", { $add: [ 1, "$frameSelected" ] }, { $size: "$dataPlayback" } ] }
                    ]
                },
                frameSelected: {
                    $cond: {
                        if: { $eq: ["$frameSelected", 0] },
                        then: {
                            $cond: {
                                if: { $eq: [ { $size: "$dataPlayback" }, 1 ] },
                                then: null,
                                else: 0
                            }
                        },
                        else: { $subtract: [ "$frameSelected", 1 ] }
                    }
                }
            }
        },
    ])
}

async function moveUpMapInTab (users, userId) {
    await users.updateOne({ _id: userId }, [
        {

        }
    ])
}

async function moveDownMapInTab (users, userId) {
    await users.updateOne({ _id: userId }, [
        {

        }
    ])
}

// in case I want to remove share for ALL user I ever shared it with: "deleteMapAllButOne"
// https://stackoverflow.com/questions/18439612/mongodb-find-all-except-from-one-or-two-criteria

module.exports = {
    getUserByEmail,
    getUser,
    getMapData,
    getFrameSelected,
    getFrameLen,
    getPlaybackMapData,
    getMapProps,
    getShareProps,
    getMapNameList,
    getUserShares,
    deleteMapAll,
    deleteMapOne,
    deleteFrame,
    moveUpMapInTab,
    moveDownMapInTab,
}
