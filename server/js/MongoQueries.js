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
    deleteMapFromUsers,
    deleteMapFromShares
}
