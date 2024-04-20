const { baseUri } = require('./MongoSecret')
const MongoMutations = require('./MongoMutations')
const MongoClient = require('mongodb').MongoClient

async function mongoExecutorCommands (users, maps, shares, sessions) {
  await MongoMutations.deleteUnusedMaps(users, maps)
  await users.updateMany({}, [
    {
      $set: {
        sessions: [],
      }
    }
  ])
  await maps.updateMany({}, [
    {
      $set: {
        versions: [ {$last: '$versions'} ],
        versionsInfo: [ {$last: '$versionsInfo'} ],
        frames: [],
        framesInfo: [],
      }
    }
  ])
}

async function mongoExecutor() {
  const client = new MongoClient(baseUri, { useNewUrlParser: true, useUnifiedTopology: true })
  try {
    await client.connect()
    const db = client.db("app_prod")
    const users = db.collection("users")
    const maps = db.collection("maps")
    const shares = db.collection("shares")
    const sessions = db.collection("sessions")
    await mongoExecutorCommands(users, maps, shares, sessions)
  }
  catch (err) {
    console.log('error')
    console.log(err.stack)
  }
  await client.close()
}

mongoExecutor().then(r => {})
