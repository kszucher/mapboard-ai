const { baseUri } = require('./MongoSecret')
const MongoQueries = require('./MongoQueries')
const MongoMutations = require('./MongoMutations')
const { genNodeId, saveMap } = require('./MongoMutations')
const { ObjectId } = require('mongodb')
const { countNodesBasedOnNodePropValue } = require('./MongoQueries')
const MongoClient = require('mongodb').MongoClient

async function mongoExecutorCommands (users, maps, shares) {
  // console.log(await MongoQueries.countNodes(maps))
  // console.log(await MongoQueries.countNodesBasedOnNodePropExistence(maps, 'svgId'))
  // console.log(await MongoQueries.countNodesBasedOnNodePropExistence(maps, 'divId'))
  // console.log(await MongoQueries.countNodesBasedOnNodePropExistence(maps, 'nodeId'))
  // console.log(JSON.stringify(await MongoQueries.findDeadLinks(maps), null, 4))

  // console.log(await countNodesBasedOnNodePropValue(maps, 'taskStatus', 0))
  // await MongoMutations.removeNodeProp(maps, 'nodeId')
  // await MongoMutations.createNodeProp(maps, 'nodeId', genNodeId())
  // await MongoMutations.updateNodePropValueBasedOnPreviousValue(maps, 'taskStatus', -1, 0)

  // await maps.updateMany({}, [
  //   {
  //     $set: {
  //       versions: [ {$last: '$versions'} ],
  //       versionsInfo: [ {$last: '$versionsInfo'} ],
  //     }
  //   }
  // ])


}

async function mongoExecutor() {
  const client = new MongoClient(baseUri, { useNewUrlParser: true, useUnifiedTopology: true })
  try {
    await client.connect()
    const db = client.db("app_prod")
    const users = db.collection("users")
    const maps = db.collection("maps")
    const shares = db.collection("shares")
    await mongoExecutorCommands(users, maps, shares)
  }
  catch (err) {
    console.log('error')
    console.log(err.stack)
  }
  await client.close()
}

mongoExecutor().then(r => {})
