const spawn = require('await-spawn')
const { baseUri } = require('./MongoSecret')

const basePath = 'C:/Users/Kryss/Dropbox/mapboard/mongobackup'

const decodeSourceFromFilename = (filename) => (filename.slice(26, 35) === 'app_dev' ? 'app_dev' : 'app_prod')

const spawnProcess = async (mongoCmd, mongoParams) => {
  console.log(`process ${mongoCmd} started`)
  try {
    const bl = await spawn(mongoCmd, mongoParams)
    // console.log(bl.toString())
  } catch (e) {
    console.log(e.stderr.toString())
  }
  console.log(`process ${mongoCmd} finished`)
}

const mongoDump = async({source, comment}) => {
  const date = + new Date()
  const mongoParams = [
    `--uri=${baseUri}/${source}`,
    `--archive=${basePath}/date_${date}_source_${source}_comment_${comment}`,
    '--gzip'
  ]
  console.log(mongoParams)
  await spawnProcess('mongodump', mongoParams)
}

const mongoRestore = async({source, target, filename}) => {
  const mongoParams = [
    `--uri=${baseUri}/${target}`,
    `--archive=${basePath}/${filename}`,
    '--gzip'
  ]
  mongoParams.push(`--nsFrom=${source}.*`)
  mongoParams.push(`--nsTo=${target}.*`) // making it independent of its source for easier restoration
  mongoParams.push(`--drop`)
  console.log(mongoParams)
  await spawnProcess('mongorestore', mongoParams)
}

const mongoBackup = async (mode) => {
  switch (mode) {
    case 'prod2file': {
      const comment = ''
      await mongoDump({source: 'app_prod', comment})
      break
    }
    case 'prod2file2dev': {
      const comment = ''
      await mongoDump({source: 'app_prod', comment})
      await mongoRestore({source:'app_prod', target:'app_dev'})
      break
    }
    case 'dev2file': {
      const comment = 'frameSelectedRemovedFromMapsAndDataFrameSelectedAddedToUsers'
      await mongoDump({source: 'app_dev', comment})
      break
    }
    case 'dev2file2prod': {
      const comment = ''
      await mongoDump({source: 'app_dev', comment})
      await mongoRestore({source:'app_dev', target:'app_prod'})
      break
    }
    case 'file2dev': {
      const filename = 'date_1673871021180_source_app_dev_comment_frameSelectedRemovedFromMapsAndDataFrameSelectedAddedToUsers'
      await mongoRestore({source: decodeSourceFromFilename(filename), target:'app_dev', filename })
      break
    }
    case 'file2prod': {
      const filename = ''
      await mongoRestore({source: decodeSourceFromFilename(filename), target:'app_prod', filename})
      break
    }
    case 'file2dev2prod': {
      const filename = ''
      await mongoRestore({source: decodeSourceFromFilename(filename), target:'app_dev', filename})
      await mongoRestore({source: decodeSourceFromFilename(filename), target:'app_prod', filename})
      break
    }
  }
}

mongoBackup('file2dev')
