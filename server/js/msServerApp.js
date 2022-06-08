"use strict"
const express = require('express')
const cors = require('cors')
const app = express()
const {MongoClient} = require('mongodb')
const {ObjectId} = require('mongodb')
const uri = `mongodb+srv://admin:${encodeURIComponent('TNszfBws4@JQ8!t')}@cluster0.wbdxy.mongodb.net`
const nodemailer = require("nodemailer")
const {
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
} = require("./MongoQueries")
const mongoose = require('mongoose')

const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'info@mapboard.io',
        pass: 'r9yVsEzEf7y8KA*'
    }
})

const ACTIVATION_STATUS = {
    COMPLETED: 'completed',
    AWAITING_CONFIRMATION: 'awaitingConfirmation'
}

const MAP_RIGHTS = {
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

let usersColl, mapsColl, sharesColl, db

function getConfirmationCode() {
    let [min, max] = [1000, 9999]
    return Math.round(Math.random() * (max - min) + min)
}

function getDefaultMap (mapName, ownerUser, path) {
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

async function checkSave (req, currUser) {
    if (req.hasOwnProperty('payload') &&
      req.payload.hasOwnProperty('mapIdOut') &&
      req.payload.hasOwnProperty('mapSourceOut') &&
      req.payload.hasOwnProperty('mapStorageOut')
    ) {
        const {mapIdOut, mapSourceOut, mapStorageOut} = req.payload
        const {ownerUser} = await getMapProps(mapsColl, ObjectId(mapIdOut))
        const shareToEdit = await sharesColl.findOne({
            shareUser: currUser._id,
            sharedMap: ObjectId(mapIdOut),
            access: 'edit'
        })
        if (isEqual(currUser._id, ownerUser) || shareToEdit !== null) {
            if (mapSourceOut === 'data') {
                await mapsColl.updateOne(
                  {_id: ObjectId(mapIdOut)},
                  {$set: {data: mapStorageOut}}
                )
            } else if (mapSourceOut === 'dataPlayback') {
                const {frameSelectedOut} = req.payload
                await mapsColl.updateOne(
                  {_id: ObjectId(mapIdOut)},
                  {$set: {[`dataPlayback.${frameSelectedOut}`]: mapStorageOut}}
                )
            }
        }
    }
}

async function resolveType(req, currUser) {
    switch (req.type) {
        case 'LIVE_DEMO': { // QUERY
            // this could depend on queryString
            let mapId = '5f3fd7ba7a84a4205428c96a'
            return {
                type: 'liveDemoSuccess',
                payload: {
                    landingData: (await mapsColl.findOne({_id: ObjectId(mapId)})).dataPlayback,
                    mapRight: MAP_RIGHTS.VIEW
                },
            }
        }
        case 'SIGN_UP_STEP_1': { // MUTATION
            const { name, email, password } = req.payload
            const currUser = await getUserByEmail(usersColl, email)
            if (currUser === null) {
                let confirmationCode = getConfirmationCode()
                await transporter.sendMail({
                    from: "info@mapboard.io",
                    to: email,
                    subject: "MapBoard Email Confirmation",
                    text: "",
                    html:
                        `
                        <p>Hello ${name}!</p>
                        <p>Welcome to MapBoard!<br>You can complete your registration using the following code:</p>
                        <p>${confirmationCode}</p>
                        <p>You can also join the conversation, propose features and get product news here:<br>
                        <a href="MindBoard Slack">https://join.slack.com/t/mapboardinc/shared_invite/zt-18h31ogqv-~MoUZJ_06XCV7st8tfKIBg</a></p>
                        <p>Cheers,<br>Krisztian from MapBoard</p>
                        `
                })
                await usersColl.insertOne({
                    email,
                    password,
                    name,
                    activationStatus: ACTIVATION_STATUS.AWAITING_CONFIRMATION,
                    confirmationCode
                })
                return { type: 'signUpStep1Success' }
            } else {
                return { type: 'signUpStep1FailEmailAlreadyInUse' }

            }
        }
        case 'SIGN_UP_STEP_2': { // MUTATION
            let { email, confirmationCode } = req.payload
            const currUser = await getUserByEmail(usersColl, email)
            if (currUser === null) {
                return { type: 'signUpStep2FailUnknownUser' }
            } else if (currUser.activationStatus === ACTIVATION_STATUS.COMPLETED) {
                return { type: 'signUpStep2FailAlreadyActivated' }
            } else if (parseInt(confirmationCode) !== currUser.confirmationCode) {
                return { type: 'signUpStep2FailWrongCode' }
            } else {
                let newMap = getDefaultMap('My First Map', currUser._id, [])
                let mapId = (await mapsColl.insertOne(newMap)).insertedId
                await usersColl.updateOne(
                  { _id: currUser._id },
                  {
                      $set: {
                          activationStatus: ACTIVATION_STATUS.COMPLETED,
                          tabMapSelected: systemMaps.length,
                          tabMapIdList: [...systemMaps, mapId],
                          breadcrumbMapIdList: [mapId]
                      }
                  })
                return { type: 'signUpStep2Success' }
            }
        }
        case 'SIGN_IN': { // QUERY
            const { cred } = req.payload
            const { tabMapIdList, tabMapSelected, breadcrumbMapIdList, colorMode } = currUser
            const mapId = breadcrumbMapIdList[breadcrumbMapIdList.length - 1]
            const mapSource = 'data'
            return {
                type: 'signInSuccess',
                payload: { cred, tabMapIdList, tabMapSelected, breadcrumbMapIdList, mapId, mapSource, colorMode }
            }
        }
        case 'OPEN_MAP_FROM_TAB': { // QUERY
            const { tabMapIdList } = currUser
            const { tabMapSelected } = req.payload
            const mapId = tabMapIdList[tabMapSelected]
            const breadcrumbMapIdList = [mapId]
            const mapSource = 'data'
            return {
                type: 'openMapFromTabSuccess',
                payload: { tabMapIdList, tabMapSelected, breadcrumbMapIdList, mapId, mapSource }
            }
        }
        case 'OPEN_MAP_FROM_MAP': { // QUERY
            let { breadcrumbMapIdList } = currUser
            let { mapId } = req.payload
            mapId = ObjectId(mapId)
            breadcrumbMapIdList = [...breadcrumbMapIdList, mapId]
            const mapSource = 'data'
            return { type: 'openMapFromMapSuccess', payload: { breadcrumbMapIdList, mapId, mapSource } }
        }
        case 'OPEN_MAP_FROM_BREADCRUMBS': { // QUERY
            let { breadcrumbMapIdList } = currUser
            let { breadcrumbMapSelected } = req.payload
            breadcrumbMapIdList.length = breadcrumbMapSelected + 1
            let mapId = breadcrumbMapIdList[breadcrumbMapIdList.length - 1]
            const mapSource = 'data'
            return { type: 'openMapFromBreadcrumbsSuccess', payload: { breadcrumbMapIdList, mapId, mapSource } }
        }
        case 'SAVE_MAP': { // MUTATION
            return { type: 'saveMapSuccess' }
        }
        case 'CREATE_MAP_IN_MAP': { // MUTATION
            let { breadcrumbMapIdList } = currUser
            let { mapIdOut, lastPath, newMapName } = req.payload
            let newMap = getDefaultMap(newMapName, currUser._id, breadcrumbMapIdList)
            let mapId = (await mapsColl.insertOne(newMap)).insertedId
            await mapsColl.updateOne(
              { _id: ObjectId(mapIdOut) },
              { $set: { 'data.$[elem].linkType': 'internal', 'data.$[elem].link': mapId.toString() } },
              { "arrayFilters": [{ "elem.path": lastPath }], "multi": true }
            )
            breadcrumbMapIdList = [...breadcrumbMapIdList, mapId]
            const mapSource = 'data'
            return { type: 'createMapInMapSuccess', payload: { breadcrumbMapIdList, mapId, mapSource } }
        }
        case 'CREATE_MAP_IN_TAB': { // MUTATION
            let { tabMapIdList, tabMapSelected, breadcrumbMapIdList } = currUser
            const newMap = getDefaultMap('New Map', currUser._id, [])
            const mapId = (await mapsColl.insertOne(newMap)).insertedId
            tabMapIdList = [...tabMapIdList, mapId]
            tabMapSelected = tabMapIdList.length - 1
            breadcrumbMapIdList = [mapId]
            const mapSource = 'data'
            return {
                type: 'createMapInTabSuccess',
                payload: { tabMapIdList, tabMapSelected, breadcrumbMapIdList, mapId, mapSource }
            }
        }
        case 'REMOVE_MAP_IN_TAB': { // MUTATION
            if (currUser.tabMapIdList.length === 1) {
                return { type: 'removeMapInTabFail' }
            } else {
                const mapIdToDelete = currUser.tabMapIdList[currUser.tabMapSelected]
                isEqual((await getMapProps(mapsColl, mapIdToDelete)).ownerUser, currUser._id)
                  ? await deleteMapAll(usersColl, sharesColl, mapIdToDelete)
                  : await deleteMapOne(usersColl, sharesColl, mapIdToDelete, currUser._id)
                const currUserUpdated = await usersColl.findOne({ email: req.payload.cred.email })
                const { tabMapIdList, tabMapSelected, breadcrumbMapIdList } = currUserUpdated
                const mapId = tabMapIdList[tabMapSelected]
                const mapSource = 'data'
                return {
                    type: 'removeMapInTabSuccess',
                    payload: { tabMapIdList, tabMapSelected, breadcrumbMapIdList, mapId, mapSource }
                }
            }
        }
        case 'MOVE_UP_MAP_IN_TAB': { // MUTATION
            let { tabMapIdList, tabMapSelected } = currUser
            if (tabMapSelected === 0) {
                return { type: 'moveUpMapInTabFail' }
            } else {
                [tabMapIdList[tabMapSelected], tabMapIdList[tabMapSelected - 1]] =
                  [tabMapIdList[tabMapSelected - 1], tabMapIdList[tabMapSelected]]
                tabMapSelected = tabMapSelected - 1
                return { type: 'moveUpMapInTabSuccess', payload: { tabMapIdList, tabMapSelected } }
            }
        }
        case 'MOVE_DOWN_MAP_IN_TAB': { // MUTATION
            let { tabMapIdList, tabMapSelected } = currUser
            if (tabMapSelected >= tabMapIdList.length - 1) {
                return { type: 'moveDownMapInTabFail' }
            } else {
                [tabMapIdList[tabMapSelected], tabMapIdList[tabMapSelected + 1]] =
                  [tabMapIdList[tabMapSelected + 1], tabMapIdList[tabMapSelected]]
                tabMapSelected = tabMapSelected + 1
                return { type: 'moveDownMapInTabSuccess', payload: { tabMapIdList, tabMapSelected } }
            }
        }
        case 'OPEN_FRAME': { // QUERY
            const { mapIdOut } = req.payload
            const mapId = ObjectId(mapIdOut)
            const frameSelected = await getFrameSelected(mapsColl, mapId)
            const frameLen = await getFrameLen(mapsColl, mapId)
            if (frameLen === 0) {
                return { type: 'openFrameFail', payload: { frameLen, frameSelected } }
            } else {
                const mapSource = 'dataPlayback'
                return { type: 'openFrameSuccess', payload: { mapId, mapSource, frameLen, frameSelected } }
            }
        }
        case 'OPEN_PREV_FRAME': { // QUERY
            const { mapIdOut, frameSelectedOut } = req.payload
            const mapId = ObjectId(mapIdOut)
            const frameLen = await getFrameLen(mapsColl, mapId)
            let frameSelected = await getFrameSelected(mapsColl, mapId)
            frameSelected = frameSelected > 0 ? frameSelected - 1 : 0
            await mapsColl.updateOne({ _id: mapId }, { $set: { frameSelected } })
            const mapSource = 'dataPlayback'
            return { type: 'openFrameSuccess', payload: { mapId, mapSource, frameLen, frameSelected } }
        }
        case 'OPEN_NEXT_FRAME': { // QUERY
            const { mapIdOut, frameSelectedOut } = req.payload
            const mapId = ObjectId(mapIdOut)
            const frameLen = await getFrameLen(mapsColl, mapId)
            let frameSelected = await getFrameSelected(mapsColl, mapId)
            frameSelected = frameSelected < frameLen - 1 ? frameSelected + 1 : frameLen - 1
            await mapsColl.updateOne({ _id: mapId }, { $set: { frameSelected } })
            const mapSource = 'dataPlayback'
            return { type: 'openFrameSuccess', payload: { mapId, mapSource, frameLen, frameSelected } }
        }
        case 'IMPORT_FRAME': { // MUTATION
            const { mapIdOut } = req.payload
            const mapId = ObjectId(mapIdOut)
            const mapSource = 'dataPlayback'
            const mapStorage = await getMapData(mapsColl, mapId)
            await mapsColl.updateOne({ _id: mapId }, { $push: { "dataPlayback": mapStorage } })
            const frameLen = await getFrameLen(mapsColl, mapId)
            const frameSelected = frameLen - 1
            return { type: 'importFrameSuccess', payload: { mapId, mapSource, frameLen, frameSelected } }
        }
        case 'DELETE_FRAME': { // MUTATION
            const { mapIdDelete, frameSelectedOut } = req.payload
            const mapId = ObjectId(mapIdDelete)
            const frameSelected = frameSelectedOut > 0 ? frameSelectedOut - 1 : 0
            let frameLen = await getFrameLen(mapsColl, mapId)
            if (frameLen === 0) {
                return { type: 'deleteFrameFail' }
            } else {
                await mapsColl.updateOne({ _id: mapId }, [{
                    $set: {
                        dataPlayback: {
                            $concatArrays: [
                                { $slice: ["$dataPlayback", frameSelectedOut] },
                                { $slice: ["$dataPlayback", { $add: [1, frameSelectedOut] }, { $size: "$dataPlayback" }] }
                            ]
                        }
                    }
                }])
                frameLen = frameLen - 1
                const mapSource = frameLen === 0 ? 'data' : 'dataPlayback'
                return { type: 'deleteFrameSuccess', payload: { mapId, mapSource, frameLen, frameSelected } }
            }
        }
        case 'DUPLICATE_FRAME': { // MUTATION
            const { mapIdOut, mapStorageOut, frameSelectedOut } = req.payload
            const frameSelected = frameSelectedOut + 1
            const mapId = ObjectId(mapIdOut)
            await mapsColl.updateOne({ _id: mapId }, {
                $push: {
                    "dataPlayback": {
                        $each: [mapStorageOut],
                        $position: frameSelectedOut
                    }
                }
            })
            const mapSource = "dataPlayback"
            const frameLen = await getFrameLen(mapsColl, mapId)
            return { type: 'duplicateFrameSuccess', payload: { mapId, mapSource, frameLen, frameSelected } }
        }
        case 'GET_SHARES': { // QUERY
            const {
                shareDataExport,
                shareDataImport
            } = await getUserShares(usersColl, mapsColl, sharesColl, currUser._id)
            return { type: 'getSharesSuccess', payload: { shareDataExport, shareDataImport } }
        }
        case 'CREATE_SHARE': { // MUTATION
            const { mapId, shareEmail, shareAccess } = req.payload
            const shareUser = await usersColl.findOne({ email: shareEmail })
            if (shareUser === null) {
                return { type: 'createShareFailNotAValidUser' }
            } else if (isEqual(shareUser._id, currUser._id)) {
                return { type: 'createShareFailCantShareWithYourself' }
            } else {
                const currShare = await sharesColl.findOne({
                    sharedMap: ObjectId(mapId),
                    ownerUser: currUser._id,
                    shareUser: shareUser._id
                })
                if (currShare === null) {
                    const newShare = {
                        sharedMap: ObjectId(mapId),
                        ownerUser: currUser._id,
                        shareUser: shareUser._id,
                        access: shareAccess,
                        status: SHARE_STATUS.WAITING
                    }
                    await sharesColl.insertOne(newShare)
                    return { type: 'createShareSuccess' }
                } else {
                    if (currShare.access === shareAccess) {
                        return { type: 'createShareFailAlreadyShared' }
                    } else {
                        await sharesColl.updateOne({ _id: currShare._id }, { $set: { access: shareAccess } })
                        return { type: 'updateShareSuccess' }
                    }
                }
            }
        }
        case 'ACCEPT_SHARE': { // MUTATION
            let { tabMapIdList, tabMapSelected } = currUser
            const { shareIdOut } = req.payload
            const shareId = ObjectId(shareIdOut)
            const { sharedMap } = await getShareProps(sharesColl, shareId)
            tabMapIdList = [...tabMapIdList, sharedMap]
            tabMapSelected = tabMapIdList.length - 1
            const mapId = tabMapIdList[tabMapSelected]
            const breadcrumbMapIdList = [mapId]
            const mapSource = 'data'
            await sharesColl.updateOne({ _id: shareId }, { $set: { status: SHARE_STATUS.ACCEPTED } })
            const {
                shareDataExport,
                shareDataImport
            } = await getUserShares(usersColl, mapsColl, sharesColl, currUser._id)
            return {
                type: 'acceptShareSuccess',
                payload: { shareDataExport, shareDataImport, tabMapIdList, tabMapSelected, breadcrumbMapIdList, mapId, mapSource }
            }
        }
        case 'DELETE_SHARE': { // MUTATION
            const { shareIdOut } = req.payload
            const shareId = ObjectId(shareIdOut)
            const { shareUser, sharedMap } = await getShareProps(sharesColl, shareId)
            await deleteMapOne(usersColl, sharesColl, sharedMap, shareUser)
            const {
                shareDataExport,
                shareDataImport
            } = await getUserShares(usersColl, mapsColl, sharesColl, currUser._id)
            return { type: 'deleteShareSuccess', payload: { shareDataExport, shareDataImport } }
        }
        case 'GET_NAME': { // QUERY
            const { name } = currUser
            return { name } // no type as this goes to saga directly
        }
        case 'CHANGE_COLOR_MODE': { // MUTATION
            const { colorMode } = req.payload
            await usersColl.updateOne({ _id: currUser._id }, { $set: { colorMode } })
            return { type: 'changeColorModeSuccess' }
        }
    }
}

async function appendStuff (resp, currUser) {
    if (resp.hasOwnProperty('payload')) {
        if (resp.payload.hasOwnProperty('mapId') &&
          resp.payload.hasOwnProperty('mapSource')) {
            const {mapId, mapSource} = resp.payload
            let mapStorage = {}
            if (mapSource === 'data') {
                mapStorage = await getMapData(mapsColl, mapId)
            } else if (mapSource === 'dataPlayback') {
                mapStorage = await getPlaybackMapData(mapsColl, mapId, resp.payload.frameSelected)
            }
            const {path, ownerUser} = await getMapProps(mapsColl, mapId)
            let mapRight = MAP_RIGHTS.UNAUTHORIZED
            if (systemMaps.map(x => JSON.stringify(x)).includes((JSON.stringify(mapId)))) {
                mapRight = isEqual(currUser._id, adminUser)
                  ? MAP_RIGHTS.EDIT
                  : MAP_RIGHTS.VIEW
            } else {
                if (isEqual(currUser._id, ownerUser)) {
                    mapRight = MAP_RIGHTS.EDIT
                } else {
                    const fullPath = [...path, mapId]
                    for (let i = fullPath.length - 1; i > -1; i--) {
                        const currMapId = fullPath[i]
                        const shareData = await sharesColl.findOne({
                            shareUser: currUser._id,
                            sharedMap: currMapId
                        })
                        if (shareData !== null) {
                            mapRight = shareData.access
                        }
                    }
                }
            }
            Object.assign(resp.payload, {mapStorage, mapRight})
        }
        if (resp.payload.hasOwnProperty('tabMapIdList') &&
          resp.payload.hasOwnProperty('tabMapSelected')) {
            const {tabMapIdList, tabMapSelected} = resp.payload
            await usersColl.updateOne({_id: currUser._id}, {$set: {tabMapIdList, tabMapSelected}})
            const tabMapNameList = await getMapNameList(mapsColl, tabMapIdList)
            Object.assign(resp.payload, {tabMapNameList})
        }
        if (resp.payload.hasOwnProperty('breadcrumbMapIdList')) {
            const {breadcrumbMapIdList} = resp.payload
            const breadcrumbMapNameList = await getMapNameList(mapsColl, breadcrumbMapIdList)
            await usersColl.updateOne({_id: currUser._id}, {$set: {breadcrumbMapIdList}})
            Object.assign(resp.payload, {breadcrumbMapNameList})
        }
    }
    return resp
}

async function processReq(req) {
    try {
        let currUser
        if (req.payload?.hasOwnProperty('cred')) {
            currUser = await getUser(usersColl, req.payload.cred)
            if (currUser === null) {
                return { type: 'signInFailWrongCred' }
            } else if (currUser.activationStatus === ACTIVATION_STATUS.AWAITING_CONFIRMATION) {
                return { type: 'signInFailIncompleteRegistration' }
            }
        }
        await checkSave(req, currUser)
        let resp = await resolveType(req, currUser)
        resp = await appendStuff(resp, currUser)
        return resp
    } catch (err) {
        console.log('server error')
        console.log(err.stack)
        return {type: 'error', payload: err.stack}
    }
}

app.use(cors())
app.post('/beta', function (req, res) {
    let inputStream = []
    req.on('data', function (data) {
        inputStream += data
    })
    req.on('end', function () {
        let req = JSON.parse(inputStream) // it must be a parameter to prevent async issues
        inputStream = []
        processReq(req).then(resp => {
            res.json({resp})
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
        usersColl = db.collection('users')
        mapsColl = db.collection('maps')
        sharesColl = db.collection('shares')
        app.listen(process.env.PORT || 8082, function () {
            console.log('CORS-enabled web server listening on port 8082')
        })
    }
})

module.exports = app

async function stuff () {

    const finalUri = uri + '/app_dev';

    await mongoose.connect(finalUri, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log(mongoose.connection.readyState);
    console.log('poststuff')

    const users = new mongoose.Schema({
        name: String,
        email: String,
        password: String,
        tabMapSelected: Number,
        tabMapIdList: [ObjectId], // [mongoose.Schema.Types.ObjectId]
        activationStatus: String,
        breadcrumbMapIdList: [ObjectId], // [mongoose.Schema.Types.ObjectId]
        colorMode: String
    })

    const Users = mongoose.model('Users', users)

    const maya = new Users({ name: 'Maya' })

    console.log('go maya...')

    await maya.save().then(err => console.log(err));

    // TODO: putting things together using REF
    // TODO: trying to put apollo on top of all that

    console.log('SAVED')

}

// stuff()
