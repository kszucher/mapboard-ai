let express =           require('express');
let cors =              require('cors');
var multer  =           require('multer');
var path =              require('path');
let app =               express();

var { promisify } =     require('util');
var sizeOf = promisify( require('image-size'));

// improvement for later times
// https://flaviocopes.com/node-request-data/

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

app.post('/feta', type, async function (req, res) {
    let imageSize = await measureImage(req.file);
    let sf2c = {
            cmd:                'imageSaveSuccess',
            imageId:            req.file.filename,
            imageSize:          imageSize
    };
    res.json(sf2c)
});

app.use('/file', express.static(path.join(__dirname, '../uploads')));
app.listen(8082, function () {console.log('CORS-enabled web server listening on port 8082')});

async function measureImage(file) {
    try {
        const dimensions = await sizeOf('../uploads/' + file.filename);
        console.log(dimensions.width, dimensions.height);
        return dimensions;
    } catch (err) {
        console.error(err);
    }
}

async function sendResponse(c2s) {
    let s2c = {
        'ERROR': 'error',
    };

    if (auth(c2s)) {
        switch (c2s.cmd) {
            case 'signInRequest': {
                let m2s = await mongoFunction(c2s, 'getUserMaps');
                s2c = {
                    cmd:                'signInSuccess',
                    headerData:         m2s,
                };
                break;
            }
            case 'signOutRequest': {
                s2c = {
                    cmd:                'signOutSuccess',
                };
                break;
            }
            case 'openMapRequest': {
                let m2s = await mongoFunction(c2s, 'openMap');
                s2c = {
                    cmd:                'openMapSuccess',
                    mapName:            c2s.mapName,
                    mapStorage:         m2s,
                };
                break;
            }
            case 'writeMapRequest': {
                await mongoFunction(c2s, 'writeMap');
                s2c = {
                    cmd:                'writeMapRequestSuccess',
                };
                break;
            }
            case 'createMapInMapRequest': {
                let m2s = await mongoFunction(c2s, 'createMapInMap');
                s2c = {
                    cmd:                'createMapInMapSuccess',
                    newMapId:           m2s.insertedId
                };
                break;
            }
        }
    }
    else {
        s2c = {
            cmd: 'signInFail',
        };
    }

    return s2c;
}

function auth(c2s) {
    let authOk = 0;
    if (c2s.cred.name === 'kryss' && c2s.cred.pass === 'mncvmncv') {
        authOk = 1;
    }
    return authOk;
}

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = "mongodb+srv://mindboard-server:3%21q.FkpzkJPTM-Q@cluster0-sg0ny.mongodb.net/test?retryWrites=true&w=majority";

async function mongoFunction(c2s, operation) {

    let m2s = {};

    const client = new MongoClient(uri, { useNewUrlParser: true });

    try {
        await client.connect();
        console.log('connected to server...');

        const collectionUsers =     client.db("app").collection("users");
        const collectionMaps =      client.db("app").collection("maps");

        switch (operation) {
            case 'getUserMaps': {
                let currUser = await collectionUsers.findOne({_id: ObjectId('5d88c99f1935c83e84ca263d')});
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
            case 'createMapInMap': {
                let result = await collectionMaps.insertOne(c2s.newMap);
                m2s = {
                    insertedId: result.insertedId
                };
                break;
            }
            case 'openMap': {
                m2s = await collectionMaps.findOne({_id: ObjectId(c2s.mapName)});
                break;
            }
            case 'writeMap': {
                await collectionMaps.replaceOne({_id: ObjectId(c2s.mapName)}, c2s.mapStorage);
                break;
            }
        }
    }
    catch (err) {
        console.log('mongo error');
        console.log(err.stack);
    }
    client.close();

    return m2s;
}

module.exports = app;
