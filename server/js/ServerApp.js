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
const { ACCESS_TYPES, SHARE_STATUS } = require('./Types')
const { authAudienceUrl } = require('./Url')
const { Configuration, OpenAIApi } = require("openai")

const checkJwt = auth({
  audience: authAudienceUrl,
  issuerBaseURL: `https://mapboard.eu.auth0.com/`,
})

const capitalize = (str) => `${str[0].toUpperCase()}${str.slice(1)}`

const isEqual = (obj1, obj2) => {
  return( JSON.stringify(obj1)===JSON.stringify(obj2))
}

let users, maps, shares, db

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
    sessionId: '',
    versionId: 1,
  }],
  frames: [],
  framesInfo: [],
})

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
        const frames = (await maps.findOne({ _id: mapId })).frames
        const access = ACCESS_TYPES.VIEW
        return res.json({ mapId, frames, access })
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
            url: 'https://mapboard.eu.auth0.com/userinfo',
            headers: {authorization: req.header('authorization')}
          })
          const newMap = getDefaultMap('My First Map', userId, [])
          const newMapId = (await maps.insertOne(newMap)).insertedId
          await users.updateOne(
            { _id: userId },
            {
              $set: {
                email: userInfo.data.email,
                name: capitalize(userInfo.data.nickname),
                colorMode: 'dark',
                tabMapIdList: [newMapId],
                sessions: []
              }
            }
          )
        }
        await MongoMutations.updateWorkspace(users, userId, sessionId)
        return res.json({})
      }
      case 'signOutEverywhere': {
        await MongoMutations.resetSessions(users, userId)
        return res.json({})
      }
      case 'openWorkspace': {
        return res.json((await MongoQueries.openWorkspace(users, userId, sessionId)).at(0))
      }
      case 'selectMap': {
        const mapId = ObjectId(req.body.payload.mapId)
        const frameId = req.body.payload.frameId
        await MongoMutations.selectMap(users, userId, sessionId, mapId, frameId)
        return res.json({})
      }
      case 'renameMap': {
        const mapId = ObjectId(req.body.payload.mapId)
        const name = req.body.payload.name
        await maps.findOneAndUpdate({ _id: mapId }, [{ $set: { name } }])
        return res.json({})
      }
      case 'createMapInMap': {
        const mapId = ObjectId(req.body.payload.mapId)
        const { nodeId, content } = req.body.payload
        const map = await maps.findOne({ _id: mapId })
        const { path } = map
        const newMap = getDefaultMap(content, userId, [...path, mapId])
        const newMapId = (await maps.insertOne(newMap)).insertedId
        await MongoMutations.selectMap(users, userId, sessionId, newMapId, '')
        await MongoMutations.saveMap(maps, mapId, sessionId, 'node', { nodeId, linkType: 'internal', link: newMapId.toString() })
        return res.json({})
      }
      case 'createMapInTab': {
        const newMap = getDefaultMap('New Map', userId, [])
        const newMapId = (await maps.insertOne(newMap)).insertedId
        await MongoMutations.selectMap(users, userId, sessionId, newMapId, '')
        await MongoMutations.appendMapInTab(users, userId, newMapId)
        return res.json({})
      }
      case 'createMapInTabDuplicate': {
        const mapId = ObjectId(req.body.payload.mapId)
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
        await MongoMutations.selectMap(users, userId, sessionId, newMapId, '')
        await MongoMutations.appendMapInTab(users, userId, newMapId)
        return res.json({})
      }
      case 'createMapFrameImport': {
        const mapId = ObjectId(req.body.payload.mapId)
        const frameId = req.body.payload.frameId
        const newFrameId = genHash()
        await MongoMutations.createMapFrameImport(maps, mapId, frameId, newFrameId)
        await MongoMutations.selectMap(users, userId, sessionId, mapId, newFrameId)
        return res.json({})
      }
      case 'createMapFrameDuplicate': {
        const mapId = ObjectId(req.body.payload.mapId)
        const frameId = req.body.payload.frameId
        const newFrameId = genHash()
        await MongoMutations.createMapFrameDuplicate(maps, mapId, frameId, newFrameId)
        await MongoMutations.selectMap(users, userId, sessionId, mapId, newFrameId)
        return res.json({})
      }
      case 'moveUpMapInTab': {
        // TODO check of inclusion
        const mapId = ObjectId(req.body.payload.mapId)
        await MongoMutations.moveUpMapInTab(users, userId, mapId)
        return res.json({})
      }
      case 'moveDownMapInTab': {
        // TODO check of inclusion
        const mapId = ObjectId(req.body.payload.mapId)
        await MongoMutations.moveDownMapInTab(users, userId, mapId)
        return res.json({})
      }
      case 'deleteMap': {
        // TODO prevent deleting the last map in tab
        const mapId = ObjectId(req.body.payload.mapId)
        await MongoMutations.deleteMap(users, shares, userId, sessionId, mapId)
        return res.json({})
      }
      case 'deleteMapFrame': {
        const mapId = ObjectId(req.body.payload.mapId)
        const frameId = req.body.payload.frameId
        await MongoMutations.deleteMapFrame(users, maps, userId, sessionId, mapId, frameId)
        return res.json({})
      }
      case 'saveMap': {
        const mapId = ObjectId(req.body.payload.mapId)
        const { frameId, mapData } = req.body.payload
        const map = await maps.findOne({ _id: mapId })
        const { ownerUser } = map
        const shareToEdit = await shares.findOne({ shareUser: userId, sharedMap: mapId, access: 'edit' })
        if (isEqual(userId, ownerUser) || shareToEdit !== null) {
          if (frameId === '') {
            await MongoMutations.saveMap(maps, mapId, sessionId, 'map', mapData)
          } else {
            await MongoMutations.saveMapFrame(maps, mapId, frameId, mapData)
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
        await MongoMutations.appendMapInTab(users, userId, mapId)
        return res.json({})
      }
      case 'toggleColorMode': {
        await MongoMutations.toggleColorMode(users, userId)
        return res.json({})
      }
      case 'changeTabWidth': {
        // TODO implement
        return res.json({})
      }
      case 'deleteAccount': {
        await users.deleteOne({ _id: userId })
        return res.json({})
      }
      case 'getGptSuggestions': {
        const gptApiKey = user.gptApiKey || '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'
        if (gptApiKey) {
          const {promptId, promptJson, prompt, maxToken, timestamp} = req.body.payload
          const configuration = new Configuration({ apiKey: gptApiKey })
          const openai = new OpenAIApi(configuration)
          const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo-16k-0613",
            // model: "gpt-4-0613",
            messages: [{"role": "user", "content": prompt}],
            // max_tokens: maxToken,
            // functions=[],
            // function_call="auto",
            temperature: 0
          });
          const gptSuggestions = response.data.choices[0].message.content
          console.log(gptSuggestions)
          return res.json({gptSuggestions, ...req.body.payload})
        } else {
          return res.json({})
        }
      }
      // case 'getGptSuggestions': {
      //   const gptApiKey = user.gptApiKey || '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'
      //   if (gptApiKey) {
      //     const {promptId, promptJson, prompt, maxToken, timestamp} = req.body.payload
      //     const configuration = new Configuration({ apiKey: gptApiKey })
      //     const openai = new OpenAIApi(configuration)
      //     const completion = await openai.createCompletion({
      //       model: "text-davinci-003",
      //       prompt,
      //       max_tokens: maxToken,
      //       // temperature: 0
      //     });
      //     console.log(completion.data.choices[0].text)
      //     const gptSuggestions = completion.data.choices[0].text
      //     console.log(gptSuggestions)
      //     return res.json({gptSuggestions, ...req.body.payload})
      //   } else {
      //     return res.json({})
      //   }
      // }
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
