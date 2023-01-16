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
  if (cred !== null) {
    // TODO: joi validation
    const authorizedUser = await users.findOne( cred )
    if (authorizedUser !== null) {
      return authorizedUser._id
    }
  }
  return null
}

// async function getShareInfo (userId) {
//   return await MongoQueries.getUserShares(shares, userId)
// }

async function resolveType(req, REQ, userId) {
  switch (REQ.type) {
    case 'signIn': {
      // TODO: create session entry
      const cred = JSON.parse(req.header('authorization'))
      return { error: '', data: { cred } }
    }
    case 'openUser': {
      const userId = await getAuthorizedUserId(req)
      const user = await users.findOne({_id: userId})
      const { name, colorMode } = user
      return { name, colorMode  }
    }
    case 'openMap': {
      const user = await users.findOne({_id: userId})
      const { tabMapIdList, mapSelected, dataFrameSelected } = user
      const map = await maps.findOne({_id: mapSelected})
      const { path, ownerUser, dataHistory, dataFrames } = map
      const breadcrumbMapIdList = path
      const mapSource = dataFrameSelected === -1 ? 'dataHistory' : 'dataFrames'
      const mapDataList = dataFrameSelected === -1
        ? [dataHistory[dataHistory.length - 1].sort((a, b) => (a.path > b.path) ? 1 : -1)]
        : [dataFrames[dataFrameSelected].sort((a, b) => (a.path > b.path) ? 1 : -1)]
      const frameLen = dataFrames.length

      let mapRight = MAP_RIGHTS.UNAUTHORIZED
      if (systemMaps.map(x => JSON.stringify(x)).includes((JSON.stringify(mapSelected)))) {
        mapRight = isEqual(userId, adminUser)
          ? MAP_RIGHTS.EDIT
          : MAP_RIGHTS.VIEW
      } else {
        if (isEqual(userId, ownerUser)) {
          mapRight = MAP_RIGHTS.EDIT
        } else {
          const fullPath = [...path, mapSelected]
          for (let i = fullPath.length - 1; i > -1; i--) {
            const currMapId = fullPath[i]
            const shareData = await shares.findOne({ shareUser: userId, sharedMap: currMapId })
            if (shareData !== null) {
              mapRight = shareData.access
            }
          }
        }
      }
      const breadcrumbMapNameList = await MongoQueries.nameLookup(users, userId, 'breadcrumbMapIdList')
      const tabMapNameList = await MongoQueries.nameLookup(users, userId, 'tabMapIdList')
      return {
        data: {
          mapId: mapSelected, mapSource, mapDataList, frameLen, dataFrameSelected, mapRight,
          breadcrumbMapIdList, tabMapIdList, breadcrumbMapNameList, tabMapNameList
        }
      }
    }
    case 'selectMap': {
      const mapId = ObjectId(REQ.payload.mapId)
      await MongoMutations.selectMap(users, userId, mapId)
      return
    }
    case 'saveMap': {
      // await new Promise(resolve => setTimeout(resolve, 5000))
      const user = await users.findOne({_id: userId})
      const { dataFrameSelected } = user
      const mapId = ObjectId(REQ.payload.mapId)
      const { mapData } = REQ.payload
      const map = await maps.findOne({_id: mapId})
      const { ownerUser } = map
      const shareToEdit = await shares.findOne({ shareUser: userId, sharedMap: mapId, access: 'edit' })
      if (isEqual(userId, ownerUser) || shareToEdit !== null) {
        if (dataFrameSelected === -1) {
          await MongoMutations.mergeMap(maps, mapId, 'map', mapData)
        } else {
          await maps.updateOne({ _id: mapId }, { $set: { [`dataFrames.${dataFrameSelected}`]: mapData } })
        }
      }
      return
    }
    case 'createMapInMap': {
      const mapId = ObjectId(REQ.payload.mapId)
      const { content, nodeId } = REQ.payload
      const map = await maps.findOne({_id: mapId})
      const { path } = map
      const newMapId = (await maps.insertOne(getDefaultMap(content, userId, [ ...path, mapId ]))).insertedId
      await MongoMutations.selectMap(users, userId, newMapId)
      await MongoMutations.mergeMap(maps, mapId, 'node', { nodeId, linkType: 'internal', link: newMapId.toString() })
      return
    }
    case 'createMapInTab': {
      const mapId = (await maps.insertOne(getDefaultMap('New Map', userId, []))).insertedId
      await MongoMutations.createMapInTab(users, userId, mapId)
      return
    }
    case 'removeMapInTab': {
      const mapId = ObjectId(REQ.payload.mapId)
      const map = await maps.findOne({_id: mapId})
      const { ownerUser } = map
      const iAmTheOwner = isEqual(ownerUser, userId)
      const userFilter = iAmTheOwner ? { tabMapIdList: mapId } : { _id: userId, tabMapIdList: mapId }
      const shareFilter = iAmTheOwner ? { sharedMap: mapId } : { shareUser: userId, sharedMap: mapId }
      await MongoMutations.deleteMapFromUsers(users, userFilter)
      await MongoMutations.deleteMapFromShares(shares, shareFilter)
      return
    }
    case 'moveUpMapInTab': {
      await MongoMutations.moveUpMapInTab(users, userId, mapId)
      return
    }
    case 'moveDownMapInTab': {
      await MongoMutations.moveDownMapInTab(users, userId, mapId)
      return
    }
    case 'selectFirstMapFrame': {
      await MongoMutations.selectFirstMapFrame(users, userId)
      return
    }
    case 'selectPrevMapFrame': {
      await MongoMutations.selectPrevMapFrame(users, userId)
      return
    }
    case 'selectNextMapFrame': {
      await MongoMutations.selectNextMapFrame(users, userId)
      return
    }
    case 'importMapFrame': {
      await MongoMutations.importFrame(maps)
      await MongoMutations.selectNextMapFrame(users, userId)
      return
    }
    case 'duplicateMapFrame': {
      await MongoMutations.duplicateFrame(maps)
      await MongoMutations.selectNextMapFrame(users, userId)
      return
    }
    case 'deleteMapFrame': {
      await MongoMutations.deleteFrame(maps)
      await MongoMutations.selectPrevMapFrame(users, userId)
      return
    }
    case 'getShares': {
      const shareInfo = await getShareInfo(userId)
      return
    }
    case 'createShare': {
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
          return
        } else {
          if (currShare.access === shareAccess) {
            return { error: 'createShareFailAlreadyShared' }
          } else {
            await shares.updateOne({ _id: currShare._id }, { $set: { access: shareAccess } })
            return
          }
        }
      }
    }
    case 'acceptShare': {
      const shareId = ObjectId(REQ.payload.shareId)
      const share = (await shares.findOneAndUpdate(
        { _id: shareId },
        { $set: { status: SHARE_STATUS.ACCEPTED }},
        { returnDocument: 'after' }
      )).value
      const mapId = share.sharedMap
      await MongoMutations.createMapInTab(users, userId, mapId)
      const userInfo = await getUserInfo(userId)
      const mapInfo = await getMapInfo(userId, mapId, 'dataHistory')
      const shareInfo = await getShareInfo(userId)
      return { error: '', data: { ...userInfo, ...mapInfo, ...shareInfo } }
    }
    case 'deleteShare': {
      const shareId = ObjectId(REQ.payload.shareId)
      const { shareUser, sharedMap } = await shares.findOne({ _id: shareId })
      const userFilter = { _id: shareUser, tabMapIdList: sharedMap }
      const shareFilter = { shareUser, sharedMap }
      await MongoMutations.deleteMapFromUsers(users, userFilter)
      await MongoMutations.deleteMapFromShares(shares, shareFilter)
      const shareInfo = await getShareInfo(userId)
      return { error: '', data: { ...shareInfo } }
    }
    case 'toggleColorMode': {
      const { colorMode } = REQ.payload
      const newColorMode = colorMode === 'light' ? 'dark' : 'light'
      await users.updateOne({ _id: userId }, { $set: { colorMode: newColorMode } })
      return { error: '', data:  { colorMode: newColorMode } }
    }
    case 'changeTabWidth': {
      // TODO
      return
    }
    case 'deleteAccount': {
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
          return
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

          }
        } else if (currUser.activationStatus === ACTIVATION_STATUS.AWAITING_CONFIRMATION) { // BUT WHAT IS THE TYPE???
          return { error: 'authFailIncompleteRegistration' }
        } else {
          // await checkSave(REQ, currUser?._id)

          const userId = await getAuthorizedUserId(req)
          if (!userId) { return { error: 'UNAUTH'} }

          return await resolveType(req, REQ, userId)
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
      console.log(REQ.type, 'response sent', resp)
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
