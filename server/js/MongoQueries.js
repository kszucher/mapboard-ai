async function deleteMapFromUsers (collectionUsers, mapIdToDelete) {
    await collectionUsers.updateMany(
        {tabMapIdList: mapIdToDelete},
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
    );
    await collectionUsers.updateMany(
        {tabMapIdList: mapIdToDelete},
        {$pull: {tabMapIdList: mapIdToDelete}}
    )
}



module.exports = {
    deleteMapFromUsers
}
