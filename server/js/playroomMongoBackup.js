const spawn = require('await-spawn')

const mongoTransfer = async (mode) => {
    switch (mode) {
        case 'prod2dev': {
            await mongoProcess('mongodump', {source: 'app_prod'});
            await mongoProcess('mongorestore', {source:'app_prod', target:'app_dev'});
            break;
        }
        case 'dev2prod': {
            await mongoProcess('mongodump', {source: 'app_dev'});
            await mongoProcess('mongorestore', {source:'app_dev', target:'app_prod'});
        }
    }
}

const mongoProcess = async (mongoCmd, endPoints) => {
    let baseUri = 'mongodb+srv://mindboard-server:3%21q.FkpzkJPTM-Q@cluster0-sg0ny.mongodb.net'
    let basePath = 'C:/Users/Kryss/Dropbox/mindboard/mongobackup';
    const mongoParams = [
        `--uri=${baseUri}/${mongoCmd === 'mongodump' ? endPoints.source : endPoints.target}`,
        `--archive=${basePath}/${endPoints.source}`,
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

const spawnProcess = async (mongoCmd, mongoParams) => {
    console.log(`process ${mongoCmd} started`);
    try {
        const bl = await spawn(mongoCmd, mongoParams)
        // console.log(bl.toString())
    } catch (e) {
        console.log(e.stderr.toString())
    }
    console.log(`process ${mongoCmd} fininshed`);
}

mongoTransfer('prod2dev');
