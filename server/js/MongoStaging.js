const { baseUri } = require('./MongoSecret')
const MongoQueries = require('./MongoQueries')
const MongoMutations = require('./MongoMutations')
const MongoClient = require('mongodb').MongoClient

async function mongoStagingCommands (users, maps, shares) {

}

async function mongoStaging() {
  const client = new MongoClient(baseUri, { useNewUrlParser: true, useUnifiedTopology: true })
  try {
    await client.connect()
    const db = client.db("app_dev")
    const users = db.collection("users")
    const maps = db.collection("maps")
    const shares = db.collection("shares")
    await mongoStagingCommands(users, maps, shares)
  }
  catch (err) {
    console.log('error')
    console.log(err.stack)
  }
  await client.close()
}

mongoStaging().then(r => {})
