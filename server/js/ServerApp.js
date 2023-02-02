"use strict"
const express = require('express')
const app = express()
const cors = require('cors')
const { auth } = require('express-oauth2-jwt-bearer')
const axios = require("axios").default
const {MongoClient} = require('mongodb')
const {ObjectId} = require('mongodb')
const nodemailer = require("nodemailer")
const MongoQueries = require("./MongoQueries")
const MongoMutations = require("./MongoMutations")
const { baseUri } = require('./MongoSecret')
const { ACCESS_TYPES, SHARE_STATUS } = require('./Types')

const checkJwt = auth({
  audience: 'http://local.mapboard/', // TODO make process.ENV dependent so it runs on heroku
  issuerBaseURL: `https://dev-gvarh14b.us.auth0.com/`,
})

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

const capitalize = (str) => `${str[0].toUpperCase()}${str.slice(1)}`

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
      { nodeId: genNodeIdJs(), path: ['g'], version: 1 },
      { nodeId: genNodeIdJs(), path: ['r', 0], content: mapName, selected: 1 },
      { nodeId: genNodeIdJs(), path: ['r', 0, 'd', 0] },
      { nodeId: genNodeIdJs(), path: ['r', 0, 'd', 1] },
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
app.get('/test', (req, res) => {
  res.send('MapBoard Server is running!')
})
app.post('/beta-public', checkJwt, async (req, res) => {
  try {
    switch (req.body.type) {
      case 'liveDemo': {
        const mapId = ObjectId('5f3fd7ba7a84a4205428c96a') // this could depend on queryString
        const mapDataFrames = (await maps.findOne({ _id: mapId })).dataFrames
        const access = ACCESS_TYPES.VIEW
        return res.json({ mapId, mapDataFrames, access })
      }
    }
  } catch (err) {
    console.log(err.stack)
    return res.status(400).send({ message: err.stack })
  }
})
app.post('/beta-private', checkJwt, async (req, res) => {
  try {
    const user = await users.findOne({ sub: req.auth.payload.sub })
    const userId = user._id
    const sessionId = req.auth.token.slice(-8)

    switch (req.body.type) {
      case 'signIn': {
        const { signInCount } = user
        if (signInCount === 0) {
          const userInfo = await axios.request({
            method: 'GET',
            url: 'https://dev-gvarh14b.us.auth0.com/userinfo',
            headers: {authorization: req.header('authorization')}
          })
          const newMap = getDefaultMap('My First Map', userId, [])
          const newMapId = (await maps.insertOne(newMap)).insertedId
          await users.updateOne(
            { _id: userId },
            {
              $set: {
                signInCount: 1,
                name: capitalize(userInfo.data.nickname),
                email: userInfo.data.email,
                tabMapIdList: [...systemMaps, newMapId],
                sessions: [
                  {
                    sessionId, mapId: newMapId, versionId: 1, frameId: '',
                  }
                ]
              }
            }
          )
        }
        return res.json({})
      }
      case 'signOut': {
        return // TODO delete session
      }
      case 'openWorkspace': {
        // TODO: if map from session is no longer existing, fall back to mapSelected (which is always set correctly)
        return res.json((await MongoQueries.openWorkspace(users, userId)).at(0))
      }
      case 'selectMap': {
        const mapId = ObjectId(req.body.payload.mapId)
        await MongoMutations.selectMap(users, userId, mapId)
        return res.json({})
      }
      case 'selectMapFrame': {
        // TODO use mapId, frameId
        // TODO delete firstMapFrame (have << and >> instead frameId based on FE)
        // TODO delete prevMapFrame, nextMapFrame (use frameId based on FE)
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
        // TODO use frameId
        await MongoMutations.createMapFrameImport(maps, userId, /*TODO: genNodeId*/) // genNodeId return a string, which is test-compatible
        // TODO query inserted generated frameId as finding the frameId in the frame that comes AFTER the frameId received from FE
        // TODO selectMapFrame based on the acquired frameId
        await MongoMutations.selectNextMapFrame(users, userId)
        return res.json({})
      }
      case 'createMapFrameDuplicate': {
        // TODO similar logic to mapFrameImport
        await MongoMutations.createMapFrameDuplicate(maps, userId)
        await MongoMutations.selectNextMapFrame(users, userId)
        return res.json({})
      }
      case 'moveUpMapInTab': {
        // TODO use mapId, with check of inclusion AND setting mapSelected
        await MongoMutations.moveUpMapInTab(users, userId)
        return res.json({})
      }
      case 'moveDownMapInTab': {
        // TODO use mapId, with check of inclusion AND setting mapSelected
        await MongoMutations.moveDownMapInTab(users, userId)
        return res.json({})
      }
      case 'deleteMap': {
        const mapId = ObjectId(req.body.payload.mapId)
        await MongoMutations.deleteMap(users, shares, userId, mapId)
        return res.json({})
      }
      case 'deleteMapFrame': {
        // TODO use frameId from client
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
            // TODO: instead of dataHistoryModifiers, append this data into the item directly, under g
            await MongoMutations.saveMap(maps, mapId, 'map', mapData)
          } else {
            await MongoMutations.saveMapFrame(maps, mapId, dataFrameSelected, mapData)
          }
        }
        return res.json({})
      }
      case 'getShares': {
        return res.json(await MongoQueries.getUserShares(shares, userId))
      }
      case 'createShare': {
        const mapId = ObjectId(req.body.payload.mapId)
        const { shareEmail, shareAccess } = req.body.payload
        const shareUser = await users.findOne({ email: shareEmail })
        if (shareUser === null) {
          return res.status(400).send({message: 'Create Share Failed: Not A Valid User'})
        } else if (isEqual(shareUser._id, userId)) {
          return res.status(400).send({message: 'Create Share Failed: You Are The Owner'})
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
          } else {
            if (currShare.access === shareAccess) {
              return res.status(400).send({message: 'Create Share Failed: Already Shared'})
            } else {
              await shares.updateOne({ _id: currShare._id }, { $set: { access: shareAccess } })
            }
          }
        }
        return res.json({})
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
        return res.json({})
      }
      case 'toggleColorMode': {
        await MongoMutations.toggleColorMode(users, userId)
        return res.json({})
      }
      case 'changeTabWidth': {
        // TODO
        return res.json({})
      }
      case 'deleteAccount': {
        await users.deleteOne({ _id: userId })
        return res.json({})
      }
    }
  } catch (err) {
    console.log(err.stack)
    return res.status(400).send({ message: err.stack })
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

// ma befejezek MINDEN SZART IS
