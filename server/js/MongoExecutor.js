const { baseUri } = require('./MongoSecret')
const MongoMutations = require('./MongoMutations')
const MongoClient = require('mongodb').MongoClient

async function mongoExecutorCommands (users, maps, shares, sessions) {
  await MongoMutations.deleteUnusedMaps(users, maps)
  await users.updateMany({}, [
    {
      $set: {
        lastSelectedMap: ''
      }
    }
  ])
  await maps.updateMany({}, [
    {
      $set: {
        versions: [ {$last: '$versions'} ],
        versionsInfo: [
          {
            modifierType: 'user',
            userId: {$getField: {field: 'userId', input: {$last: '$versionsInfo'}}},
            jwtId: '',
            versionId: 0,
          }
        ]
      }
    }
  ])
}

async function mongoExecutor() {
  const client = new MongoClient(baseUri, { useNewUrlParser: true, useUnifiedTopology: true })
  try {
    await client.connect()
    const db = client.db("app_dev") // DEV FIRST!!!
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
