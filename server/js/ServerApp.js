"use strict"
const express = require('express')
const app = express()
const cors = require('cors')
const { auth } = require('express-oauth2-jwt-bearer')
const axios = require("axios").default
const {MongoClient} = require('mongodb')
const {ObjectId} = require('mongodb')
const MongoQueries = require("./MongoQueries")
const MongoMutations = require("./MongoMutations")
const { baseUri } = require('./MongoSecret')
const { SHARE_STATUS } = require('./Types')
const { authAudienceUrl } = require('./Url')

const checkJwt = auth({
  audience: authAudienceUrl,
  issuerBaseURL: `https://mapboard.eu.auth0.com/`,
})

const capitalize = (str) => `${str[0].toUpperCase()}${str.slice(1)}`

const isEqual = (obj1, obj2) => {
  return( JSON.stringify(obj1)===JSON.stringify(obj2))
}

let users, maps, shares, sessions, db

const genHash = () => {
  const alphanumeric = '0123456789abcdefghijklmnopqrstuvwxyz'
  const randomAlphanumeric = () => ( alphanumeric[ Math.round( Math.random() * ( alphanumeric.length -  1 )) ] )
  const randomAlphanumeric8digit = new Array(8).fill('').map(el => randomAlphanumeric())
  return randomAlphanumeric8digit.join('')
}

const getDefaultMap = (mapName, ownerUser, path) => ({
  name: mapName,
  ownerUser,
  path,
  versions: [
    [
      { nodeId: 'node' + genHash(), path: ['g'], version: 1 },
      { nodeId: 'node' + genHash(), path: ['r', 0] },
      { nodeId: 'node' + genHash(), path: ['r', 0, 's', 0], content: mapName, selected: 1 }
    ]
  ],
  versionsInfo: [{
    modifierType: 'user',
    userId: ownerUser,
    jwtId: '',
    versionId: 0,
  }]
})

app.use(cors())

app.use(express.json())

app.get('/test', (req, res) => {
  res.send('MapBoard Server is running!')
})

app.post('/sign-in', checkJwt, async (req, res) => {
  const jwtId = req.auth.token.slice(-8)
  const user = await users.findOne({ sub: req.auth.payload.sub })
  const userId = user._id
  if (user.signInCount === 0) {
    const userInfo = await axios.request({
      method: 'GET',
      url: 'https://mapboard.eu.auth0.com/userinfo',
      headers: {authorization: req.header('authorization')}
    })
    const newMap = await maps.insertOne(getDefaultMap('My First Map', userId, []))
    await users.findOneAndUpdate(
      { _id: userId },
      [ {
        $set: {
          email: userInfo.data.email,
          name: capitalize(userInfo.data.nickname),
          colorMode: 'dark',
          tabMapIdList: [newMap._id],
          signInCount: 1,
          lastSelectedMap: newMap._id
        }
      } ]
    )
    await sessions.insertOne( {jwtId, userId, mapId: newMap._id })
  } else {
    await users.findOneAndUpdate({ _id: userId }, [ { $set: { signInCount: { $add: [ '$signInCount', 1 ] } } } ])
    await sessions.insertOne({ jwtId, userId, mapId: user.lastSelectedMap })
  }
  return res.json({})
})

app.post('/sign-out-everywhere', checkJwt, async (req, res) => {
  const user = await users.findOne({ sub: req.auth.payload.sub })
  const userId = user._id
  await MongoMutations.resetSessions(sessions, userId)
  return res.json({})
})

app.post('/open-workspace', checkJwt, async (req, res) => {
  const jwtId = req.auth.token.slice(-8)
  return res.json(await MongoQueries.openWorkspace(sessions, jwtId))
})

app.post('/toggle-color-mode', checkJwt, async (req, res) => {
  const user = await users.findOne({ sub: req.auth.payload.sub })
  const userId = user._id
  await MongoMutations.toggleColorMode(users, userId)
  return res.json({})
})

app.post('/select-map', checkJwt, async (req, res) => {
  const jwtId = req.auth.token.slice(-8)
  const user = await users.findOne({ sub: req.auth.payload.sub })
  const userId = user._id
  const mapId = ObjectId(req.body.mapId)
  await MongoMutations.selectMap(users, userId, sessions, jwtId, mapId)
  return res.json({})
})

app.post('/rename-map', checkJwt, async (req, res) => {
  const mapId = ObjectId(req.body.mapId)
  const name = req.body.name
  await maps.findOneAndUpdate({ _id: mapId }, [ { $set: { name } } ])
  return res.json({})
})

app.post('/create-map-in-map', checkJwt, async (req, res) => {
  const jwtId = req.auth.token.slice(-8)
  const user = await users.findOne({ sub: req.auth.payload.sub })
  const userId = user._id
  const mapId = ObjectId(req.body.mapId)
  const { nodeId, content } = req.body
  const map = await maps.findOne({ _id: mapId })
  const { path } = map
  const newMap = getDefaultMap(content, userId, [...path, mapId])
  const newMapId = (await maps.insertOne(newMap)).insertedId
  await MongoMutations.selectMap(users, userId, sessions, jwtId, newMapId, '')
  await MongoMutations.saveMap(maps, mapId, jwtId, 'node', { nodeId, linkType: 'internal', link: newMapId.toString() })
  return res.json({})
})

app.post('/create-map-in-tab', checkJwt, async (req, res) => {
  const jwtId = req.auth.token.slice(-8)
  const user = await users.findOne({ sub: req.auth.payload.sub })
  const userId = user._id
  const newMap = getDefaultMap('New Map', userId, [])
  const newMapId = (await maps.insertOne(newMap)).insertedId
  await MongoMutations.selectMap(users, userId, sessions, jwtId, newMapId, '')
  await MongoMutations.appendMapInTab(users, userId, newMapId)
  return res.json({})
})

app.post('/create-map-in-tab-duplicate', checkJwt, async (req, res) => {
  const jwtId = req.auth.token.slice(-8)
  const user = await users.findOne({ sub: req.auth.payload.sub })
  const userId = user._id
  const mapId = ObjectId(req.body.mapId)
  const map = await maps.findOne({ _id: mapId })
  const newMap = getDefaultMap(`${map.name} - copy`, userId, [])
  const nodeIdMapping = map.versions.at(-1).map(ni => ({
    oldNodeId: ni.nodeId,
    newNodeId: 'node' + genHash()
  }))
  newMap.versions = [map.versions.at(-1)]
  newMap.versions.at(-1).forEach((ni, i) => {
    if (ni.path.at(0) === 'l') {
      Object.assign(ni, {
        fromNodeId : nodeIdMapping.find(el => el.oldNodeId === ni.fromNodeId)?.newNodeId || ni.fromNodeSide,
        toNodeId: nodeIdMapping.find(el => el.oldNodeId === ni.toNodeId)?.newNodeId || ni.nodeId
      })
    } else if (ni.path.at(0) === 'r') {
      Object.assign(ni, {
        nodeId: nodeIdMapping.at(i).newNodeId,
      })
    }
  })
  const newMapId = (await maps.insertOne(newMap)).insertedId
  await MongoMutations.selectMap(users, userId, sessions, jwtId, newMapId, '')
  await MongoMutations.appendMapInTab(users, userId, newMapId)
  return res.json({})
})

app.post('/move-up-map-in-tab', checkJwt, async (req, res) => {
  const user = await users.findOne({ sub: req.auth.payload.sub })
  const userId = user._id
  const mapId = ObjectId(req.body.mapId)
  await MongoMutations.moveUpMapInTab(users, userId, mapId)
  return res.json({})
})

app.post('/move-down-map-in-tab', checkJwt, async (req, res) => {
  const user = await users.findOne({ sub: req.auth.payload.sub })
  const userId = user._id
  const mapId = ObjectId(req.body.mapId)
  await MongoMutations.moveDownMapInTab(users, userId, mapId)
  return res.json({})
})

app.post('/delete-map', checkJwt, async (req, res) => {
  const user = await users.findOne({ sub: req.auth.payload.sub })
  const userId = user._id
  // TODO prevent deleting the last map in tab
  const mapId = ObjectId(req.body.mapId)
  await MongoMutations.deleteMap(users, shares, sessions, userId, mapId)
  return res.json({})
})

app.post('/save-map', checkJwt, async (req, res) => {
  const jwtId = req.auth.token.slice(-8)
  const user = await users.findOne({ sub: req.auth.payload.sub })
  const userId = user._id
  const mapId = ObjectId(req.body.mapId)
  const { mapData } = req.body
  const map = await maps.findOne({ _id: mapId })
  const { ownerUser } = map
  const shareToEdit = await shares.findOne({ shareUser: userId, sharedMap: mapId, access: 'edit' })
  if (isEqual(userId, ownerUser) || shareToEdit !== null) {
    await MongoMutations.saveMap(maps, mapId, jwtId, 'map', mapData)
  }
  return res.json({})
})

app.post('/get-shares', checkJwt, async (req, res) => {
  const user = await users.findOne({ sub: req.auth.payload.sub })
  const userId = user._id
  return res.json(await MongoQueries.getUserShares(shares, userId))
})

app.post('/create-share', checkJwt, async (req, res) => {
  const user = await users.findOne({ sub: req.auth.payload.sub })
  const userId = user._id
  const mapId = ObjectId(req.body.mapId)
  const { shareEmail, shareAccess } = req.body
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
        await shares.findOneAndUpdate({ _id: currShare._id }, [ { $set: { access: shareAccess } } ])
      }
    }
  }
  return res.json({})
})

app.post('/accept-share', checkJwt, async (req, res) => {
  const user = await users.findOne({ sub: req.auth.payload.sub })
  const userId = user._id
  const shareId = ObjectId(req.body.shareId)
  const share = (await shares.findOneAndUpdate(
    { _id: shareId },
    { $set: { status: SHARE_STATUS.ACCEPTED } },
    { returnDocument: 'after' }
  )).value
  const mapId = share.sharedMap
  await MongoMutations.appendMapInTab(users, userId, mapId)
  return res.json({})
})

app.post('/delete-share', checkJwt, async (req, res) => {
  const shareId = ObjectId(req.body.shareId)
  await MongoMutations.deleteShare(users, shares, sessions, shareId)
  return res.json({})
})

app.post('/delete-account', checkJwt, async (req, res) => {
  const user = await users.findOne({ sub: req.auth.payload.sub })
  const userId = user._id
  await users.deleteOne({ _id: userId })
  return res.json({})
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
    sessions = db.collection('sessions')
    app.listen(process.env.PORT || 8082, function () {
      console.log('CORS-enabled web server listening on port 8082')
    })
  }
})

module.exports = app
