const spawn = require('await-spawn')

const main = async () => {
    try {
        const bl = await spawn('ls', ['-al'])
        console.log(bl.toString())
    } catch (e) {
        console.log(e.stderr.toString())
    }
}

const mongoProcess = async (cmd, db, path) => {
    console.log(`process ${cmd} started`);

    try {
        const bl = await spawn(cmd, [
            `--uri=mongodb+srv://mindboard-server:3%21q.FkpzkJPTM-Q@cluster0-sg0ny.mongodb.net/${db}`,
            `--archive=${path}`,
            '--gzip',
        ])
        // console.log(bl.toString())
    } catch (e) {
        console.log(e.stderr.toString())
    }
    console.log(`process ${cmd} fininshed`);


    // const child = await spawn(cmd, [
    //     `--uri=mongodb+srv://mindboard-server:3%21q.FkpzkJPTM-Q@cluster0-sg0ny.mongodb.net/${db}`,
    //     `--archive=${path}`,
    //     '--gzip',
    // ]);
    //
    // child.stdout.on('data', (data) => {
    //     console.log('stdout:n', data);
    // });
    // child.stderr.on('data', (data) => {
    //     console.log('stderr:n', Buffer.from(data).toString());
    // });
    // child.on('error', (error) => {
    //     console.log('error:n', error);
    // });
    // child.on('exit', (code, signal) => {
    //     if (code) {
    //         console.log('Process exit with code:', code);
    //     } else if (signal) {
    //         console.log('Process killed with signal:', signal);
    //     } else
    //         console.log(`process ${cmd} completed`);
    // });
}

async function mongoTransfer(mode) {
    let basePath = 'C:/Users/Kryss/Dropbox/mindboard/mongobackup';
    switch (mode) {
        case 'prod2dev': {
            await mongoProcess('mongodump', 'app_prod', basePath + '/app_prod');
            await mongoProcess('mongorestore', 'app_dev', basePath + '/app_prod');
            break;
        }
        case 'dev2prod': {
            await mongoProcess('mongodump', 'app_dev', basePath + '/app_dev');
            await mongoProcess('mongorestore', 'app_prod', basePath + '/app_dev');
        }
    }
}

mongoTransfer('prod2dev');
