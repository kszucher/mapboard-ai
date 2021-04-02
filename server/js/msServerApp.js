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
    if (c2s.cmd === 'pingRequest') {
        s2c = {
            cmd: 'pingSuccess',
        };
    } else {
        if (await auth(c2s)) {
            let m2s;
            switch (c2s.cmd) {
                case 'signInRequest':
                    m2s = await mfun(c2s, 'getUserMaps');
                    s2c = {cmd: 'signInSuccess', headerData: m2s};
                    break
                case 'openMapRequest':
                    m2s = await mfun(c2s, 'saveMapSelected');
                    m2s = await mfun(c2s, 'openMap');
                    s2c = {cmd: 'openMapSuccess', mapId: c2s.mapId, mapStorage: m2s};
                    break
                case 'createMapInMapRequest':
                    m2s = await mfun(c2s, 'createMap');
                    s2c = {cmd: 'createMapInMapSuccess', newMapId: m2s.insertedId};
                    break
                case 'createMapInTabRequest':
                    m2s = await mfun(c2s, 'createMap');
                    s2c = {cmd: 'createMapInTabSuccess', newMapId: m2s.insertedId};
                    break
                case 'saveMapRequest':
                    m2s = await mfun(c2s, 'saveMap');
                    s2c = {cmd: 'saveMapRequestSuccess'};
                    break
                case 'saveUserMapDataRequest': {
                    m2s = await mfun(c2s, 'saveMapIdList');
                    m2s = await mfun(c2s, 'saveMapSelected');
                    m2s = await mfun(c2s, 'getUserMaps');
                    s2c = {cmd: 'saveUserMapDataSuccess', headerData: m2s};
                    break
                }
            }} else { s2c = {cmd: 'signInFail'};}
    }
    return s2c;
}

async function auth(c2s) {
    let m2s = await mfun(c2s, 'auth');
    return m2s.authenticationSuccess;
}

async function mfun(c2s, action, payload) {
    let m2s = {};
    try {
        console.log('connected to server...');
        switch (action) {
            case 'auth': {
                let currUser = await collectionUsers.findOne({email: c2s.cred.email, password: c2s.cred.password});
                m2s.authenticationSuccess = currUser !== null;
                break;
            }
            case 'getUserMaps': {
                let currUser = await collectionUsers.findOne({email: c2s.cred.email, password: c2s.cred.password});
                let headerMapIdList = currUser.headerMapIdList;
                let headerMapNameList = [];
                let headerMapSelected = currUser.headerMapSelected;
                await collectionMaps.aggregate([
                    {$match:        {_id:           {$in:           headerMapIdList}}             },
                    {$addFields:    {"__order":     {$indexOfArray: [headerMapIdList, "$_id" ]}}  },
                    {$sort:         {"__order":     1}                                            },
                ]).forEach(function (m) {
                    headerMapNameList.push(m.data[0].content)
                });
                m2s = {
                    mapIdList: headerMapIdList,
                    mapNameList: headerMapNameList,
                    mapSelected: headerMapSelected
                };
                break;
            }
            case 'openMap': {
                m2s = await collectionMaps.findOne({_id: ObjectId(c2s.mapId)});
                break;
            }
            case 'createMap': {
                let result = await collectionMaps.insertOne(c2s.mapStorageOut);
                m2s = {insertedId: result.insertedId};
                break;
            }
            case 'saveMapSelected': {
                let currUser = await collectionUsers.findOne({email: c2s.cred.email, password: c2s.cred.password});
                await collectionUsers.updateOne(
                    {_id: ObjectId(currUser._id)},
                    {$set: {"headerMapSelected" : c2s.mapSelected}}
                );
                break;
            }
            case 'saveMapIdList': {
                let currUser = await collectionUsers.findOne({email: c2s.cred.email, password: c2s.cred.password});
                await collectionUsers.updateOne(
                    {_id: ObjectId(currUser._id)},
                    {$set: {"headerMapIdList" : c2s.mapIdList.map(el => ObjectId(el))}}
                );
                break;
            }
            case 'saveMap': {
                await collectionMaps.replaceOne({_id: ObjectId(c2s.mapId)}, c2s.mapStorageOut);
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
