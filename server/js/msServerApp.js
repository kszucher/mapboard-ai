let express =           require('express');
let cors =              require('cors');
let hash =              require('./Hash');
let sizeOf =            require('image-size');
let app =               express();

// improvement later
// https://flaviocopes.com/node-request-data/

app.use(cors());
app.listen(8082, function () {console.log('CORS-enabled web server listening on port 8082')});
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
                let currUser = await collectionUsers.findOne({id: 'a591e739'});
                let headerMapList = currUser.headerMapList;
                let headerMapNameList = [];
                await collectionMaps.aggregate([
                    {$match:        {_id:           {$in:           headerMapList}}             },
                    {$addFields:    {"__order":     {$indexOfArray: [headerMapList, "$_id" ]}}  },
                    {$sort:         {"__order":     1}                                          },
                ]).forEach(function (m) {
                    headerMapNameList.push(m.data[0].content)
                });

                m2s = {
                    headerMapList: headerMapList,
                    headerMapNameList: headerMapNameList,
                    headerMapSelected: currUser.headerMapSelected
                };

                break;
            }
            case 'createMap': {
                await collectionMaps.insertOne(c2s.mapStorage);
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
