import { MongoClient } from 'mongodb'
import { baseUri } from './MongoSecret'
import MongoQueries from './MongoQueries'
import MongoMutations from './MongoMutations'

let client, users, maps, shares

export const getMultiMapMultiSource = (mapArray) => {
  const multiSource = { frames: mapArray, versions: mapArray }
  return { maps: [ { _id: 'map1', ...multiSource }, { _id: 'map2', ...multiSource } ] }
}

export const getElemById = (list, id) => (list.find(el => el._id === id))

export const mongoConnect = async () => {
  client = new MongoClient(baseUri, { useNewUrlParser: true, useUnifiedTopology: true, })
  await client.connect()
  const db = client.db("app_dev_mongo")
  users = db.collection("users")
  maps = db.collection("maps")
  shares = db.collection("shares")
  return db
}

export const mongoDisconnect = async () => {
  await client.close()
}

const mongoClear = async () => {
  await users.deleteMany({})
  await maps.deleteMany({})
  await shares.deleteMany({})
}

const mongoSet = async (database) => {
  if (database.hasOwnProperty('users')) await users.insertMany(database.users)
  if (database.hasOwnProperty('maps')) await maps.insertMany(database.maps)
  if (database.hasOwnProperty('shares')) await shares.insertMany(database.shares)
}

const mongoGet = async (database) => {
  let result = {}
  if (database.hasOwnProperty('users')) { result.users = await users.find().toArray() }
  if (database.hasOwnProperty('maps')) { result.maps = await maps.find().toArray() }
  if (database.hasOwnProperty('shares')) { result.shares = await shares.find().toArray() }
  return result
}

export const resolveQuery = async (database, queryName, queryParams) => {
  await mongoClear(users, maps, shares)
  await mongoSet(database, users, maps, shares)
  return await MongoQueries[queryName](...queryParams)
}

export const resolveMutation = async (database, mutationName, mutationParams) => {
  await mongoClear(users, maps, shares)
  await mongoSet(database, users, maps, shares)
  await MongoMutations[mutationName](...mutationParams)
  return await mongoGet(database)
}
