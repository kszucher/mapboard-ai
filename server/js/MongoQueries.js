async function deleteMapFromEveryUser (collectionUsers, mapToDelete) {
    await collectionUsers.updateMany(
        {tabMapIdList: mapToDelete},
        [
            {
                $set: {
                    tabMapSelected: {
                        $cond: {
                            if: {$eq: ["$tabMapSelected", {$indexOfArray: ["$tabMapIdList", mapToDelete]}]},
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
        {tabMapIdList: mapToDelete},
        {$pull: {tabMapIdList: mapToDelete}}
    )
}

module.exports = {
    deleteMapFromEveryUser
}

// TODO import all queries here, make tests for all, and continue --> LINE 259: how to use the result of the updated document???
