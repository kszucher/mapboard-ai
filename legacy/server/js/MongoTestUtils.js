import { MongoClient } from 'mongodb'
import { baseUri } from './MongoSecret'
import MongoQueries from './MongoQueries'
import MongoMutations from './MongoMutations'

let client, users, maps, shares, sessions

export const mongoConnect = async () => {
  client = new MongoClient(baseUri, { useNewUrlParser: true, useUnifiedTopology: true, })
  await client.connect()
  const db = client.db("app_dev_mongo")
  users = db.collection("users")
  maps = db.collection("maps")
  shares = db.collection("shares")
  sessions = db.collection("sessions")
  return db
}

export const mongoDisconnect = async () => {
  await client.close()
}

const mongoClear = async () => {
  await users.deleteMany({})
  await maps.deleteMany({})
  await shares.deleteMany({})
  await sessions.deleteMany({})
}

const mongoSet = async (database) => {
  if (database.hasOwnProperty('users')) await users.insertMany(database.users)
  if (database.hasOwnProperty('maps')) await maps.insertMany(database.maps)
  if (database.hasOwnProperty('shares')) await shares.insertMany(database.shares)
  if (database.hasOwnProperty('sessions')) await sessions.insertMany(database.sessions)
}

const mongoGet = async (database) => {
  let result = {}
  if (database.hasOwnProperty('users')) { result.users = await users.find().toArray() }
  if (database.hasOwnProperty('maps')) { result.maps = await maps.find().toArray() }
  if (database.hasOwnProperty('shares')) { result.shares = await shares.find().toArray() }
  if (database.hasOwnProperty('sessions')) { result.sessions = await sessions.find().toArray() }
  return result
}

export const resolveQuery = async (database, queryName, queryParams) => {
  await mongoClear(users, maps, shares, sessions)
  await mongoSet(database, users, maps, shares, sessions)
  return await MongoQueries[queryName](...queryParams)
}

export const resolveMutation = async (database, mutationName, mutationParams) => {
  await mongoClear(users, maps, shares, sessions)
  await mongoSet(database, users, maps, shares, sessions)
  await MongoMutations[mutationName](...mutationParams)
  return await mongoGet(database)
}
