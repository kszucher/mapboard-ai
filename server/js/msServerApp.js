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
const { ACTIVATION_STATUS, ACCESS_TYPES, SHARE_STATUS } = require('./Types')

const transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'info@mapboard.io',
    pass: 'r9yVsEzEf7y8KA*'
  }
})

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

async function getAuthorizedUserId(req, REQ) {
  // const cred = JSON.parse(req.header('authorization'))

  const cred = REQ.cred

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

async function resolveType(req, cred, type, payload, userId) {
  switch (type) {
    case 'signIn': {
      // TODO: create session entry
      return { error: '', data: { cred } }
    }
    case 'openWorkspace': {
      return { error: '', data: (await MongoQueries.openWorkspace(users, userId)).at(0) }
    }
    case 'selectMap': {
      const mapId = ObjectId(payload.mapId)
      await MongoMutations.selectMap(users, userId, mapId)
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
    case 'createMapInMap': {
      const mapId = ObjectId(payload.mapId)
      const { nodeId, content } = payload
      const map = await maps.findOne({_id: mapId})
      const { path } = map
      const newMapId = (await maps.insertOne(getDefaultMap(content, userId, [ ...path, mapId ]))).insertedId
      await MongoMutations.saveMap(maps, mapId, 'node', { nodeId, linkType: 'internal', link: newMapId.toString() })
      await MongoMutations.selectMap(users, userId, newMapId)
      return
    }
    case 'createMapInTab': {
      const newMapId = (await maps.insertOne(getDefaultMap('New Map', userId, []))).insertedId
      await MongoMutations.createMapInTab(users, userId, newMapId)
      await MongoMutations.selectMap(users, userId, newMapId)
      return
    }
    case 'createMapFrameImport': {
      await MongoMutations.createMapFrameImport(maps, userId)
      await MongoMutations.selectNextMapFrame(users, userId)
      return
    }
    case 'createMapFrameDuplicate': {
      await MongoMutations.createMapFrameDuplicate(maps, userId)
      await MongoMutations.selectNextMapFrame(users, userId)
      return
    }
    case 'moveUpMapInTab': {
      await MongoMutations.moveUpMapInTab(users, userId)
      return
    }
    case 'moveDownMapInTab': {
      await MongoMutations.moveDownMapInTab(users, userId)
      return
    }
    case 'deleteMap': {
      const mapId = ObjectId(payload.mapId)
      await MongoMutations.deleteMap(users, shares, userId, mapId)
      return
    }
    case 'deleteMapFrame': {
      await MongoMutations.deleteMapFrame(maps, userId)
      await MongoMutations.selectPrevMapFrame(users, userId)
      return
    }
    case 'saveMap': {
      // await new Promise(resolve => setTimeout(resolve, 5000))
      const mapId = ObjectId(payload.mapId)
      const { mapData, dataFrameSelected } = payload
      const map = await maps.findOne({_id: mapId})
      const { ownerUser } = map
      const shareToEdit = await shares.findOne({ shareUser: userId, sharedMap: mapId, access: 'edit' })
      if (isEqual(userId, ownerUser) || shareToEdit !== null) {
        if (dataFrameSelected === -1) {
          await MongoMutations.saveMap(maps, mapId, 'map', mapData)
        } else {
          await MongoMutations.saveMapFrame(maps, mapId, dataFrameSelected, mapData)
        }
      }
      return
    }
    case 'getShares': {
      const shareInfo = await getShareInfo(userId)
      return
    }
    case 'createShare': {
      const mapId = ObjectId(payload.mapId)
      const { shareEmail, shareAccess } = payload
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
      const shareId = ObjectId(payload.shareId)
      const share = (await shares.findOneAndUpdate(
        { _id: shareId },
        { $set: { status: SHARE_STATUS.ACCEPTED }},
        { returnDocument: 'after' }
      )).value
      const mapId = share.sharedMap
      await MongoMutations.createMapInTab(users, userId, mapId)
      return { error: '' }
    }
    case 'toggleColorMode': {
      const { colorMode } = payload
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
      const access = ACCESS_TYPES.VIEW
      return { error: '', data: { mapId, mapDataFrames, access } }
    } else {

      // const cred = JSON.parse(req.header('authorization'))

      const cred = REQ.cred

      const currUser = await users.findOne( cred )
      if (currUser === null) {
        if (REQ.type === 'SIGN_UP_STEP_1') {
          const { name, email, password } = payload.cred
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

          const userId = await getAuthorizedUserId(req, REQ)
          if (!userId) { return { error: 'UNAUTH'} }

          return await resolveType(req, REQ.cred, REQ.type, REQ.payload, userId)
        }
      }
    }
  } catch (err) {
    console.log('server error')
    console.log(err.stack)
    return { error: 'error', data: err.stack }
  }
}


// const cors=require("cors");
const corsOptions ={
  origin:'*',
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

app.use(cors())


// TODO try postman to soo if this is alive


app.get('/geta', (req, res) => {
  res.send('Hello World!')
})

// app.use(cors())
app.post('/beta', function (req, res) {
  let inputStream = []
  req.on('data', function (data) {
    inputStream += data
  })





  req.on('end', function () {

    // console.log(req.headers)

    // if (req.method === "OPTIONS") {
    //   res.writeHead(200, {"Content-Type": "application/json"});
    //   res.end();
    // }



    let REQ = JSON.parse(inputStream) // it must be a parameter to prevent async issues
    inputStream = []
    console.log(REQ.type)
    processReq(req, REQ).then(resp => {
      res.json({resp})
      console.log(REQ.type, 'response sent')
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
