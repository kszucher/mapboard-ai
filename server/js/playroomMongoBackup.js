const { spawn } = require('child_process');
// var cron = require('node-cron');

// cron.schedule('* * * * *', () => {
    backupMongoDbData();
// });

async function backupMongoDbData() {
    const child = await spawn('mongodump', [
        '--uri=mongodb+srv://mindboard-server:3%21q.FkpzkJPTM-Q@cluster0-sg0ny.mongodb.net/app_prod',
        `--archive=C:/Users/Kryss/Dropbox/mindboard/mongobackup`,
        // '--db=app_prod',
        '--gzip',
    ]);


    child.stdout.on('data', (data) => {
        console.log('stdout:n', data);
    });
    child.stderr.on('data', (data) => {
        console.log('stderr:n', Buffer.from(data).toString());
    });
    child.on('error', (error) => {
        console.log('error:n', error);
    });
    child.on('exit', (code, signal) => {
        if (code) console.log('Process exit with code:', code);
        else if (signal) console.log('Process killed with signal:', signal);
        else console.log('Backup is successfull ');
    });
}
