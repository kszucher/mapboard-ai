const { baseUri } = require('./MongoSecret')
const MongoQueries = require('./MongoQueries')
const MongoMutations = require('./MongoMutations')
const { genNodeId, mergeMap } = require('./MongoMutations')
const { ObjectId } = require('mongodb')
const MongoClient = require('mongodb').MongoClient

async function mongoStagingCommands (users, maps, shares) {
  console.log(await MongoQueries.countNodes(maps))
  console.log(await MongoQueries.countNodesBasedOnNodePropExistence(maps, 'svgId'))
  console.log(await MongoQueries.countNodesBasedOnNodePropExistence(maps, 'divId'))
  console.log(await MongoQueries.countNodesBasedOnNodePropExistence(maps, 'nodeId'))

  console.log(JSON.stringify(await MongoQueries.findDeadLinks(maps), null, 4))


  // const countWithPathValue = await countNodesBasedOnNodePropValue(maps, 'path', ['g'])
  // console.log(countWithPathValue)


  // await MongoMutations.removeNodeProp(maps, 'nodeId')
  // await MongoMutations.createNodeProp(maps, 'nodeId', genNodeId())

  // await MongoMutations.setNodePropValueBasedOnPreviousValue(maps, 'path', ['m'], ['g'])

  // await maps.updateMany({}, [{
  //   $set: {
  //     'dataHistoryModifiers': [
  //       {
  //         modifierType: 'server',
  //         userId: '$ownerUser',
  //         sessionId: 0,
  //       }
  //     ]
  //   }
  // }])

  await mergeMap(maps, ObjectId('5f3fd7ba7a84a4205428c96a'), 'node', {nodeId: 'cica', newNode: 'newNodeValue'})

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
