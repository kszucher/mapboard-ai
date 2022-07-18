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
                                    $arrayElemAt: [ '$fromMaps.data', 1 ]
                                }
                            }
                        }
                    }
                }
            ]
        ).toArray()
    ).map(el => el.mapName)
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
        [ { $set: { breadcrumbMapIdList: { $concatArrays: [ "$breadcrumbMapIdList", [ mapId ] ] } } } ],
    )
}

async function sliceBreadcrumbs(users, userId, mapId) {
    await users.findOneAndUpdate(
        { _id: userId },
        [{
            $set: {
                breadcrumbMapIdList: { $slice: [
                        "$breadcrumbMapIdList", { $add: [{ $indexOfArray: ["$breadcrumbMapIdList", mapId] }, 1] }
                    ]
                }
            }
        }]
    )
}

async function appendTabReplaceBreadcrumbs(users, userId, mapId) {
    await users.findOneAndUpdate(
        { _id: userId },
        [ { $set: { tabMapIdList: { $concatArrays: [ "$tabMapIdList", [ mapId ] ] }, breadcrumbMapIdList: [ mapId ] } } ],
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
            { $set: { dataFrames: { $concatArrays: [ "$dataFrames", [ "$data" ] ] } } },
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
                data: {
                    $map: {
                        input: "$data",
                        as: "dataElem",
                        in: {
                            $cond: {
                                if: { $eq: [`$$dataElem.${nodeProp}`, nodePropValFrom] },
                                then: {
                                    $setField: {
                                        field: nodeProp,
                                        input: '$$dataElem',
                                        value: nodePropValTo
                                    }
                                },
                                else: "$$dataElem"
                            }
                        }
                    }
                },
                dataFrames: {
                    $map: {
                        input: "$dataFrames",
                        as: "dataFramesElem",
                        in: {
                            $map: {
                                input: "$$dataFramesElem",
                                as: "dataFramesElem",
                                in: {
                                    $cond: {
                                        if: { $eq: [`$$dataFramesElem.${nodeProp}`, nodePropValFrom] },
                                        then: {
                                            $setField: {
                                                field: nodeProp,
                                                input: '$$dataFramesElem',
                                                value: nodePropValTo
                                            }
                                        },
                                        else: "$$dataFramesElem"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }]
    )
}

module.exports = {
    getUserShares,
    nameLookup,
    replaceBreadcrumbs,
    appendBreadcrumbs,
    sliceBreadcrumbs,
    appendTabReplaceBreadcrumbs,
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
}
