"use strict"
const express = require('express')
const cors = require('cors')
const app = express()
const {MongoClient} = require('mongodb')
const {ObjectId} = require('mongodb')
const uri = "mongodb+srv://mindboard-server:3%21q.FkpzkJPTM-Q@cluster0-sg0ny.mongodb.net/test?retryWrites=true&w=majority"
const nodemailer = require("nodemailer")
const {
    getMapData,
    getFrameLen,
    getPlaybackMapData,
    getMapProps,
    getMapNameList,
    getUserShares,
    deleteMapFromUsers,
    deleteMapFromShares
} = require("./MongoQueries");

const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'info@mindboard.io',
        pass: 'jH8fB1sB2lS4bQ7d'
    }
})

const ACTIVATION_STATUS = {
    COMPLETED: 'completed',
    AWAITING_CONFIRMATION: 'awaitingConfirmation'
}

const MAP_RIGHT = {
    UNAUTHORIZED: 'unauthorized',
    VIEW: 'view',
    EDIT: 'edit'
}

const SHARE_STATUS = {
    WAITING: 'waiting',
    REJECTED: 'rejected',
    ACCEPTED: 'accepted',
}

const systemMaps = [
    ObjectId('5f3fd7ba7a84a4205428c96a'), // features
    ObjectId('5ee5e343b1945921ec26c781'), // controls
    ObjectId('5f467ee216bcf436da264a69'), // proposals
]

const adminUser = ObjectId('5d88c99f1935c83e84ca263d')

const isEqual = (obj1, obj2) => {
    return JSON.stringify(obj1)===JSON.stringify(obj2)
}

let collectionUsers, collectionMaps, collectionShares, db

function getConfirmationCode() {
    let [min, max] = [1000, 9999]
    return Math.round(Math.random() * (max - min) + min)
}

function getDefaultMap(mapName, ownerUser, path) {
    return {
        data: [
            {path: ['m']},
            {path: ['r', 0], content: mapName, selected: 1},
            {path: ['r', 0, 'd', 0]},
            {path: ['r', 0, 'd', 1]},
        ],
        dataHistory: [],
        dataPlayback: [],
        ownerUser,
        path
    }
}

const replyList = [
    'pingSuccess',
    'getLandingDataSuccess',
    'signUpStep1FailEmailAlreadyInUse', 'signUpStep1Success',
    'signUpStep2FailUnknownUser', 'signUpStep2FailAlreadyActivated', 'signUpStep2FailWrongCode', 'signUpStep2Success',
    'signInFail', 'signInFailIncompleteRegistration', 'tabSynchFail', 'signInSuccess',
    'openMapFromHistorySuccess',
    'openMapFromTabSuccess',
    'openMapFromMapSuccess',
    'openMapFromBreadcrumbsSuccess',
    'saveMapSuccess',
    'createMapInMapSuccess',
    'createMapInTabSuccess',
    'removeMapInTabFail', 'removeMapInTabSuccess',
    'moveUpMapInTabFail', 'moveUpMapInTabSuccess',
    'moveDownMapInTabFail', 'moveDownMapInTabSuccess',
    'openFrameFail', 'openFrameSuccess',
    'importFrameSuccess',
    'deleteFrameFail', 'deleteFrameSuccess',
    'duplicateFrameSuccess',
    'getSharesSuccess',
    'shareValidityFail', 'shareValiditySuccess',
    'acceptShareSuccess',
    'withdrawShareSuccess',
]

async function sendResponse(c2s) {
    let s2c = {'ERROR': 'error'}
    if (c2s.serverCmd === 'ping') {
        s2c = {cmd: 'pingSuccess'}
    } else {
        try {
            let currUser
            if (c2s.serverCmd === 'getLandingData') {
                // this could depend on queryString
                let mapId = '5f3fd7ba7a84a4205428c96a'
                s2c = {cmd: 'getLandingDataSuccess', payload: {landingData: (await collectionMaps.findOne({_id: ObjectId(mapId)})).dataPlayback}}
            } else if (c2s.serverCmd === 'signUpStep1') {
                let {name, email, password} = c2s.serverPayload
                currUser = await collectionUsers.findOne({email})
                if (currUser !== null) {
                    s2c = {cmd: 'signUpStep1FailEmailAlreadyInUse'}
                } else {
                    let confirmationCode = getConfirmationCode()
                    await transporter.sendMail({
                        from: "info@mindboard.io",
                        to: email,
                        subject: "MapBoard Email Confirmation",
                        text: "",
                        html:
                            `
                                <p>Hello ${name}!</p>
                                <p>Welcome to MapBoard!<br>You can complete your registration using the following code:</p>
                                <p>${confirmationCode}</p>
                                <p>You can also join the conversation, propose features and get product news here:<br>
                                <a href="MindBoard Slack">https://join.slack.com/t/mindboardio/shared_invite/zt-qunqabbo-fE_2dnrU7GPuEiDsAy6L~A</a></p>
                                <p>Cheers,<br>Krisztian from MapBoard</p>
                            `
                    })
                    await collectionUsers.insertOne({email, password, activationStatus: ACTIVATION_STATUS.AWAITING_CONFIRMATION, confirmationCode})
                    s2c = {cmd: 'signUpStep1Success'}
                }
            } else if (c2s.serverCmd === 'signUpStep2') {
                let {email, confirmationCode} = c2s.serverPayload
                currUser = await collectionUsers.findOne({email})
                if (currUser === null ) {
                    s2c = {cmd: 'signUpStep2FailUnknownUser'}
                } else if (currUser.activationStatus === ACTIVATION_STATUS.COMPLETED) {
                    s2c = {cmd: 'signUpStep2FailAlreadyActivated'}
                } else if (parseInt(confirmationCode) !== currUser.confirmationCode) {
                    s2c = {cmd: 'signUpStep2FailWrongCode'}
                } else {
                    let newMap = getDefaultMap('My First Map', currUser._id, [])
                    let mapId = (await collectionMaps.insertOne(newMap)).insertedId
                    await collectionUsers.updateOne(
                        {_id: currUser._id},
                        {$set: {
                            activationStatus: ACTIVATION_STATUS.COMPLETED,
                            tabMapSelected: systemMaps.length,
                            tabMapIdList: [...systemMaps, mapId],
                            breadcrumbMapIdList: [mapId]
                        }})
                    s2c = {cmd: 'signUpStep2Success'}
                }
            } else {
                currUser = await collectionUsers.findOne({email: c2s.cred.email})
                if (currUser === null || currUser.password !== c2s.cred.password) {
                    s2c = {cmd: 'signInFail'}
                } else if (currUser.activationStatus === ACTIVATION_STATUS.AWAITING_CONFIRMATION) {
                    s2c = {cmd: 'signInFailIncompleteRegistration'}
                } else {
                    if (c2s.hasOwnProperty('serverPayload') &&
                        c2s.serverPayload.hasOwnProperty('mapIdOut') &&
                        c2s.serverPayload.hasOwnProperty('mapSourceOut') &&
                        c2s.serverPayload.hasOwnProperty('mapStorageOut')) {
                        const {mapIdOut, mapSourceOut, mapStorageOut} = c2s.serverPayload
                        // TODO check if I have the right to save this
                        if (mapSourceOut === 'data') {
                            await collectionMaps.updateOne({_id: ObjectId(mapIdOut)}, {$set: {data: mapStorageOut}})
                        } else if (mapSourceOut === 'dataPlayback') {
                            const {frameSelectedOut} = c2s.serverPayload
                            await collectionMaps.updateOne({_id: ObjectId(mapIdOut)}, {$set: {[`dataPlayback.${frameSelectedOut}`]: mapStorageOut}})
                        }
                    }
                    if (c2s.serverPayload.hasOwnProperty('tabMapIdListOut') &&
                        !isEqual(c2s.serverPayload.tabMapIdListOut, currUser.tabMapIdList)) {
                        s2c = {cmd: 'tabSynchFail'}
                        // TODO send down the actual
                    } else {
                        switch (c2s.serverCmd) {
                            case 'signIn': {
                                s2c = {cmd: 'signInSuccess'}
                                break
                            }
                            case 'openMapFromHistory': {
                                const {tabMapIdList, tabMapSelected} = currUser
                                const {breadcrumbMapIdList} = currUser
                                const mapId = breadcrumbMapIdList[breadcrumbMapIdList.length - 1]
                                const mapSource = 'data'
                                s2c = {cmd: 'openMapFromHistorySuccess', payload: {tabMapIdList, tabMapSelected, breadcrumbMapIdList, mapId, mapSource}}
                                break
                            }
                            case 'openMapFromTab': {
                                const {tabMapIdList} = currUser
                                const {tabMapSelected} = c2s.serverPayload
                                const mapId = tabMapIdList[tabMapSelected]
                                const breadcrumbMapIdList = [mapId]
                                await collectionUsers.updateOne({_id: currUser._id}, {$set: {tabMapSelected, breadcrumbMapIdList}})
                                const mapSource = 'data'
                                s2c = {cmd: 'openMapFromTabSuccess', payload: {tabMapIdList, tabMapSelected, breadcrumbMapIdList, mapId, mapSource}}
                                break
                            }
                            case 'openMapFromMap': {
                                let {breadcrumbMapIdList} = currUser
                                let {mapId} = c2s.serverPayload
                                mapId = ObjectId(mapId)
                                breadcrumbMapIdList = [...breadcrumbMapIdList, mapId]
                                await collectionUsers.updateOne({_id: currUser._id}, {$set: {breadcrumbMapIdList}})
                                const mapSource = 'data'
                                s2c = {cmd: 'openMapFromMapSuccess', payload: {breadcrumbMapIdList, mapId, mapSource}}
                                break
                            }
                            case 'openMapFromBreadcrumbs': {
                                let {breadcrumbMapIdList} = currUser
                                let {breadcrumbMapSelected} = c2s.serverPayload
                                breadcrumbMapIdList.length = breadcrumbMapSelected + 1
                                let mapId = breadcrumbMapIdList[breadcrumbMapIdList.length - 1]
                                await collectionUsers.updateOne({_id: currUser._id}, {$set: {breadcrumbMapIdList}})
                                const mapSource = 'data'
                                s2c = {cmd: 'openMapFromBreadcrumbsSuccess', payload: {breadcrumbMapIdList, mapId, mapSource}}
                                break
                            }
                            case 'saveMap': {
                                s2c = {cmd: 'saveMapSuccess'}
                                break
                            }
                            case 'createMapInMap': {
                                let {breadcrumbMapIdList} = currUser
                                let {mapIdOut, lastPath, newMapName} = c2s.serverPayload
                                let newMap = getDefaultMap(newMapName, currUser._id, breadcrumbMapIdList)
                                let mapId = (await collectionMaps.insertOne(newMap)).insertedId
                                await collectionMaps.updateOne(
                                    {_id: ObjectId(mapIdOut)},
                                    {$set: {'data.$[elem].linkType': 'internal', 'data.$[elem].link': mapId.toString()}},
                                    {"arrayFilters": [{"elem.path": lastPath}], "multi": true}
                                )
                                breadcrumbMapIdList = [...breadcrumbMapIdList, mapId]
                                const mapSource = 'data'
                                s2c = {cmd: 'createMapInMapSuccess', payload: {breadcrumbMapIdList, mapId, mapSource}}
                                break
                            }
                            case 'createMapInTab': {
                                let {tabMapIdList, tabMapSelected} = currUser
                                const newMap = getDefaultMap('New Map', currUser._id, [])
                                const mapId = (await collectionMaps.insertOne(newMap)).insertedId
                                tabMapIdList = [...tabMapIdList, mapId]
                                tabMapSelected = tabMapIdList.length - 1
                                await collectionUsers.updateOne({_id: currUser._id}, {$set: {tabMapIdList, tabMapSelected}})
                                const {breadcrumbMapIdList} = currUser
                                const mapSource = 'data'
                                s2c = {cmd: 'createMapInTabSuccess', payload: {tabMapIdList, tabMapSelected, breadcrumbMapIdList, mapId, mapSource}}
                                break
                            }
                            case 'removeMapInTab': {
                                if (currUser.tabMapIdList.length === 1) {
                                    s2c = {cmd: 'removeMapInTabFail'}
                                } else {
                                    const mapIdToDelete = currUser.tabMapIdList[currUser.tabMapSelected]
                                    if (isEqual((await getMapProps(collectionMaps, mapIdToDelete)).ownerUser, currUser._id)) {
                                        await deleteMapFromUsers(collectionUsers, mapIdToDelete);
                                        await deleteMapFromShares(collectionShares, mapIdToDelete);
                                    } else {
                                        await deleteMapFromUsers(collectionUsers, mapIdToDelete, {_id: currUser._id})
                                        await deleteMapFromShares(collectionShares, mapIdToDelete, {shareUser: currUser._id});
                                    }
                                    const currUserNew = await collectionUsers.findOne({email: c2s.cred.email})
                                    const {tabMapIdList, tabMapSelected, breadcrumbMapIdList} = currUserNew
                                    const mapId = tabMapIdList[tabMapSelected]
                                    const mapSource = 'data'
                                    s2c = {cmd: 'removeMapInTabSuccess', payload: {tabMapIdList, tabMapSelected, breadcrumbMapIdList, mapId, mapSource}}
                                }
                                break
                            }
                            case 'moveUpMapInTab': {
                                let {tabMapIdList, tabMapSelected} = currUser
                                if (tabMapSelected === 0) {
                                    s2c = {cmd: 'moveUpMapInTabFail'}
                                } else {


                                    [tabMapIdList[tabMapSelected], tabMapIdList[tabMapSelected - 1]] =
                                        [tabMapIdList[tabMapSelected - 1], tabMapIdList[tabMapSelected]]
                                    tabMapSelected = tabMapSelected - 1
                                    await collectionUsers.updateOne({_id: currUser._id}, {$set: {tabMapIdList, tabMapSelected}})


                                    s2c = {cmd: 'moveUpMapInTabSuccess', payload: {tabMapIdList, tabMapSelected}}
                                }
                                break
                            }
                            case 'moveDownMapInTab': {
                                let {tabMapIdList, tabMapSelected} = currUser
                                if (tabMapSelected >= tabMapIdList.length - 1) {
                                    s2c = {cmd: 'moveDownMapInTabFail'}
                                } else {


                                    [tabMapIdList[tabMapSelected], tabMapIdList[tabMapSelected + 1]] =
                                        [tabMapIdList[tabMapSelected + 1], tabMapIdList[tabMapSelected]]
                                    tabMapSelected = tabMapSelected + 1
                                    await collectionUsers.updateOne({_id: currUser._id}, {$set: {tabMapIdList, tabMapSelected}})


                                    s2c = {cmd: 'moveDownMapInTabSuccess', payload: {tabMapIdList, tabMapSelected}}
                                }
                                break
                            }
                            case 'openFrame': {
                                const {mapIdOut} = c2s.serverPayload
                                const mapId = ObjectId(mapIdOut)
                                const frameSelected = 0
                                const frameLen = await getFrameLen(collectionMaps, mapId)
                                if (frameLen === 0) {
                                    s2c = {cmd: 'openFrameFail', payload: {frameLen, frameSelected}}
                                } else {
                                    const mapSource = 'dataPlayback'
                                    s2c = {cmd: 'openFrameSuccess', payload: {mapId, mapSource, frameLen, frameSelected}}
                                }
                                break
                            }
                            case 'openPrevFrame': {
                                const {mapIdOut, frameSelectedOut} = c2s.serverPayload
                                const frameSelected = frameSelectedOut - 1
                                const mapId = ObjectId(mapIdOut)
                                const frameLen = await getFrameLen(collectionMaps, mapId)
                                const mapSource = 'dataPlayback'
                                s2c = {cmd: 'openFrameSuccess', payload: {mapId, mapSource, frameLen, frameSelected}}
                                break
                            }
                            case 'openNextFrame': {
                                const {mapIdOut, frameSelectedOut} = c2s.serverPayload
                                const frameSelected = frameSelectedOut + 1
                                const mapId = ObjectId(mapIdOut)
                                const frameLen = await getFrameLen(collectionMaps, mapId)
                                const mapSource = 'dataPlayback'
                                s2c = {cmd: 'openFrameSuccess', payload: {mapId, mapSource, frameLen, frameSelected}}
                                break
                            }
                            case 'importFrame': {
                                const {mapIdOut} = c2s.serverPayload
                                const mapId = ObjectId(mapIdOut)
                                const mapSource = 'dataPlayback'
                                const mapStorage = await getMapData(collectionMaps, mapId)
                                await collectionMaps.updateOne({_id: mapId}, {$push: {"dataPlayback": mapStorage}})
                                const frameLen = await getFrameLen(collectionMaps, mapId)
                                const frameSelected = frameLen - 1
                                s2c = {cmd: 'importFrameSuccess', payload: {mapId, mapSource, frameLen, frameSelected}}
                                break
                            }
                            case 'deleteFrame': {
                                const {mapIdDelete, frameSelectedOut} = c2s.serverPayload
                                const mapId = ObjectId(mapIdDelete)
                                const frameSelected =  frameSelectedOut > 0 ? frameSelectedOut - 1 : 0
                                let frameLen = await getFrameLen(collectionMaps, mapId)
                                if (frameLen === 0) {
                                    s2c = {cmd: 'deleteFrameFail'}
                                } else {
                                    await collectionMaps.updateOne({_id: mapId}, [{
                                        $set: {
                                            dataPlayback: {
                                                $concatArrays: [
                                                    {$slice: ["$dataPlayback", frameSelectedOut]},
                                                    {$slice: ["$dataPlayback", {$add: [1, frameSelectedOut]}, {$size: "$dataPlayback"}]}
                                                ]
                                            }
                                        }
                                    }])
                                    frameLen = frameLen - 1
                                    const mapSource = frameLen === 0 ? 'data' : 'dataPlayback';
                                    s2c = {cmd: 'deleteFrameSuccess', payload: {mapId, mapSource, frameLen, frameSelected}}
                                }
                                break
                            }
                            case 'duplicateFrame': {
                                const {mapIdOut, mapSourceOut, mapStorageOut, frameSelectedOut} = c2s.serverPayload
                                const frameSelected = frameSelectedOut + 1
                                const mapId = ObjectId(mapIdOut)
                                await collectionMaps.updateOne({_id: mapId}, {
                                    $push: {
                                        "dataPlayback": {
                                            $each: [mapStorageOut],
                                            $position: frameSelectedOut
                                        }
                                    }
                                })
                                const mapSource = "dataPlayback"
                                const frameLen = await getFrameLen(collectionMaps, mapId)
                                s2c = {cmd: 'duplicateFrameSuccess', payload: {mapId, mapSource, frameLen, frameSelected}}
                                break
                            }
                            case 'getShares': {
                                const {shareDataExport, shareDataImport} = await getUserShares(collectionUsers, collectionMaps, collectionShares, currUser._id)
                                s2c = {cmd: 'getSharesSuccess', payload: {shareDataExport, shareDataImport}}
                                break
                            }
                            case 'createShare': {
                                let {mapId, email, access} = c2s.serverPayload
                                let shareUser = await collectionUsers.findOne({email})
                                if (shareUser === null || isEqual(shareUser._id, currUser._id)) {
                                    // TODO: also fail if trying to create a share for an existing ownerUser/shareUser combination OR overwrite
                                    s2c = {cmd: 'shareValidityFail'}
                                } else {
                                    let newShare = {
                                        sharedMap: ObjectId(mapId),
                                        ownerUser: currUser._id,
                                        shareUser: shareUser._id,
                                        access,
                                        status: SHARE_STATUS.WAITING
                                    }
                                    await collectionShares.insertOne(newShare)
                                    s2c = {cmd: 'shareValiditySuccess', payload: {}}
                                }
                                break
                            }
                            case 'acceptShare': {
                                let {tabMapIdList, tabMapSelected} = currUser
                                const {shareIdOut} = c2s.serverPayload
                                const shareId = ObjectId(shareIdOut)
                                const shareData = await collectionShares.findOne({_id: shareId})
                                tabMapIdList = [...tabMapIdList, shareData.sharedMap]
                                tabMapSelected = tabMapIdList.length - 1
                                await collectionUsers.updateOne({_id: currUser._id}, {$set: {tabMapIdList, tabMapSelected}})
                                await collectionShares.updateOne({_id: shareId}, {$set: {status: SHARE_STATUS.ACCEPTED}})
                                const {shareDataExport, shareDataImport} = await getUserShares(collectionUsers, collectionMaps, collectionShares, currUser._id)
                                s2c = {cmd: 'acceptShareSuccess', payload: {shareDataExport, shareDataImport, tabMapIdList, tabMapSelected}}
                                break
                            }
                            case 'withdrawShare': {
                                const {shareIdOut} = c2s.serverPayload
                                const shareId = ObjectId(shareIdOut)
                                const shareData = await collectionShares.findOne({_id: shareId})
                                const shareUser = await collectionUsers.findOne({_id: shareData.shareUser})
                                await collectionUsers.updateOne(
                                    {_id: ObjectId(shareUser._id)},
                                    {$pull: {tabMapIdList: ObjectId(shareData.sharedMap)}},
                                    {multi: true}
                                )
                                // if shared map was selected by shareUser, change selection
                                await collectionShares.deleteOne({_id: ObjectId(shareId)})
                                const {shareDataExport, shareDataImport} = await getUserShares(collectionUsers, collectionMaps, collectionShares, currUser._id)
                                s2c = {cmd: 'withdrawShareSuccess', payload: {shareDataExport, shareDataImport}}
                            }
                        }
                        if (s2c.hasOwnProperty('payload')) {
                            if (s2c.payload.hasOwnProperty('mapId') && s2c.payload.hasOwnProperty('mapSource')) {
                                const {mapId, mapSource} = s2c.payload;
                                let mapStorage = {};
                                if (mapSource === 'data') {
                                    mapStorage = await getMapData(collectionMaps, mapId)
                                } else if (mapSource === 'dataPlayback') {
                                    mapStorage = await getPlaybackMapData(collectionMaps, mapId, s2c.payload.frameSelected)
                                }
                                const {path, ownerUser} = await getMapProps(collectionMaps, mapId)
                                let mapRight = MAP_RIGHT.UNAUTHORIZED
                                if (systemMaps.map(x => JSON.stringify(x)).includes((JSON.stringify(mapId)))) {
                                    mapRight = isEqual(currUser._id, adminUser) ? MAP_RIGHT.EDIT : MAP_RIGHT.VIEW;
                                } else {
                                    if (isEqual(currUser._id, ownerUser)) {
                                        mapRight = MAP_RIGHT.EDIT
                                    } else {
                                        let fullPath = [...path, mapId]
                                        for (let i = fullPath.length - 1; i > -1; i--) {
                                            const currMapId = fullPath[i]
                                            const shareData = await collectionShares.findOne({
                                                shareUser: currUser._id,
                                                sharedMap: currMapId
                                            })
                                            if (shareData !== null) {
                                                mapRight = shareData.access
                                            }
                                        }
                                    }
                                }
                                Object.assign(s2c.payload, {mapStorage, mapRight})
                            }
                            if (s2c.payload.hasOwnProperty('tabMapIdList')) {
                                const {tabMapIdList} = s2c.payload;
                                const tabMapNameList = await getMapNameList(collectionMaps, tabMapIdList)
                                Object.assign(s2c.payload, {tabMapNameList})
                            }
                            if (s2c.payload.hasOwnProperty('breadcrumbMapIdList')) {
                                const {breadcrumbMapIdList} = s2c.payload;
                                const breadcrumbMapNameList = await getMapNameList(collectionMaps, breadcrumbMapIdList)
                                Object.assign(s2c.payload, {breadcrumbMapNameList})
                            }
                        }
                    }
                }
            }
        } catch (err) {
            console.log('mongo error')
            console.log(err.stack)
        }
    }
    return s2c
}

app.use(cors())
app.post('/beta', function (req, res) {
    let inputStream =       []
    req.on('data', function (data) {
        inputStream += data
    })
    req.on('end', function () {
        let c2s = JSON.parse(inputStream) // it must be a parameter to prevent async issues
        inputStream = []
        sendResponse(c2s).then(s2c => {
            res.json(s2c)
            console.log('response sent')
        })
    })
})

MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
    if (err) {
        console.log(err)
    } else {
        console.log('connected')
        db = client.db(process.env.MONGO_TARGET_DB || "app_dev")
        collectionUsers = db.collection('users')
        collectionMaps = db.collection('maps')
        collectionShares = db.collection('shares')
        app.listen(process.env.PORT || 8082, function () {console.log('CORS-enabled web server listening on port 8082')})
    }
})

module.exports = app
