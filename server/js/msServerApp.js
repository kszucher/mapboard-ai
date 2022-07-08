"use strict"
const express = require('express')
const cors = require('cors')
const app = express()
const {MongoClient} = require('mongodb')
const {ObjectId} = require('mongodb')
const uri = `mongodb+srv://admin:${encodeURIComponent('TNszfBws4@JQ8!t')}@cluster0.wbdxy.mongodb.net`
const nodemailer = require("nodemailer")
const MongoQueries = require("./MongoQueries");

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

let users, maps, shares, db

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
        req.payload.hasOwnProperty('save')) {
        const mapId = ObjectId(req.payload.save.mapId)
        const { mapSource, mapStorage } = req.payload.save
        const { ownerUser, frameSelected } = await MongoQueries.getMap(maps, mapId)
        const shareToEdit = await shares.findOne({ shareUser: currUser._id, sharedMap: mapId, access: 'edit' })
        if (isEqual(currUser._id, ownerUser) || shareToEdit !== null) {
            if (mapSource === 'data') {
                await maps.updateOne({ _id: mapId }, { $set: { data: mapStorage } })
            } else if (mapSource === 'dataPlayback') {
                await maps.updateOne({ _id: mapId }, { $set: { [`dataPlayback.${frameSelected}`]: mapStorage } })
            }
        }
    }
}

async function getMapInfo (currUser, shares, map, mapId, mapSource) {
    const { path, ownerUser, data, dataPlayback, frameSelected } = map
    const frameLen = dataPlayback.length
    if (frameLen === 0 && mapSource === 'dataPlayback') {
        mapSource = 'data'
    }
    const mapStorage = mapSource === 'data' ? data: dataPlayback[frameSelected]
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
                const shareData = await shares.findOne({
                    shareUser: currUser._id,
                    sharedMap: currMapId
                })
                if (shareData !== null) {
                    mapRight = shareData.access
                }
            }
        }
    }
    return { mapId, mapSource, mapStorage, frameLen, frameSelected, mapRight }
}

async function resolveType(req, currUser) {
    switch (req.type) {
        case 'LIVE_DEMO': { // QUERY
            // this could depend on queryString
            const mapId = ObjectId('5f3fd7ba7a84a4205428c96a')
            return { type: 'liveDemoSuccess', payload: { landingData: (await maps.findOne({_id: mapId})).dataPlayback, mapRight: MAP_RIGHTS.VIEW } }
        }
        case 'SIGN_UP_STEP_1': { // MUTATION
            const { name, email, password } = req.payload
            const currUser = await MongoQueries.getUserByEmail(users, email)
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
                        <a href="MapBoard Slack">https://join.slack.com/t/mapboardinc/shared_invite/zt-18h31ogqv-~MoUZJ_06XCV7st8tfKIBg</a></p>
                        <p>Cheers,<br>Krisztian from MapBoard</p>
                        `
                })
                await users.insertOne({
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
            const currUser = await MongoQueries.getUserByEmail(users, email)
            if (currUser === null) {
                return { type: 'signUpStep2FailUnknownUser' }
            } else if (currUser.activationStatus === ACTIVATION_STATUS.COMPLETED) {
                return { type: 'signUpStep2FailAlreadyActivated' }
            } else if (parseInt(confirmationCode) !== currUser.confirmationCode) {
                return { type: 'signUpStep2FailWrongCode' }
            } else {
                let newMap = getDefaultMap('My First Map', currUser._id, [])
                let mapId = (await maps.insertOne(newMap)).insertedId
                await users.updateOne(
                    { _id: currUser._id },
                    {
                        $set: {
                            activationStatus: ACTIVATION_STATUS.COMPLETED,
                            tabMapIdList: [...systemMaps, mapId],
                            breadcrumbMapIdList: [mapId]
                        }
                    })
                return { type: 'signUpStep2Success' }
            }
        }
        case 'SIGN_IN': { // QUERY
            const { cred } = req.payload
            const { tabMapIdList, breadcrumbMapIdList, colorMode } = currUser
            const mapId = breadcrumbMapIdList[breadcrumbMapIdList.length - 1]
            const map = await MongoQueries.getMap(maps, mapId)
            const mapInfo = await getMapInfo(currUser, shares, map, mapId, 'data')
            return { type: 'signInSuccess', payload: { cred, tabMapIdList, breadcrumbMapIdList, colorMode, ...mapInfo } }
        }
        case 'SAVE_MAP': { // MUTATION
            return { type: 'saveMapSuccess' }
        }
        case 'OPEN_MAP_FROM_TAB': { // MUTATION
            const mapId = ObjectId(req.payload.mapId)

            // TODO unify
            const breadcrumbMapIdList = [mapId]
            await users.updateOne({_id: currUser._id}, { $set: { breadcrumbMapIdList } })

            const map = await MongoQueries.getMap(maps, mapId)
            const mapInfo = await getMapInfo(currUser, shares, map, mapId, 'data')
            return { type: 'openMapFromTabSuccess', payload: { breadcrumbMapIdList, ...mapInfo } }
        }
        case 'OPEN_MAP_FROM_MAP': { // MUTATION
            const mapId = ObjectId(req.payload.mapId)

            // TODO unify
            let { breadcrumbMapIdList } = currUser
            breadcrumbMapIdList = [...breadcrumbMapIdList, mapId]
            await users.updateOne({_id: currUser._id}, { $set: { breadcrumbMapIdList } })

            const map = await MongoQueries.getMap(maps, mapId)
            const mapInfo = await getMapInfo(currUser, shares, map, mapId, 'data')
            return { type: 'openMapFromMapSuccess', payload: { breadcrumbMapIdList, ...mapInfo } }
        }
        case 'OPEN_MAP_FROM_BREADCRUMBS': { // MUTATION
            let { breadcrumbMapSelected } = req.payload

            // TODO unify
            let { breadcrumbMapIdList } = currUser
            breadcrumbMapIdList.length = breadcrumbMapSelected + 1
            await users.updateOne({_id: currUser._id}, { $set: { breadcrumbMapIdList } })

            const mapId = breadcrumbMapIdList[breadcrumbMapIdList.length - 1]
            const map = await MongoQueries.getMap(maps, mapId)
            const mapInfo = await getMapInfo(currUser, shares, map, mapId, 'data')
            return { type: 'openMapFromBreadcrumbsSuccess', payload: { breadcrumbMapIdList, ...mapInfo } }
        }
        case 'CREATE_MAP_IN_MAP': { // MUTATION
            // CREATE NEW
            const { lastPath, newMapName } = req.payload
            let { breadcrumbMapIdList } = currUser
            const newMapId = (await maps.insertOne(getDefaultMap(newMapName, currUser._id, breadcrumbMapIdList))).insertedId

            // TODO unify
            breadcrumbMapIdList = [...breadcrumbMapIdList, newMapId]
            await users.updateOne({_id: currUser._id}, { $set: { breadcrumbMapIdList } })

            // UPDATE OLD
            const mapId = ObjectId(req.payload.mapId) // maybe use .save mapId, as it is already there
            await maps.updateOne(
                { _id: mapId },
                { $set: { 'data.$[elem].linkType': 'internal', 'data.$[elem].link': newMapId.toString() } },
                { "arrayFilters": [{ "elem.path": lastPath }], "multi": true }
            )
            // RETURN NEW
            const newMap = await MongoQueries.getMap(maps, newMapId)
            const newMapInfo = await getMapInfo(currUser, shares, newMap, newMapId, 'data')
            return { type: 'createMapInMapSuccess', payload: { breadcrumbMapIdList, ...newMapInfo } }
        }
        case 'CREATE_MAP_IN_TAB': { // MUTATION
            const mapId = (await maps.insertOne(getDefaultMap('New Map', currUser._id, []))).insertedId

            // TODO unify
            let { tabMapIdList, breadcrumbMapIdList } = currUser
            tabMapIdList = [...tabMapIdList, mapId]
            breadcrumbMapIdList = [mapId]
            await users.updateOne({_id: currUser._id}, { $set: { tabMapIdList, breadcrumbMapIdList }})

            const map = await MongoQueries.getMap(maps, mapId)
            const mapInfo = await getMapInfo(currUser, shares, map, mapId, 'data')
            return { type: 'createMapInTabSuccess', payload: { tabMapIdList, breadcrumbMapIdList, ...mapInfo } }
        }
        case 'REMOVE_MAP_IN_TAB': { // MUTATION
            const mapId = ObjectId(req.payload.mapId)
            const map = await MongoQueries.getMap(maps, mapId)
            const { ownerUser } = map
            const iAmTheOwner = isEqual(ownerUser, currUser._id)
            if (iAmTheOwner) {
                await MongoQueries.deleteMapFromUsers(users, { tabMapIdList: mapId })
                await MongoQueries.deleteMapFromShares(shares, { sharedMap: mapId })
            } else {
                await MongoQueries.deleteMapFromUsers(users, { _id: currUser._id, tabMapIdList: mapId })
                await MongoQueries.deleteMapFromShares(shares, { shareUser: currUser._id, sharedMap: mapId })
            }
            const userUpdated = await users.findOne({ email: req.payload.cred.email })
            const { tabMapIdList, breadcrumbMapIdList } = userUpdated
            const newMapId = breadcrumbMapIdList[0]
            const newMap = await MongoQueries.getMap(maps, newMapId)
            const newMapInfo = await getMapInfo(currUser, shares, newMap, newMapId, 'data')
            return { type: 'removeMapInTabSuccess', payload: { tabMapIdList, breadcrumbMapIdList, ...newMapInfo} }
        }
        case 'MOVE_UP_MAP_IN_TAB': { // MUTATION
            const mapId = ObjectId(req.payload.mapId)
            const { tabMapIdList } = await MongoQueries.moveUpMapInTab(users, currUser._id, mapId)
            return { type: 'moveUpMapInTabSuccess', payload: { tabMapIdList } }
        }
        case 'MOVE_DOWN_MAP_IN_TAB': { // MUTATION
            const mapId = ObjectId(req.payload.mapId)
            const { tabMapIdList } = await MongoQueries.moveDownMapInTab(users, currUser._id, mapId)
            return { type: 'moveDownMapInTabSuccess', payload: { tabMapIdList } }
        }
        case 'OPEN_FRAME': { // QUERY
            const mapId = ObjectId(req.payload.mapId)
            const map = await MongoQueries.getMap(maps, mapId)
            const mapInfo = await getMapInfo(currUser, shares, map, mapId, 'dataPlayback')
            return { type: 'openFrameFail', payload: { ...mapInfo } }
        }
        case 'OPEN_PREV_FRAME': { // MUTATION
            const mapId = ObjectId(req.payload.mapId)
            const map = await MongoQueries.openPrevFrame(maps, mapId)
            const mapInfo = await getMapInfo(currUser, shares, map, mapId, 'dataPlayback')
            return { type: 'openFrameSuccess', payload: { ...mapInfo } }
        }
        case 'OPEN_NEXT_FRAME': { // MUTATION
            const mapId = ObjectId(req.payload.mapId)
            const map = await MongoQueries.openNextFrame(maps, mapId)
            const mapInfo = await getMapInfo(currUser, shares, map, mapId, 'dataPlayback')
            return { type: 'openFrameSuccess', payload: { ...mapInfo } }
        }
        case 'IMPORT_FRAME': { // MUTATION
            const mapId = ObjectId(req.payload.mapId)
            const map = await MongoQueries.importFrame(maps, mapId)
            const mapInfo = await getMapInfo(currUser, shares, map, mapId, 'dataPlayback')
            return { type: 'importFrameSuccess', payload: { ...mapInfo } }
        }
        case 'DUPLICATE_FRAME': { // MUTATION
            const mapId = ObjectId(req.payload.mapId)
            const map = await MongoQueries.duplicateFrame(maps, mapId)
            const mapInfo = await getMapInfo(currUser, shares, map, mapId, 'dataPlayback')
            return { type: 'duplicateFrameSuccess', payload: { ...mapInfo } }
        }
        case 'DELETE_FRAME': { // MUTATION
            const mapId = ObjectId(req.payload.mapId)
            const map = await MongoQueries.deleteFrame(maps, mapId)
            const mapInfo = await getMapInfo(currUser, shares, map, mapId, 'dataPlayback')
            return { type: 'deleteFrameSuccess', payload: { ...mapInfo } }
        }
        case 'GET_SHARES': { // QUERY
            const shareInfo = await MongoQueries.getUserShares(users, maps, shares, currUser._id)
            return { type: 'getSharesSuccess', payload: { ...shareInfo } }
        }
        case 'CREATE_SHARE': { // MUTATION
            const mapId = ObjectId(req.payload.mapId)
            const { shareEmail, shareAccess } = req.payload
            const shareUser = await users.findOne({ email: shareEmail })
            if (shareUser === null) {
                return { type: 'createShareFailNotAValidUser' }
            } else if (isEqual(shareUser._id, currUser._id)) {
                return { type: 'createShareFailCantShareWithYourself' }
            } else {
                const currShare = await shares.findOne({
                    sharedMap: mapId,
                    ownerUser: currUser._id,
                    shareUser: shareUser._id
                })
                if (currShare === null) {
                    const newShare = {
                        sharedMap: mapId,
                        ownerUser: currUser._id,
                        shareUser: shareUser._id,
                        access: shareAccess,
                        status: SHARE_STATUS.WAITING
                    }
                    await shares.insertOne(newShare)
                    return { type: 'createShareSuccess' }
                } else {
                    if (currShare.access === shareAccess) {
                        return { type: 'createShareFailAlreadyShared' }
                    } else {
                        await shares.updateOne({ _id: currShare._id }, { $set: { access: shareAccess } })
                        return { type: 'updateShareSuccess' }
                    }
                }
            }
        }
        case 'ACCEPT_SHARE': { // MUTATION
            const shareId = ObjectId(req.payload.shareId)
            const share = (await shares.findOneAndUpdate(
                { _id: shareId },
                { $set: { status: SHARE_STATUS.ACCEPTED }},
                { returnDocument: 'after' }
            )).value
            const mapId = share.sharedMap

            // TODO unify
            let { tabMapIdList } = currUser
            tabMapIdList = [...tabMapIdList, mapId]
            const breadcrumbMapIdList = [mapId]
            await users.updateOne({_id: currUser._id}, { $set: { tabMapIdList, breadcrumbMapIdList } })

            const map = await MongoQueries.getMap(maps, mapId)
            const mapInfo = await getMapInfo(currUser, shares, map, mapId, 'data')
            const shareInfo = await MongoQueries.getUserShares(users, maps, shares, currUser._id)
            return { type: 'acceptShareSuccess', payload: { tabMapIdList, breadcrumbMapIdList, ...mapInfo, ...shareInfo } }
        }
        case 'DELETE_SHARE': { // MUTATION
            const shareId = ObjectId(req.payload.shareId)
            const { shareUser, sharedMap } = await MongoQueries.getShareProps(shares, shareId)

            await MongoQueries.deleteMapFromUsers(users, { _id: shareUser, tabMapIdList: sharedMap } )
            await MongoQueries.deleteMapFromShares(shares, { shareUser, sharedMap })

            // in case I want to remove share for ALL user I ever shared it with: "deleteMapAllButOne"
            // https://stackoverflow.com/questions/18439612/mongodb-find-all-except-from-one-or-two-criteria

            const shareInfo = await MongoQueries.getUserShares(users, maps, shares, currUser._id)
            return { type: 'deleteShareSuccess', payload: { ...shareInfo } }
        }
        case 'GET_NAME': { // QUERY
            const { name } = currUser
            return { name } // no type as this goes to saga directly
        }
        case 'CHANGE_COLOR_MODE': { // MUTATION
            const { colorMode } = req.payload
            await users.updateOne({ _id: currUser._id }, { $set: { colorMode } })
            return { type: 'changeColorModeSuccess' }
        }
        case 'CHANGE_TAB_WIDTH': { // MUTATION
            // const {  }

        }
    }
}

async function appendStuff (resp) {
    if (resp.hasOwnProperty('payload')) {
        if (resp.payload.hasOwnProperty('tabMapIdList')) {
            const { tabMapIdList } = resp.payload
            const tabMapNameList = await MongoQueries.getMapNameList(maps, tabMapIdList)
            Object.assign(resp.payload, { tabMapNameList })
        }
        if (resp.payload.hasOwnProperty('breadcrumbMapIdList')) {
            const { breadcrumbMapIdList } = resp.payload
            const breadcrumbMapNameList = await MongoQueries.getMapNameList(maps, breadcrumbMapIdList)
            Object.assign(resp.payload, { breadcrumbMapNameList })
        }
    }
    return resp
}

async function processReq(req) {
    try {
        let currUser
        if (req.payload?.hasOwnProperty('cred')) {
            currUser = await MongoQueries.getUser(users, req.payload.cred)
            if (currUser === null) {
                return { type: 'signInFailWrongCred' }
            } else if (currUser.activationStatus === ACTIVATION_STATUS.AWAITING_CONFIRMATION) {
                return { type: 'signInFailIncompleteRegistration' }
            }
        }
        await checkSave(req, currUser)
        let resp = await resolveType(req, currUser)
        resp = await appendStuff(resp)
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
        users = db.collection('users')
        maps = db.collection('maps')
        shares = db.collection('shares')
        app.listen(process.env.PORT || 8082, function () {
            console.log('CORS-enabled web server listening on port 8082')
        })
    }
})

module.exports = app
