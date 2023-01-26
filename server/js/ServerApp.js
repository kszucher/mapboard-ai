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
  return( JSON.stringify(obj1)===JSON.stringify(obj2))
}

let users, maps, shares, db

const genNodeIdJs = () => {
  const alphanumeric = '0123456789abcdefghijklmnopqrstuvwxyz'
  const randomAlphanumeric = () => ( alphanumeric[ Math.round( Math.random() * ( alphanumeric.length -  1 )) ] )
  const randomAlphanumeric8digit = new Array(8).fill('').map(el => randomAlphanumeric())
  return( 'node' + randomAlphanumeric8digit.join(''))
}

const getDefaultMap = (mapName, ownerUser, path) => ({
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
})

// const emailText = `
//   <p>Hello ${name}!</p>
//   <p>Welcome to MapBoard!<br>You can complete your registration using the following code:</p>
//   <p>${confirmationCode}</p>
//   <p>You can also join the conversation, propose features and get product news here:<br>
//   <a href="MapBoard Slack">https://join.slack.com/t/mapboardinc/shared_invite/zt-18h31ogqv-~MoUZJ_06XCV7st8tfKIBg</a></p>
//   <p>Cheers,<br>Krisztian from MapBoard</p>
// `

app.use(cors())
app.use(express.json())
app.get('/test', (req, res) => { res.send('MapBoard Server is running!') })
app.post('/beta', async (req, res) => {
  try {
    // PUBLIC
    switch (req.body.type) {
      case 'liveDemo': {
        const mapId = ObjectId('5f3fd7ba7a84a4205428c96a') // this could depend on queryString
        const mapDataFrames = (await maps.findOne({ _id: mapId })).dataFrames
        const access = ACCESS_TYPES.VIEW
        return res.json({ error: '', data: { mapId, mapDataFrames, access } })
      }
    }
    // PROTECTED
    // TODO on new user created
    // let newMap = getDefaultMap('My First Map', currUser._id, [])
    // let mapId = (await maps.insertOne(newMap)).insertedId
    // await users.updateOne(
    //   { _id: currUser._id },
    //   {
    //     $set: {
    //       activationStatus: ACTIVATION_STATUS.COMPLETED,
    //       tabMapIdList: [...systemMaps, mapId],
    //       breadcrumbMapIdList: [mapId]
    //     }
    //   }
    // )
    let userId
    if (req.body.hasOwnProperty('cred')) {
      userId = (await users.findOne({ email: req.body.cred.email, password: req.body.cred.password }))._id
      if (!userId) {
        return res.json({ error: 'unauthorized or non-existing' })
      }
    }
    switch (req.body.type) {
      case 'signIn': {
        return res.json({ error: '', data: { cred: req.body.cred } }) // TODO create session
      }
      case 'signOut': {
        return res.json({ error: '' } ) // TODO delete session
      }
      case 'openWorkspace': {
        return res.json({ error: '', data: (await MongoQueries.openWorkspace(users, userId)).at(0) })
      }
      case 'selectMap': {
        const mapId = ObjectId(req.body.payload.mapId)
        await MongoMutations.selectMap(users, userId, mapId)
        return res.json({})
      }
      case 'selectFirstMapFrame': {
        await MongoMutations.selectFirstMapFrame(users, userId)
        return res.json({})
      }
      case 'selectPrevMapFrame': {
        await MongoMutations.selectPrevMapFrame(users, userId)
        return res.json({})
      }
      case 'selectNextMapFrame': {
        await MongoMutations.selectNextMapFrame(users, userId)
        return res.json({})
      }
      case 'createMapInMap': {
        const mapId = ObjectId(req.body.payload.mapId)
        const { nodeId, content } = req.body.payload
        const map = await maps.findOne({ _id: mapId })
        const { path } = map
        const newMapId = (await maps.insertOne(getDefaultMap(content, userId, [...path, mapId]))).insertedId
        await MongoMutations.saveMap(maps, mapId, 'node', { nodeId, linkType: 'internal', link: newMapId.toString() })
        await MongoMutations.selectMap(users, userId, newMapId)
        return res.json({})
      }
      case 'createMapInTab': {
        const newMapId = (await maps.insertOne(getDefaultMap('New Map', userId, []))).insertedId
        await MongoMutations.createMapInTab(users, userId, newMapId)
        await MongoMutations.selectMap(users, userId, newMapId)
        return res.json({})
      }
      case 'createMapFrameImport': {
        await MongoMutations.createMapFrameImport(maps, userId)
        await MongoMutations.selectNextMapFrame(users, userId)
        return res.json({})
      }
      case 'createMapFrameDuplicate': {
        await MongoMutations.createMapFrameDuplicate(maps, userId)
        await MongoMutations.selectNextMapFrame(users, userId)
        return res.json({})
      }
      case 'moveUpMapInTab': {
        await MongoMutations.moveUpMapInTab(users, userId)
        return res.json({})
      }
      case 'moveDownMapInTab': {
        await MongoMutations.moveDownMapInTab(users, userId)
        return res.json({})
      }
      case 'deleteMap': {
        const mapId = ObjectId(req.body.payload.mapId)
        await MongoMutations.deleteMap(users, shares, userId, mapId)
        return res.json({})
      }
      case 'deleteMapFrame': {
        await MongoMutations.deleteMapFrame(maps, userId)
        await MongoMutations.selectPrevMapFrame(users, userId)
        return res.json({})
      }
      case 'saveMap': {
        // await new Promise(resolve => setTimeout(resolve, 5000))
        const mapId = ObjectId(req.body.payload.mapId)
        const { mapData, dataFrameSelected } = req.body.payload
        const map = await maps.findOne({ _id: mapId })
        const { ownerUser } = map
        const shareToEdit = await shares.findOne({ shareUser: userId, sharedMap: mapId, access: 'edit' })
        if (isEqual(userId, ownerUser) || shareToEdit !== null) {
          if (dataFrameSelected === -1) {
            await MongoMutations.saveMap(maps, mapId, 'map', mapData)
          } else {
            await MongoMutations.saveMapFrame(maps, mapId, dataFrameSelected, mapData)
          }
        }
        return res.json({})
      }
      case 'getShares': {
        const shareInfo = await MongoQueries.getUserShares(shares, userId)
        return res.json(shareInfo)
      }
      case 'createShare': {
        const mapId = ObjectId(req.body.payload.mapId)
        const { shareEmail, shareAccess } = req.body.payload
        const shareUser = await users.findOne({ email: shareEmail })
        if (shareUser === null) {
          return res.json({ error: 'createShareFailNotAValidUser' })
        } else if (isEqual(shareUser._id, userId)) {
          return res.json({ error: 'createShareFailCantShareWithYourself' })
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
            return res.json({})
          } else {
            if (currShare.access === shareAccess) {
              return res.json({ error: 'createShareFailAlreadyShared' })
            } else {
              await shares.updateOne({ _id: currShare._id }, { $set: { access: shareAccess } })
              return res.json({})
            }
          }
        }
      }
      case 'acceptShare': {
        const shareId = ObjectId(req.body.payload.shareId)
        const share = (await shares.findOneAndUpdate(
          { _id: shareId },
          { $set: { status: SHARE_STATUS.ACCEPTED } },
          { returnDocument: 'after' }
        )).value
        const mapId = share.sharedMap
        await MongoMutations.createMapInTab(users, userId, mapId)
        return res.json({ error: '' })
      }
      case 'toggleColorMode': {
        const { colorMode } = req.body.payload
        const newColorMode = colorMode === 'light' ? 'dark' : 'light'
        await users.updateOne({ _id: userId }, { $set: { colorMode: newColorMode } })
        return res.json({ error: '', data: { colorMode: newColorMode } })
      }
      case 'changeTabWidth': {
        // TODO
        return res.json({})
      }
      case 'deleteAccount': {
        await users.deleteOne({ _id: userId })
        return res.json({ error: '' })
      }
    }
  } catch (err) {
    console.log('server error')
    console.log(err.stack)
    return { error: err.stack }
  }
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
