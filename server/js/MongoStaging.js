const { baseUri } = require('./MongoSecret')
const MongoQueries = require('./MongoQueries')
const MongoMutations = require('./MongoMutations')
const { deleteUnusedMaps } = require('./MongoMutations')
const MongoClient = require('mongodb').MongoClient

async function mongoStagingCommands (users, maps, shares) {



  // adding path where missing
  // await maps.aggregate(
  //   [
  //     {
  //       $match: {
  //         $expr: {
  //           $eq: [{ $type: '$path' }, 'missing']
  //         }
  //       },
  //     },
  //     {
  //       $set: {
  //         path: ['$_id']
  //       }
  //     },
  //     { $merge: 'maps' }
  //   ]
  // ).toArray()

  // filling path where empty
  // await maps.aggregate(
  //   [
  //     {
  //       $match: {
  //         $expr: {
  //           $eq: [{ $size: '$path' }, 0]
  //         }
  //       },
  //     },
  //     {
  //       $set: {
  //         path: ['$_id']
  //       }
  //     },
  //     { $merge: 'maps' }
  //   ]
  // ).toArray()


  await deleteUnusedMaps(users, maps)

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
