let express = require('express');
let cors = require('cors');
var multer = require('multer');
var path = require('path');
let app = express();
var { promisify } = require('util');
var sizeOf = promisify( require('image-size'));
var MongoHeartbeat = require('mongo-heartbeat');


// improvement for later times
// https://flaviocopes.com/node-request-data/
// https://stackoverflow.com/questions/39677993/send-blob-data-to-node-using-fetch-multer-express

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
});

var upload = multer({ storage: storage });
var type = upload.single('upl');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = "mongodb+srv://mindboard-server:3%21q.FkpzkJPTM-Q@cluster0-sg0ny.mongodb.net/test?retryWrites=true&w=majority";

app.post('/feta', type, async function (req, res) {
    let dimensions = await sizeOf('../uploads/' + req.file.filename);
    let sf2c = {
            cmd: 'imageSaveSuccess',
            imageId: req.file.filename,
            imageSize: dimensions
    };
    res.json(sf2c)
});

app.use('/file', express.static(path.join(__dirname, '../uploads')));
app.use(cors());
app.post('/beta', function (req, res) {
    let inputStream =       [];
    req.on('data', function (data) {
        inputStream += data;
    });
    req.on('end', function () {
        let c2s = JSON.parse(inputStream); // it must be a parameter to prevent async issues
        inputStream = [];
        sendResponse(c2s).then(s2c => {
            res.json(s2c);
            console.log('response sent');
        })
    })
});

let collectionUsers;
let collectionMaps;
var db;
var hb;

MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS:3600000,
    keepAlive:3600000,
    socketTimeoutMS:3600000

    // https://mongoosejs.com/docs/connections.html
    // https://stackoverflow.com/questions/24880412/nodejs-mongodb-driver-drops-connection-when-idle

}, function(err, client) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('connected');
        db = client.db("app");
        collectionUsers = db.collection('users');
        collectionMaps =db.collection('maps');
        app.listen(8082, function () {console.log('CORS-enabled web server listening on port 8082')});

        hb = MongoHeartbeat(db, {
            interval: 5000, //defaults to 5000 ms,
            timeout: 10000,  //defaults to 10000 ms
            tolerance: 2    //defaults to 1 attempt
        });

        hb.on('error', function (err) {
            console.error('mongodb didnt respond the heartbeat message');
            process.nextTick(function () {
                process.exit(1);
            });
        });

    }
});



async function sendResponse(c2s) {
    let s2c = {
        'ERROR': 'error',
    };

    if (await auth(c2s)) {
        switch (c2s.cmd) {
            case 'signInRequest': {
                let m2s = await mongoFunction(c2s, 'getUserMaps');
                s2c = {
                    cmd: 'signInSuccess',
                    headerData: m2s,
                };
                break;
            }
            case 'openMapRequest': {
                let m2s = await mongoFunction(c2s, 'openMap');
                s2c = {
                    cmd: 'openMapSuccess',
                    mapName: c2s.mapName,
                    mapStorage: m2s,
                };
                break;
            }
            case 'createMapInMapRequest': {
                let m2s = await mongoFunction(c2s, 'createMap');
                s2c = {
                    cmd: 'createMapInMapSuccess',
                    newMapId: m2s.insertedId
                };
                break;
            }
            case 'createMapInTabRequest': {
                let m2s1 = await mongoFunction(c2s, 'createMap');
                Object.assign(c2s, {insertedId: m2s1.insertedId});
                await mongoFunction(c2s, 'addUserMap');
                let m2s2 = await mongoFunction(c2s, 'getUserMaps');
                s2c = {
                    cmd: 'createMapInTabSuccess',
                    headerData: m2s2,
                };
                break;
            }
            case 'saveMapRequest': {
                await mongoFunction(c2s, 'saveMap');
                s2c = {
                    cmd: 'saveMapRequestSuccess',
                };
                break;
            }
        }
    } else {
        s2c = {
            cmd: 'signInFail',
        };
    }
    return s2c;
}

async function auth(c2s) {
    let m2s = await mongoFunction(c2s, 'auth');
    return m2s.authenticationSuccess;
}

async function mongoFunction(c2s, operation) {
    let m2s = {};
    try {
        console.log('connected to server...');
        switch (operation) {
            case 'auth': {
                let currUser = await collectionUsers.findOne({email: c2s.cred.email, password: c2s.cred.password});
                m2s.authenticationSuccess = currUser !== null;
                break;
            }
            case 'getUserMaps': {
                let currUser = await collectionUsers.findOne({email: c2s.cred.email, password: c2s.cred.password});
                let headerMapIdList = currUser.headerMapIdList;
                let headerMapNameList = [];
                await collectionMaps.aggregate([
                    {$match:        {_id:           {$in:           headerMapIdList}}             },
                    {$addFields:    {"__order":     {$indexOfArray: [headerMapIdList, "$_id" ]}}  },
                    {$sort:         {"__order":     1}                                            },
                ]).forEach(function (m) {
                    headerMapNameList.push(m.data[0].content)
                });

                m2s = {
                    headerMapIdList: headerMapIdList,
                    headerMapNameList: headerMapNameList,
                    headerMapSelected: currUser.headerMapSelected
                };

                break;
            }
            case 'openMap': {
                m2s = await collectionMaps.findOne({_id: ObjectId(c2s.mapName)});
                break;
            }
            case 'createMap': {
                let result = await collectionMaps.insertOne(c2s.newMap);
                m2s = {
                    insertedId: result.insertedId
                };
                break;
            }
            case 'addUserMap': {
                let currUser = await collectionUsers.findOne({email: c2s.cred.email, password: c2s.cred.password});
                await collectionUsers.updateOne(
                    {_id: ObjectId(currUser._id)},
                    {$push: {"headerMapIdList" : c2s.insertedId}}
                );
                break;
            }
            case 'saveMap': {
                await collectionMaps.replaceOne({_id: ObjectId(c2s.mapName)}, c2s.mapStorage);
                break;
            }
        }
    }
    catch (err) {
        console.log('mongo error');
        console.log(err.stack);
    }
    return m2s;
}

module.exports = app;
