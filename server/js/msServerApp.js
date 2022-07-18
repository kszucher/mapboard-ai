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
        dataFrames: [],
        ownerUser,
        path
    }
}

async function checkSave (req, currUser) {
    if (req.hasOwnProperty('payload') &&
        req.payload.hasOwnProperty('save')) {
        const mapId = ObjectId(req.payload.save.mapId)
        const { mapSource, mapData } = req.payload.save
        const { ownerUser, frameSelected } = await maps.findOne({_id: mapId})
        const shareToEdit = await shares.findOne({ shareUser: currUser._id, sharedMap: mapId, access: 'edit' })
        if (isEqual(currUser._id, ownerUser) || shareToEdit !== null) {
            if (mapSource === 'data') {
                await maps.updateOne({ _id: mapId }, { $set: { data: mapData } })
            } else if (mapSource === 'dataFrames') {
                await maps.updateOne({ _id: mapId }, { $set: { [`dataFrames.${frameSelected}`]: mapData } })
            }
        }
    }
}

async function getUserInfo (userId) {
    const user = await users.findOne({_id: userId})
    const { colorMode, breadcrumbMapIdList, tabMapIdList } = user
    const breadcrumbMapNameList = await MongoQueries.nameLookup(users, userId, 'breadcrumbMapIdList')
    const tabMapNameList = await MongoQueries.nameLookup(users, userId, 'tabMapIdList')
    return { colorMode, breadcrumbMapIdList, tabMapIdList, breadcrumbMapNameList, tabMapNameList }
}

async function getMapInfo (userId, mapId, mapSource) {
    const map = await maps.findOne({_id: mapId})
    const { path, ownerUser, data, dataFrames, frameSelected } = map
    const frameLen = dataFrames.length
    if (frameLen === 0 && mapSource === 'dataFrames') {
        mapSource = 'data'
    }
    const mapData = mapSource === 'data' ? data: dataFrames[frameSelected]
    let mapRight = MAP_RIGHTS.UNAUTHORIZED
    if (systemMaps.map(x => JSON.stringify(x)).includes((JSON.stringify(mapId)))) {
        mapRight = isEqual(userId, adminUser)
            ? MAP_RIGHTS.EDIT
            : MAP_RIGHTS.VIEW
    } else {
        if (isEqual(userId, ownerUser)) {
            mapRight = MAP_RIGHTS.EDIT
        } else {
            const fullPath = [...path, mapId]
            for (let i = fullPath.length - 1; i > -1; i--) {
                const currMapId = fullPath[i]
                const shareData = await shares.findOne({
                    shareUser: userId,
                    sharedMap: currMapId
                })
                if (shareData !== null) {
                    mapRight = shareData.access
                }
            }
        }
    }
    return { mapId, mapSource, mapData, frameLen, frameSelected, mapRight }
}

async function getShareInfo () {
    // TODO call stuff which looks up everything that is NEEDED
}

async function resolveType(req, userId) {
    switch (req.type) {
        case 'LIVE_DEMO': { // QUERY
            // this could depend on queryString
            const mapId = ObjectId('5f3fd7ba7a84a4205428c96a')
            return { error: '', data: { landingData: (await maps.findOne({_id: mapId})).dataFrames, mapRight: MAP_RIGHTS.VIEW } }
        }
        case 'SIGN_UP_STEP_1': { // MUTATION
            const { name, email, password } = req.payload
            const currUser = await users.findOne({ email })
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
                return { error: '' }
            } else {
                return { error: 'signUpStep1FailEmailAlreadyInUse' }
            }
        }
        case 'SIGN_UP_STEP_2': { // MUTATION
            let { email, confirmationCode } = req.payload
            const currUser = await users.findOne({ email })
            if (currUser === null) {
                return { error: 'signUpStep2FailUnknownUser' }
            } else if (currUser.activationStatus === ACTIVATION_STATUS.COMPLETED) {
                return { error: 'signUpStep2FailAlreadyActivated' }
            } else if (parseInt(confirmationCode) !== currUser.confirmationCode) {
                return { error: 'signUpStep2FailWrongCode' }
            } else {
                let newMap = getDefaultMap('My First Map', userId, [])
                let mapId = (await maps.insertOne(newMap)).insertedId
                await users.updateOne(
                    { _id: userId },
                    {
                        $set: {
                            activationStatus: ACTIVATION_STATUS.COMPLETED,
                            tabMapIdList: [...systemMaps, mapId],
                            breadcrumbMapIdList: [mapId]
                        }
                    })
                return { error: '' }
            }
        }
        case 'SIGN_IN': { // QUERY
            const { cred } = req.payload
            const userInfo = await getUserInfo(userId)
            const mapInfo = await getMapInfo(userId, userInfo.breadcrumbMapIdList.at(-1), 'data')
            return { error: '', data: { cred, ...userInfo, ...mapInfo } }
        }
        case 'SAVE_MAP': { // MUTATION
            // await new Promise(resolve => setTimeout(resolve, 5000))
            return { error: '' }
        }
        case 'OPEN_MAP_FROM_TAB': { // MUTATION
            const mapId = ObjectId(req.payload.mapId)
            await MongoQueries.replaceBreadcrumbs(users, userId, mapId)
            const userInfo = await getUserInfo(userId)
            const mapInfo = await getMapInfo(userId, mapId, 'data')
            return { error: '', data: { ...userInfo, ...mapInfo } }
        }
        case 'OPEN_MAP_FROM_BREADCRUMBS': { // MUTATION
            const mapId = ObjectId(req.payload.mapId)
            await MongoQueries.sliceBreadcrumbs(users, userId, mapId)
            const userInfo = await getUserInfo(userId)
            const mapInfo = await getMapInfo(userId, mapId, 'data')
            return { error: '', data: { ...userInfo, ...mapInfo } }
        }
        case 'OPEN_MAP_FROM_MAP': { // MUTATION
            const mapId = ObjectId(req.payload.mapId)
            await MongoQueries.appendBreadcrumbs(users, userId, mapId)
            const userInfo = await getUserInfo(userId)
            const mapInfo = await getMapInfo(userId, mapId, 'data')
            return { error: '', data: { ...userInfo, ...mapInfo } }
        }
        case 'CREATE_MAP_IN_MAP': { // MUTATION
            // LOAD OLD
            const mapId = ObjectId(req.payload.save.mapId)
            const map = await maps.findOne({_id: mapId})
            const { path } = map
            // CREATE NEW
            const { lastPath, newMapName } = req.payload
            const newMapId = (await maps.insertOne(getDefaultMap(newMapName, userId, [ ...path, mapId ] ))).insertedId
            await MongoQueries.appendBreadcrumbs(users, userId, newMapId)
            const userInfo = await getUserInfo(userId)
            // UPDATE OLD
            await maps.updateOne(
                { _id: mapId },
                { $set: { 'data.$[elem].linkType': 'internal', 'data.$[elem].link': newMapId.toString() } },
                { "arrayFilters": [{ "elem.path": lastPath }], "multi": true }
            )
            // RETURN NEW
            const newMapInfo = await getMapInfo(userId, newMapId, 'data')
            return { error: '', data: { ...userInfo, ...newMapInfo } }
        }
        case 'CREATE_MAP_IN_TAB': { // MUTATION
            const mapId = (await maps.insertOne(getDefaultMap('New Map', userId, []))).insertedId
            await MongoQueries.appendTabReplaceBreadcrumbs(users, userId, mapId)
            const userInfo = await getUserInfo(userId)
            const mapInfo = await getMapInfo(userId, mapId, 'data')
            return { error: '', data: { ...userInfo, ...mapInfo } }
        }
        case 'REMOVE_MAP_IN_TAB': { // MUTATION
            const mapId = ObjectId(req.payload.mapId)
            const map = await maps.findOne({_id: mapId})
            const { ownerUser } = map
            const iAmTheOwner = isEqual(ownerUser, userId)
            const userFilter = iAmTheOwner ? { tabMapIdList: mapId } : { _id: userId, tabMapIdList: mapId }
            const shareFilter = iAmTheOwner ? { sharedMap: mapId } : { shareUser: userId, sharedMap: mapId }
            await MongoQueries.deleteMapFromUsers(users, userFilter)
            await MongoQueries.deleteMapFromShares(shares, shareFilter)
            const userInfo = await getUserInfo(userId)
            const newMapInfo = await getMapInfo(userId, userInfo.breadcrumbMapIdList[0], 'data')
            return { error: '', data: { ...userInfo, ...newMapInfo} }
        }
        case 'MOVE_UP_MAP_IN_TAB': { // MUTATION
            const mapId = ObjectId(req.payload.mapId)
            await MongoQueries.moveUpMapInTab(users, userId, mapId)
            const userInfo = await getUserInfo(userId)
            return { error: '', data: { ...userInfo } }
        }
        case 'MOVE_DOWN_MAP_IN_TAB': { // MUTATION
            const mapId = ObjectId(req.payload.mapId)
            await MongoQueries.moveDownMapInTab(users, userId, mapId)
            const userInfo = await getUserInfo(userId)
            return { error: '', data: { ...userInfo } }
        }
        case 'OPEN_FRAME': { // QUERY
            const mapId = ObjectId(req.payload.save.mapId)
            const mapInfo = await getMapInfo(userId, mapId, 'dataFrames')
            return { error: '', data: { ...mapInfo } }
        }
        case 'OPEN_PREV_FRAME': { // MUTATION
            const mapId = ObjectId(req.payload.save.mapId)
            await MongoQueries.openPrevFrame(maps, mapId)
            const mapInfo = await getMapInfo(userId, mapId, 'dataFrames')
            return { error: '', data: { ...mapInfo } }
        }
        case 'OPEN_NEXT_FRAME': { // MUTATION
            const mapId = ObjectId(req.payload.save.mapId)
            await MongoQueries.openNextFrame(maps, mapId)
            const mapInfo = await getMapInfo(userId, mapId, 'dataFrames')
            return { error: '', data: { ...mapInfo } }
        }
        case 'IMPORT_FRAME': { // MUTATION
            const mapId = ObjectId(req.payload.save.mapId)
            await MongoQueries.importFrame(maps, mapId)
            const mapInfo = await getMapInfo(userId, mapId, 'dataFrames')
            return { error: '', data: { ...mapInfo } }
        }
        case 'DUPLICATE_FRAME': { // MUTATION
            const mapId = ObjectId(req.payload.save.mapId)
            await MongoQueries.duplicateFrame(maps, mapId)
            const mapInfo = await getMapInfo(userId, mapId, 'dataFrames')
            return { error: '', data: { ...mapInfo } }
        }
        case 'DELETE_FRAME': { // MUTATION
            const mapId = ObjectId(req.payload.mapId)
            await MongoQueries.deleteFrame(maps, mapId)
            const mapInfo = await getMapInfo(userId, mapId, 'dataFrames')
            return { error: '', data: { ...mapInfo } }
        }
        case 'GET_SHARES': { // QUERY
            const shareInfo = await MongoQueries.getUserShares(shares, userId)
            return { error: '', data: { ...shareInfo } }
        }
        case 'CREATE_SHARE': { // MUTATION
            const mapId = ObjectId(req.payload.mapId)
            const { shareEmail, shareAccess } = req.payload
            const shareUser = await users.findOne({ email: shareEmail })
            if (shareUser === null) {
                return { error: 'createShareFailNotAValidUser' }
            } else if (isEqual(shareUser._id, userId)) {
                return { error: 'createShareFailCantShareWithYourself' }
            } else {
                const currShare = await shares.findOne({
                    sharedMap: mapId,
                    ownerUser: userId,
                    shareUser: shareUser._id
                })
                if (currShare === null) {
                    const newShare = {
                        sharedMap: mapId,
                        ownerUser: userId,
                        shareUser: shareUser._id,
                        access: shareAccess,
                        status: SHARE_STATUS.WAITING
                    }
                    await shares.insertOne(newShare)
                    return { error: '' }
                } else {
                    if (currShare.access === shareAccess) {
                        return { error: 'createShareFailAlreadyShared' }
                    } else {
                        await shares.updateOne({ _id: currShare._id }, { $set: { access: shareAccess } })
                        return { error: '' }
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
            await MongoQueries.appendTabReplaceBreadcrumbs(users, userId, mapId)
            const userInfo = await getUserInfo(userId)
            const mapInfo = await getMapInfo(userId, mapId, 'data')
            const shareInfo = await MongoQueries.getUserShares(shares, userId)
            return { error: '', data: { ...userInfo, ...mapInfo, ...shareInfo } }
        }
        case 'DELETE_SHARE': { // MUTATION
            const shareId = ObjectId(req.payload.shareId)
            const { shareUser, sharedMap } = await shares.findOne({ _id: shareId })
            const userFilter = { _id: shareUser, tabMapIdList: sharedMap }
            const shareFilter = { shareUser, sharedMap }
            await MongoQueries.deleteMapFromUsers(users, userFilter)
            await MongoQueries.deleteMapFromShares(shares, shareFilter)
            const shareInfo = await MongoQueries.getUserShares(shares, userId)
            return { error: '', data: { ...shareInfo } }
        }
        case 'GET_NAME': { // QUERY
            const { name } = 'Krisztian' // TODO use getUserInfo, and name will be available already
            return { err: '', data: { name } }
        }
        case 'CHANGE_COLOR_MODE': { // MUTATION
            const { colorMode } = req.payload
            await users.updateOne({ _id: userId }, { $set: { colorMode } })
            return { error: '' }
        }
        case 'CHANGE_TAB_WIDTH': { // MUTATION
            // TODO
        }
    }
}

async function processReq(req) {
    try {
        let currUser
        if (req.payload?.hasOwnProperty('cred')) {
            const { email, password } = req.payload.cred
            currUser = await users.findOne({ email, password })

            if (currUser === null) {
                return { error: 'authFailWrongCred' }
            } else if (currUser.activationStatus === ACTIVATION_STATUS.AWAITING_CONFIRMATION) {
                return { error: 'authFailIncompleteRegistration' }
            }
        }
        await checkSave(req, currUser)
        return await resolveType(req, currUser._id)
    } catch (err) {
        console.log('server error')
        console.log(err.stack)
        return { error: 'error', data: err.stack }
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

// TODO
// simplify settings saga, as saga is not even needed as all data is available,
