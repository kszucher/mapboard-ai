"use strict"
const express = require('express')
const cors = require('cors')
const app = express()
const {MongoClient} = require('mongodb')
const {ObjectId} = require('mongodb')
const nodemailer = require("nodemailer")
const MongoQueries = require("./MongoQueries");
const MongoMutations = require("./MongoMutations");

const { baseUri } = require('./MongoSecret')
const { mergeMap } = require('./MongoMutations')

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
  UNAUTHORIZED: 0,
  VIEW: 1,
  EDIT: 2,
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

const genNodeIdJs = () => {
  const alphanumeric = '0123456789abcdefghijklmnopqrstuvwxyz'
  const randomAlphanumeric = () => ( alphanumeric[ Math.round( Math.random() * ( alphanumeric.length -  1 )) ] )
  const randomAlphanumeric8digit = new Array(8).fill('').map(el => randomAlphanumeric())
  return 'node' + randomAlphanumeric8digit.join('')
}

function getDefaultMap (mapName, ownerUser, path) {
  return {
    dataHistory: [
      [
        {nodeId: genNodeIdJs(), path: ['g']},
        {nodeId: genNodeIdJs(), path: ['r', 0], content: mapName, selected: 1},
        {nodeId: genNodeIdJs(), path: ['r', 0, 'd', 0]},
        {nodeId: genNodeIdJs(), path: ['r', 0, 'd', 1]},
      ]
    ],
    dataHistoryModifiers: [{
      modifierType: 'user',
      userId: ownerUser,
      sessionId: 0,
    }],
    dataFrames: [],
    ownerUser,
    path
  }
}

async function getAuthorizedUserId(req) {
  const cred = JSON.parse(req.header('authorization'))
  const authorizedUser = await users.findOne( cred )
  return authorizedUser ? authorizedUser._id : null
}

// const userId = getAuthorizedUserId(req)
// if (!userId) { return }



async function checkSave (req, userId) {
  if (req.hasOwnProperty('payload') &&
    req.payload.hasOwnProperty('save')) {
    const mapId = ObjectId(req.payload.save.mapId)
    const { mapSource, mapData } = req.payload.save
    const { ownerUser, frameSelected } = await maps.findOne({_id: mapId})
    const shareToEdit = await shares.findOne({ shareUser: userId, sharedMap: mapId, access: 'edit' })
    if (isEqual(userId, ownerUser) || shareToEdit !== null) { // can be done within one query using LOOKUP
      if (mapSource === 'dataHistory') {
        await mergeMap(maps, mapId, 'map', mapData)
      } else if (mapSource === 'dataFrames') {
        await maps.updateOne({ _id: mapId }, { $set: { [`dataFrames.${frameSelected}`]: mapData } }) // SAVE_MAP and SAVE_MAP_FRAME
      }
    }
  }
}

async function getUserInfo (userId) {
  const user = await users.findOne({_id: userId})
  const { name, colorMode, breadcrumbMapIdList, tabMapIdList } = user
  const breadcrumbMapNameList = await MongoQueries.nameLookup(users, userId, 'breadcrumbMapIdList')
  const tabMapNameList = await MongoQueries.nameLookup(users, userId, 'tabMapIdList')
  return { name, colorMode, breadcrumbMapIdList, tabMapIdList, breadcrumbMapNameList, tabMapNameList }
}

async function getMapInfo (userId, mapId, mapSource) {
  const map = await maps.findOne({_id: mapId})
  const { path, ownerUser, dataHistory, dataFrames, frameSelected } = map
  const frameLen = dataFrames.length
  if (frameLen === 0 && mapSource === 'dataFrames') {
    mapSource = 'dataHistory'
  }
  let mapData = mapSource === 'dataHistory' ? dataHistory[dataHistory.length - 1]: dataFrames[frameSelected]
  mapData = mapData.sort((a, b) => (a.path > b.path) ? 1 : -1)
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

async function getShareInfo (userId) {
  return await MongoQueries.getUserShares(shares, userId)
}

async function resolveType(req, REQ, userId) {
  switch (REQ.type) {
    case 'SIGN_IN': { // QUERY
      const userId = await getAuthorizedUserId(req)
      if (!userId) { return }
      // TODO: create session entry
      const cred = JSON.parse(req.header('authorization'))
      return { error: '', data: { cred } }
    }
    case 'SAVE_MAP': { // MUTATION
      // await new Promise(resolve => setTimeout(resolve, 5000))

      console.log('save map request')


      // const mapId = ObjectId(REQ.payload.save.mapId)
      // const { mapSource, mapData } = REQ.payload.save
      // const { ownerUser, frameSelected } = await maps.findOne({_id: mapId})
      // const shareToEdit = await shares.findOne({ shareUser: userId, sharedMap: mapId, access: 'edit' })
      // if (isEqual(userId, ownerUser) || shareToEdit !== null) { // can be done within one query using LOOKUP
      //   if (mapSource === 'dataHistory') {
      //     await mergeMap(maps, mapId, 'map', mapData)
      //   } else if (mapSource === 'dataFrames') {
      //     await maps.updateOne({ _id: mapId }, { $set: { [`dataFrames.${frameSelected}`]: mapData } }) // SAVE_MAP and SAVE_MAP_FRAME
      //   }
      // }

      return { error: '' }
    }
    // OPEN MAP = one query? how? we will only send the mapId, and we will figure out what to do
      // we can check containment for breadcrumbs and tabs, and can mutate breadcrumbs accordingly in ONE MUTATION...
      // MUTATE_BREADCRUMBS
      // but how do I send data to be saved???
      // I can still keep

      // TODO: the very first iteration:
      // rename OPEN_MAP_XXX to SELECT_MAP_XXX
      // have OPEN_MAP as follows and OPEN USER as follows
      // implement everything and invalidate these 2 always just to see if the concept works
      // later we can
      // - granularize invalidated stuff deeper
      // - recreate logic using mongo snakes
      // THE POINT IS: remove saga, and remove the functions above!!!!!!

    case 'SELECT_MAP': {
      break;
    }

    case 'OPEN_USER': {
      // TODO: return name and colorMode
      break;
    }



    case 'OPEN_MAP': {
      const userId = await getAuthorizedUserId(req) // this will come from Auth later so it won't be a duplicate
      const user = await users.findOne({_id: userId})
      const { breadcrumbMapIdList, tabMapIdList } = user
      const mapId = breadcrumbMapIdList.at(-1)
      const mapSource = REQ.payload.mapSource
      const map = await maps.findOne({_id: mapId})
      const { path, ownerUser, dataHistory, dataFrames, frameSelected } = map
      const frameLen = dataFrames.length

      // TODO when we try to open a frame when there are no frames, then we will NOT return the map but an error or sthg
      // if (frameLen === 0 && mapSource === 'dataFrames') { // INSTEAD we will have an OPEN_MAP_FRAME command
      //   mapSource = 'dataHistory'
      // }

      let mapData = mapSource === 'dataHistory'
        ? dataHistory[dataHistory.length - 1]
        : dataFrames[frameSelected]

      mapData = mapData.sort((a, b) => (a.path > b.path) ? 1 : -1)

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

      const breadcrumbMapNameList = await MongoQueries.nameLookup(users, userId, 'breadcrumbMapIdList')
      const tabMapNameList = await MongoQueries.nameLookup(users, userId, 'tabMapIdList')

      return {
        error: '',
        data: {
          mapId, mapSource, mapDataList: [mapData], frameLen, frameSelected, mapRight,
          breadcrumbMapIdList, tabMapIdList, breadcrumbMapNameList, tabMapNameList
        }
      }
    }

    case 'SELECT_MAP_FROM_TAB': { // MUTATION --> SELECT_MAP_FROM_TAB --> SELECT_MAP
      const mapId = ObjectId(REQ.payload.mapId)
      await MongoMutations.replaceBreadcrumbs(users, userId, mapId)
      const userInfo = await getUserInfo(userId)
      const mapInfo = await getMapInfo(userId, mapId, 'dataHistory')
      return { error: '', data: { ...userInfo, ...mapInfo } }
    }
    case 'SELECT_MAP_FROM_BREADCRUMBS': { // MUTATION --> SELECT_MAP_FROM_BREADCRUMBS --> SELECT_MAP
      const mapId = ObjectId(REQ.payload.mapId)
      await MongoMutations.sliceBreadcrumbs(users, userId, mapId)
      const userInfo = await getUserInfo(userId)
      const mapInfo = await getMapInfo(userId, mapId, 'dataHistory')
      return { error: '', data: { ...userInfo, ...mapInfo } }
    }
    case 'SELECT_MAP_FROM_MAP': { // MUTATION --> SELECT_MAP_FROM_MAP --> SELECT_MAP
      // const mapId = ObjectId(REQ.payload.mapId)
      await MongoMutations.appendBreadcrumbs(users, userId, ObjectId(REQ.payload.mapId))
      // const userInfo = await getUserInfo(userId)
      // const mapInfo = await getMapInfo(userId, mapId, 'dataHistory')
      return { error: '', /*data: { ...userInfo, ...mapInfo }*/ }
    }
    case 'CREATE_MAP_IN_MAP': { // MUTATION
      // // LOAD OLD
      const mapId = ObjectId(REQ.payload.save.mapId)
      const map = await maps.findOne({_id: mapId})
      const { path } = map
      // // CREATE NEW
      const { content, nodeId } = REQ.payload
      const newMapId = (await maps.insertOne(getDefaultMap(content, userId, [ ...path, mapId ] ))).insertedId
      await MongoMutations.appendBreadcrumbs(users, userId, newMapId)
      // // UPDATE OLD
      await mergeMap(maps, mapId, 'node', { nodeId, linkType: 'internal', link: newMapId.toString() } )
      // // RETURN NEW
      const userInfo = await getUserInfo(userId)
      const newMapInfo = await getMapInfo(userId, newMapId, 'dataHistory')
      return { error: '', data: { ...userInfo, ...newMapInfo } }
    }
    case 'CREATE_MAP_IN_TAB': { // MUTATION
      const mapId = (await maps.insertOne(getDefaultMap('New Map', userId, []))).insertedId
      await MongoMutations.appendTabsReplaceBreadcrumbs(users, userId, mapId)
      const userInfo = await getUserInfo(userId)
      const mapInfo = await getMapInfo(userId, mapId, 'dataHistory')
      return { error: '', data: { ...userInfo, ...mapInfo } }
    }
    case 'REMOVE_MAP_IN_TAB': { // MUTATION
      const mapId = ObjectId(REQ.payload.mapId)
      const map = await maps.findOne({_id: mapId})
      const { ownerUser } = map
      const iAmTheOwner = isEqual(ownerUser, userId)
      const userFilter = iAmTheOwner ? { tabMapIdList: mapId } : { _id: userId, tabMapIdList: mapId }
      const shareFilter = iAmTheOwner ? { sharedMap: mapId } : { shareUser: userId, sharedMap: mapId }
      await MongoMutations.deleteMapFromUsers(users, userFilter)
      await MongoMutations.deleteMapFromShares(shares, shareFilter)
      const userInfo = await getUserInfo(userId)
      const newMapInfo = await getMapInfo(userId, userInfo.breadcrumbMapIdList[0], 'dataHistory') // [0] = at(-1) because this is 1 long, so an OPEN_MAP re-fetch will work
      return { error: '', data: { ...userInfo, ...newMapInfo} }
    }
    case 'MOVE_UP_MAP_IN_TAB': { // MUTATION
      const mapId = ObjectId(REQ.payload.mapId)
      await MongoMutations.moveUpMapInTab(users, userId, mapId)
      const userInfo = await getUserInfo(userId)
      return { error: '', data: { ...userInfo } }
    }
    case 'MOVE_DOWN_MAP_IN_TAB': { // MUTATION
      const mapId = ObjectId(REQ.payload.mapId)
      await MongoMutations.moveDownMapInTab(users, userId, mapId)
      const userInfo = await getUserInfo(userId)
      return { error: '', data: { ...userInfo } }
    }
    case 'OPEN_FRAME': { // QUERY
      const mapId = ObjectId(REQ.payload.save.mapId)
      const mapInfo = await getMapInfo(userId, mapId, 'dataFrames')
      return { error: '', data: { ...mapInfo, frameEditorVisible: true } }
    }
    case 'CLOSE_FRAME': { // ---------------------> this is VERY bad, this should be an OPEN_MAP query, and frameEditorVisible should be closed-loop set ON FE
      const userInfo = await getUserInfo(userId)
      const mapInfo = await getMapInfo(userId, userInfo.breadcrumbMapIdList.at(-1), 'dataHistory')
      return { error: '', data: { ...mapInfo, frameEditorVisible: false } }
    }
    case 'OPEN_PREV_FRAME': { // MUTATION
      const mapId = ObjectId(REQ.payload.save.mapId)
      await MongoMutations.openPrevFrame(maps, mapId)
      const mapInfo = await getMapInfo(userId, mapId, 'dataFrames')
      return { error: '', data: { ...mapInfo } }
    }
    case 'OPEN_NEXT_FRAME': { // MUTATION
      const mapId = ObjectId(REQ.payload.save.mapId)
      await MongoMutations.openNextFrame(maps, mapId)
      const mapInfo = await getMapInfo(userId, mapId, 'dataFrames')
      return { error: '', data: { ...mapInfo } }
    }
    case 'IMPORT_FRAME': { // MUTATION
      const mapId = ObjectId(REQ.payload.save.mapId)
      await MongoMutations.importFrame(maps, mapId)
      const mapInfo = await getMapInfo(userId, mapId, 'dataFrames')
      return { error: '', data: { ...mapInfo } }
    }
    case 'DUPLICATE_FRAME': { // MUTATION
      const mapId = ObjectId(REQ.payload.save.mapId)
      await MongoMutations.duplicateFrame(maps, mapId)
      const mapInfo = await getMapInfo(userId, mapId, 'dataFrames')
      return { error: '', data: { ...mapInfo } }
    }
    case 'DELETE_FRAME': { // MUTATION
      const mapId = ObjectId(REQ.payload.mapId)
      await MongoMutations.deleteFrame(maps, mapId)
      const mapInfo = await getMapInfo(userId, mapId, 'dataFrames')
      return { error: '', data: { ...mapInfo } }
    }
    case 'GET_SHARES': { // QUERY
      const shareInfo = await getShareInfo(userId)
      return { error: '', data: { ...shareInfo } }
    }
    case 'CREATE_SHARE': { // MUTATION
      const mapId = ObjectId(REQ.payload.mapId)
      const { shareEmail, shareAccess } = REQ.payload
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
      const shareId = ObjectId(REQ.payload.shareId)
      const share = (await shares.findOneAndUpdate(
        { _id: shareId },
        { $set: { status: SHARE_STATUS.ACCEPTED }},
        { returnDocument: 'after' }
      )).value
      const mapId = share.sharedMap
      await MongoMutations.appendTabsReplaceBreadcrumbs(users, userId, mapId)
      const userInfo = await getUserInfo(userId)
      const mapInfo = await getMapInfo(userId, mapId, 'dataHistory')
      const shareInfo = await getShareInfo(userId)
      return { error: '', data: { ...userInfo, ...mapInfo, ...shareInfo } }
    }
    case 'DELETE_SHARE': { // MUTATION
      const shareId = ObjectId(REQ.payload.shareId)
      const { shareUser, sharedMap } = await shares.findOne({ _id: shareId })
      const userFilter = { _id: shareUser, tabMapIdList: sharedMap }
      const shareFilter = { shareUser, sharedMap }
      await MongoMutations.deleteMapFromUsers(users, userFilter)
      await MongoMutations.deleteMapFromShares(shares, shareFilter)
      const shareInfo = await getShareInfo(userId)
      return { error: '', data: { ...shareInfo } }
    }
    case 'TOGGLE_COLOR_MODE': { // MUTATION
      const { colorMode } = REQ.payload
      const newColorMode = colorMode === 'light' ? 'dark' : 'light'
      await users.updateOne({ _id: userId }, { $set: { colorMode: newColorMode } })
      return { error: '', data:  { colorMode: newColorMode } }
    }
    case 'CHANGE_TAB_WIDTH': { // MUTATION
      // TODO
      return { error: '' }
    }
    case 'DELETE_ACCOUNT': {
      await users.deleteOne({_id: userId})
      return { error: ''}
    }
  }
}

async function processReq(req, REQ) {
  try {
    if (REQ.type === 'LIVE_DEMO') {
      // this could depend on queryString
      const mapId = ObjectId('5f3fd7ba7a84a4205428c96a')
      const mapDataFrames = (await maps.findOne({_id: mapId})).dataFrames
      const mapRight = MAP_RIGHTS.VIEW
      return { error: '', data: { mapId, mapDataFrames, mapRight } }
    } else {

      const cred = JSON.parse(req.header('authorization'))

      const currUser = await users.findOne( cred )
      if (currUser === null) {
        if (REQ.type === 'SIGN_UP_STEP_1') {
          const { name, email, password } = REQ.payload.cred
          let confirmationCode = (name === 'Cypress Test')
            ? 1234
            : getConfirmationCode()
          await transporter.sendMail({
            from: "info@mapboard.io",
            to: email,
            subject: "MapBoard Email Confirmation",
            text: "",
            html: `
                    <p>Hello ${name}!</p>
                    <p>Welcome to MapBoard!<br>You can complete your registration using the following code:</p>
                    <p>${confirmationCode}</p>
                    <p>You can also join the conversation, propose features and get product news here:<br>
                    <a href="MapBoard Slack">https://join.slack.com/t/mapboardinc/shared_invite/zt-18h31ogqv-~MoUZJ_06XCV7st8tfKIBg</a></p>
                    <p>Cheers,<br>Krisztian from MapBoard</p>
                    `
          })
          await users.insertOne({
            name,
            email,
            password,
            activationStatus: ACTIVATION_STATUS.AWAITING_CONFIRMATION,
            confirmationCode
          })
          return { error: '' }
        } else if (REQ.type === 'SIGN_UP_STEP_2') {
          return { error: 'signUpStep2FailWrongEmailOrConfirmationCode' }
        }
      } else {
        if (REQ.type === 'SIGN_UP_STEP_1') {
          if (currUser.activationStatus === ACTIVATION_STATUS.AWAITING_CONFIRMATION) {
            return { error: 'signUpStep1FailAlreadyAwaitingConfirmation' }
          } else if (currUser.activationStatus === ACTIVATION_STATUS.COMPLETED) {
            return { error: 'signUpStep1FailAlreadyConfirmed' }
          }
        } else if (REQ.type === 'SIGN_UP_STEP_2') {
          if (currUser.activationStatus === ACTIVATION_STATUS.COMPLETED) {
            return { error: 'signUpStep2FailAlreadyActivated' }
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
            return { error: '' }
          }
        } else if (currUser.activationStatus === ACTIVATION_STATUS.AWAITING_CONFIRMATION) {
          return { error: 'authFailIncompleteRegistration' }
        } else {
          await checkSave(REQ, currUser?._id)
          return await resolveType(req, REQ)
        }
      }
    }
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

    // console.log(req.headers)


    let REQ = JSON.parse(inputStream) // it must be a parameter to prevent async issues
    inputStream = []
    processReq(req, REQ).then(resp => {
      res.json({resp})
      console.log('response sent')
    })
  })
})

MongoClient.connect(baseUri, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
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
