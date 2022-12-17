const spawn = require('await-spawn')

const spawnProcess = async (mongoCmd, mongoParams) => {
  console.log(`process ${mongoCmd} started`);
  try {
    const bl = await spawn(mongoCmd, mongoParams)
    // console.log(bl.toString())
  } catch (e) {
    console.log(e.stderr.toString())
  }
  console.log(`process ${mongoCmd} finished`);
}

const mongoProcess = async (mongoCmd, endPoints, date) => {
  let baseUri = `mongodb+srv://admin:${encodeURIComponent('TNszfBws4@JQ8!t')}@cluster0.wbdxy.mongodb.net`
  let basePath = 'C:/Users/Kryss/Dropbox/mapboard/mongobackup';
  const mongoParams = [
    `--uri=${baseUri}/${mongoCmd === 'mongodump' ? endPoints.source : endPoints.target}`,
    `--archive=${basePath}/${endPoints.source}_${date}`,
    '--gzip'
  ]
  if (mongoCmd === 'mongorestore') {
    mongoParams.push(`--nsFrom=${endPoints.source}.*`);
    mongoParams.push(`--nsTo=${endPoints.target}.*`);
    mongoParams.push(`--drop`);
  }
  console.log(mongoParams)
  await spawnProcess(mongoCmd, mongoParams);
}

const mongoBackup = async (mode) => {
  var date = + new Date();
  switch (mode) {
    case 'prod2file2dev': {
      await mongoProcess('mongodump', {source: 'app_prod'}, date);
      await mongoProcess('mongorestore', {source:'app_prod', target:'app_dev'}, date);
      break;
    }
    case 'prod2file': {
      await mongoProcess('mongodump', {source: 'app_prod'}, date);
      break;
    }
    case 'dev2file2prod': {
      await mongoProcess('mongodump', {source: 'app_dev'}, date);
      await mongoProcess('mongorestore', {source:'app_dev', target:'app_prod'}, date);
      break;
    }
    case 'dev2file': {
      await mongoProcess('mongodump', {source: 'app_dev'}, date);
      break;
    }
    case 'file2dev': {
      date = ''
      await mongoProcess('mongorestore', {source:'app_dev', target:'app_dev'}, date);
      break;
    }
    case 'file2prod': {
      date = '' // 13 digit id
      await mongoProcess('mongorestore', {source:'app_prod', target:'app_prod'}, date);
      break;
    }
  }
}

mongoBackup('prod2file2dev');
