const { baseUri } = require('./MongoSecret')
const MongoQueries = require('./MongoQueries')
const MongoMutations = require('./MongoMutations')
const { countNodes, countNodesBasedOnNodePropExistence, countNodesBasedOnNodePropValue } = require('./MongoQueries')
const { setNodePropValueIfMissing, setNodePropValueBasedOnPreviousValue, removeNodeProp } = require('./MongoMutations')
const MongoClient = require('mongodb').MongoClient

async function mongoStagingCommands (users, maps, shares) {
  console.log(await countNodes(maps))
  console.log(await countNodesBasedOnNodePropExistence(maps, 'svgId'))
  console.log(await countNodesBasedOnNodePropExistence(maps, 'divId'))
  console.log(await countNodesBasedOnNodePropExistence(maps, 'nodeId'))

  // const countWithPathValue = await countNodesBasedOnNodePropValue(maps, 'path', ['g'])
  // console.log(countWithPathValue)


  // await removeNodeProp(maps, 'divId')
  // await removeNodeProp(maps, 'svgId')

  // await setNodePropValueBasedOnPreviousValue(maps, 'path', ['m'], ['g'])
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
