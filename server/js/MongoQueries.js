async function deleteMapFromUsers (collectionUsers, mapIdToDelete, userFilter = {}) {
    const filter = {tabMapIdList: mapIdToDelete, ...userFilter}
    console.log(filter)
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

async function deleteMapFromShares(collectionShares, mapIdToDelete) {
    await collectionShares.deleteMany(
        {sharedMap: mapIdToDelete}
    )
}

module.exports = {
    deleteMapFromUsers,
    deleteMapFromShares
}
