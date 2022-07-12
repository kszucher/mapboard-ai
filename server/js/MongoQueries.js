async function getUserByEmail(users, email) {
    return (await users.findOne({ email }))
}

async function getUser(users, cred) {
    const {email, password} = cred
    return (await users.findOne({ email, password }))
}

async function getMap(maps, mapId) {
    return await maps.findOne({_id: mapId})
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

async function replaceBreadcrumbs(users, userId, mapId) {
    return (
        await users.findOneAndUpdate(
            { _id: userId },
            [ { $set: { breadcrumbMapIdList: [ mapId ] } } ],
            { returnDocument: 'after' }
        )
    ).value
}

async function appendBreadcrumbs(users, userId, mapId) {
    return (
        await users.findOneAndUpdate(
            { _id: userId },
            [ { $set: { breadcrumbMapIdList: { $concatArrays: [ "$breadcrumbMapIdList", [ mapId ] ] } } } ],
            { returnDocument: 'after' }
        )
    ).value
}

async function sliceBreadcrumbs(users, userId, mapId) {
    return (
        await users.findOneAndUpdate(
            { _id: userId },
            [{
                $set: {
                    breadcrumbMapIdList: { $slice: [
                            "$breadcrumbMapIdList", { $add: [{ $indexOfArray: ["$breadcrumbMapIdList", mapId] }, 1] }
                        ]
                    }
                }
            }],
            { returnDocument: 'after' }
        )
    ).value
}

async function appendTabReplaceBreadcrumbs(users, userId, mapId) {
    return (
        await users.findOneAndUpdate(
            { _id: userId },
            [ { $set: { tabMapIdList: { $concatArrays: [ "$tabMapIdList", [ mapId ] ] }, breadcrumbMapIdList: [ mapId ] } } ],
            { returnDocument: 'after' }
        )
    ).value
}

async function deleteMapFromUsers (users, filter) {
    const mapId = filter.tabMapIdList
    await users.updateMany(
        filter,
        [
            {
                $set: {
                    breadcrumbMapIdList: {
                        $cond: {
                            if: {$in: [mapId, "$breadcrumbMapIdList"]},
                            then: {
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
                            else: "$breadcrumbMapIdList"
                        }
                    }
                }
            },
            {
                $set: {
                    tabMapIdList : {
                        $filter : {input: "$tabMapIdList", as:"tabMapId", cond: {$ne: ["$$tabMapId", mapId]}}
                    }
                }
            }
        ]
    )
}

async function deleteMapFromShares (shares, filter) {
    await shares.deleteMany(filter)
}

async function moveUpMapInTab (users, userId, mapId) {
    const tabIndex = { $indexOfArray: ["$tabMapIdList", mapId] }
    return (
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
            }],
            { returnDocument: 'after' }
        )
    ).value
}

async function moveDownMapInTab (users, userId, mapId) {
    const tabIndex = { $indexOfArray: ["$tabMapIdList", mapId] }
    return (
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
            }],
            { returnDocument: 'after' }
        )
    ).value
}

async function openPrevFrame (maps, mapId) {
    return (
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
            }],
            { returnDocument: 'after' }
        )
    ).value
}

async function openNextFrame (maps, mapId) {
    return (
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
            }],
            { returnDocument: 'after' }
        )
    ).value
}

async function importFrame (maps, mapId) {
    return (
        await maps.findOneAndUpdate(
            { _id: mapId },
            [
                { $set: { dataFrames: { $concatArrays: [ "$dataFrames", [ "$data" ] ] } } },
                { $set: { frameSelected: { $subtract : [ { $size: "$dataFrames" }, 1 ] } } }
            ],
            { returnDocument: 'after' }
        )
    ).value
}

async function duplicateFrame (maps, mapId) {
    return (
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
            }],
            { returnDocument: 'after' }
        )
    ).value
}

async function deleteFrame (maps, mapId) {
    return (
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
            }],
            { returnDocument: 'after' }
        )
    ).value
}

async function changeNodeProp (maps, mapId, nodeProp, nodePropValFrom, nodePropValTo) {
    // await maps.updateOne(
    //     { _id: mapId },
    //     { $set: { [`data.$[elem].${nodeProp}`]: nodePropValTo } },
    //     { "arrayFilters": [{ [`elem.${nodeProp}`]: nodePropValFrom }] }
    // )

    // await maps.updateOne(
    //     {
    //         _id: mapId,
    //         data: { $elemMatch: { [nodeProp]: nodePropValFrom } }
    //     },
    //     { $set: { [`data.$.${nodeProp}`]: nodePropValTo } },
    // )

    await maps.updateOne(
        {
            _id: mapId,
        },
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
    getUserByEmail,
    getUser,
    getMap,
    getMapNameList,
    getUserShares,
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

// mongodb driver naming issue
// https://stackoverflow.com/questions/35626040/how-to-get-updated-document-back-from-the-findoneandupdate-method
