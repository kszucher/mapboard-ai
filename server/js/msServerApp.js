let express = require('express');
let cors = require('cors');
var multer = require('multer');
var path = require('path');
let app = express();
var { promisify } = require('util');
var sizeOf = promisify( require('image-size'));
var MongoHeartbeat = require('mongo-heartbeat');
const nodemailer = require("nodemailer");
"use strict";

let transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'info@mindboard.io',
        pass: 'jH8fB1sB2lS4bQ7d'
    }
});

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
    } else {
        console.log('connected');
        db = client.db("app_dev");
        collectionUsers = db.collection('users');
        collectionMaps = db.collection('maps');
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
    let s2c = {'ERROR': 'error'};


    if (c2s.serverCmd === 'ping') {

        s2c = {cmd: 'pingSuccess'};
    } else {
        try {
            let currUser;
            if (c2s.serverCmd === 'signUpStep1') {
                let {userName, userEmail, userPassword} = c2s.userData;
                currUser = await collectionUsers.findOne({email: userEmail});
                if (currUser === null) {
                    let confirmationCode = getConfirmationCode();
                    await transporter.sendMail({
                        from: "info@mindboard.io",
                        to: userEmail,
                        subject: "MindBoard Email Confirmation",
                        text: "",
                        html:
                            `
                                <p>Hello ${userName}!</p>
                                <p>Welcome to MindBoard!<br>You can complete your registration using the following code:</p>
                                <p>${confirmationCode}</p>
                                <p>You can also join the conversation, propose features and get product news here:<br>
                                <a href="MindBoard Slack">https://join.slack.com/t/mindboardio/shared_invite/zt-qunqabbo-fE_2dnrU7GPuEiDsAy6L~A</a></p>
                                <p>Cheers,<br>Krisztian from MindBoard</p>
                            `
                    });
                    currUser = await collectionUsers.insertOne({
                        email: userEmail,
                        password: userPassword,
                        tabMapSelected: 0,
                        tabMapIdList: [
                            ObjectId('5f3fd7ba7a84a4205428c96a'), // features
                            ObjectId('5ee5e343b1945921ec26c781'), // controls
                            ObjectId('5f467ee216bcf436da264a69'), // proposals
                        ],
                        activationStatus: 'awaitingConfirmation',
                        confirmationCode
                    })
                    s2c = {cmd: 'signUpStep1Success'};
                } else {
                    s2c = {cmd: 'signUpStep1FailEmailAlreadyInUse'};
                }
            } else if (c2s.serverCmd === 'signUpStep2') {
                let {userEmail, userConfirmationCode} = c2s.userData;
                currUser = await collectionUsers.findOne({email: userEmail});
                if (currUser === null ) {
                    s2c = {cmd: 'signUpStep2FailUnknownUser'};
                } else if (currUser.activationStatus === 'completed') {
                    s2c = {cmd: 'signUpStep2FailAlreadyActivated'};
                } else if (parseInt(userConfirmationCode) !== currUser.confirmationCode) {
                    console.log([userConfirmationCode, currUser.confirmationCode])
                    s2c = {cmd: 'signUpStep2FailWrongCode'};
                } else {
                    await collectionUsers.updateOne(
                        {_id: ObjectId(currUser._id)},
                        {$set: {"activationStatus": 'completed'}}
                    );
                    s2c = {cmd: 'signUpStep2Success'};
                }
            } else {
                currUser = await collectionUsers.findOne(c2s.cred);
                if (currUser === null || currUser.activationStatus === 'awaitingConfirmation') {
                    s2c = {cmd: 'signInFail'}
                } else if (currUser.activationStatus === 'awaitingConfirmation') {
                    s2c = {cmd: 'signInFailIncompleteRegistration'}
                } else {
                    if (['openMapFromTab', 'openMapFromMap', 'openMapFromBreadcrumbs',
                        'createMapInMap', 'createMapInTab', 'saveMap', 'importFrame'].includes(c2s.serverCmd)) {
                        const {mapIdOut, mapStorageOut, mapSourceOut} = c2s.serverPayload;
                        if (mapSourceOut === 'data') {
                            await collectionMaps.updateOne({_id: ObjectId(mapIdOut)}, {$set: {data: mapStorageOut}});
                        } else if (mapSourceOut === 'dataPlayback') {
                            const {mapSourcePosOut} = c2s.serverPayload;
                            await collectionMaps.updateOne({_id: ObjectId(mapIdOut)}, {$set: {[`dataPlayback.${mapSourcePosOut}`]: mapStorageOut}});
                        }
                    }
                    switch (c2s.serverCmd) {
                        case 'signIn': {
                            s2c = {cmd: 'signInSuccess'};
                            break;
                        }
                        case 'openMapFromTabHistory': {
                            let {_id, tabMapIdList, tabMapSelected} = currUser;
                            let tabMapNameList = await getMapNameList(tabMapIdList);
                            let mapId = tabMapIdList[tabMapSelected];
                            let breadcrumbMapIdList = [mapId];
                            await collectionUsers.updateOne({_id}, {$set: {breadcrumbMapIdList}});
                            let breadcrumbMapNameList = await getMapNameList(breadcrumbMapIdList);
                            let mapStorage = await getMapData(mapId);
                            s2c = {cmd: 'openMapSuccess', payload: {tabMapNameList, tabMapSelected, breadcrumbMapNameList, mapId, mapStorage, mapSource: 'data'}};
                            break;
                        }
                        case 'openMapFromTab': {
                            let {_id, tabMapIdList} = currUser;
                            let {tabMapSelected} = c2s.serverPayload;
                            let tabMapNameList = await getMapNameList(tabMapIdList);
                            let mapId = tabMapIdList[tabMapSelected];
                            let breadcrumbMapIdList = [mapId];
                            await collectionUsers.updateOne({_id}, {$set: {tabMapSelected, breadcrumbMapIdList}});
                            let breadcrumbMapNameList = await getMapNameList(breadcrumbMapIdList);
                            let mapStorage = await getMapData(mapId);
                            s2c = {cmd: 'openMapSuccess', payload: {tabMapNameList, tabMapSelected, breadcrumbMapNameList, mapId, mapStorage, mapSource: 'data'}};
                            break;
                        }
                        case 'openMapFromMap': {
                            let {_id, breadcrumbMapIdList} = currUser;
                            let {mapId} = c2s.serverPayload;
                            mapId = ObjectId(mapId);
                            breadcrumbMapIdList = [...breadcrumbMapIdList, mapId];
                            await collectionUsers.updateOne({_id}, {$set: {breadcrumbMapIdList}});
                            let breadcrumbMapNameList = await getMapNameList(breadcrumbMapIdList);
                            let mapStorage = await getMapData(mapId);
                            s2c = {cmd: 'openMapSuccess', payload: {breadcrumbMapNameList, mapId, mapStorage, mapSource: 'data'}};
                            break;
                        }
                        case 'openMapFromBreadcrumbs': {
                            let {_id, breadcrumbMapIdList} = currUser;
                            let {breadcrumbMapSelected} = c2s.serverPayload;
                            breadcrumbMapIdList.length = breadcrumbMapSelected + 1;
                            let mapId = breadcrumbMapIdList[breadcrumbMapIdList.length - 1];
                            await collectionUsers.updateOne({_id}, {$set: {breadcrumbMapIdList}});
                            let breadcrumbMapNameList = await getMapNameList(breadcrumbMapIdList);
                            let mapStorage = await getMapData(mapId);
                            s2c = {cmd: 'openMapSuccess', payload: {breadcrumbMapNameList, mapId, mapStorage, mapSource: 'data'}};
                            break;
                        }
                        case 'saveMap': {
                            s2c = {cmd: 'saveMapSuccess'};
                            break;
                        }
                        case 'createMapInMap': {
                            let {breadcrumbMapIdList} = currUser;
                            let {mapIdOut, lastPath, newMapName} = c2s.serverPayload;
                            let newMap = getDefaultMap(newMapName);
                            let mapStorage = newMap.data;
                            let mapId = (await collectionMaps.insertOne(newMap)).insertedId;
                            await collectionMaps.updateOne(
                                {_id: ObjectId(mapIdOut)},
                                {$set: {'data.$[elem].linkType' : 'internal', 'data.$[elem].link' : mapId.toString()}},
                                {"arrayFilters": [{ "elem.path": lastPath }], "multi": true}
                            );
                            breadcrumbMapIdList = [...breadcrumbMapIdList, mapId];
                            let breadcrumbMapNameList = await getMapNameList(breadcrumbMapIdList);
                            s2c = {cmd: 'openMapSuccess', payload: {breadcrumbMapNameList, mapId, mapStorage, mapSource: 'data'}};
                            break;
                        }
                        case 'createMapInTab': {
                            let {_id, tabMapIdList, tabMapSelected, breadcrumbMapIdList} = currUser;
                            let newMap = getDefaultMap('New Map');
                            let mapStorage = newMap.data;
                            let mapId = (await collectionMaps.insertOne(newMap)).insertedId;
                            tabMapIdList = [...tabMapIdList, mapId];
                            tabMapSelected = tabMapIdList.length - 1;
                            await collectionUsers.updateOne({_id}, {$set: {tabMapIdList, tabMapSelected}});
                            let breadcrumbMapNameList = await getMapNameList(breadcrumbMapIdList);
                            let tabMapNameList = await getMapNameList(tabMapIdList);
                            s2c = {cmd: 'openMapSuccess', payload: {tabMapNameList, tabMapSelected, breadcrumbMapNameList, mapId, mapStorage, mapSource: 'data'}};
                            break;
                        }
                        case 'removeMapInTab': {
                            let {_id, tabMapIdList, tabMapSelected, breadcrumbMapIdList} = currUser;
                            if (tabMapSelected === 0) {
                                s2c = {cmd: 'removeMapInTabFail'}; // filter this on FE instead
                            } else {
                                tabMapIdList = tabMapIdList.filter((val, i) => i !== tabMapSelected);
                                tabMapSelected = tabMapSelected - 1;
                                await collectionUsers.updateOne({_id}, {$set: {tabMapIdList, tabMapSelected}});
                                let breadcrumbMapNameList = await getMapNameList(breadcrumbMapIdList);
                                let tabMapNameList = await getMapNameList(tabMapIdList);
                                let mapId = tabMapIdList[tabMapSelected];
                                let mapStorage = await getMapData(mapId);
                                s2c = {cmd: 'openMapSuccess', payload: {tabMapNameList, tabMapSelected, breadcrumbMapNameList, mapId, mapStorage, mapSource: 'data'}};
                            }
                            break;
                        }
                        case 'moveUpMapInTab': {
                            let {_id, tabMapIdList, tabMapSelected} = currUser;
                            if (tabMapSelected === 0) {
                                s2c = {cmd: 'moveUpMapInTabFail'}; // filter this on FE instead
                            } else {
                                [tabMapIdList[tabMapSelected], tabMapIdList[tabMapSelected - 1]] =
                                    [tabMapIdList[tabMapSelected - 1], tabMapIdList[tabMapSelected]]
                                tabMapSelected = tabMapSelected - 1;
                                await collectionUsers.updateOne({_id}, {$set: {tabMapIdList, tabMapSelected}});
                                let tabMapNameList = await getMapNameList(tabMapIdList);
                                s2c = {cmd: 'updateTabSuccess', payload: {tabMapNameList, tabMapSelected}}
                            }
                            break;
                        }
                        case 'moveDownMapInTab': {
                            let {_id, tabMapIdList, tabMapSelected} = currUser;
                            if (tabMapSelected >= tabMapIdList.length - 1) {
                                s2c = {cmd: 'moveDownMapInTabFail'}; // filter this on FE instead
                            } else {
                                [tabMapIdList[tabMapSelected], tabMapIdList[tabMapSelected + 1]] =
                                    [tabMapIdList[tabMapSelected + 1], tabMapIdList[tabMapSelected]]
                                tabMapSelected = tabMapSelected + 1;
                                await collectionUsers.updateOne({_id}, {$set: {tabMapIdList, tabMapSelected}});
                                let tabMapNameList = await getMapNameList(tabMapIdList);
                                s2c = {cmd: 'updateTabSuccess', payload: {tabMapNameList, tabMapSelected}};
                            }
                            break;
                        }
                        case 'getFrameLen': {
                            let {mapId} = c2s.serverPayload;
                            let frameLen = await getFrameLen(mapId);
                            s2c = {cmd: 'getFrameLenSuccess', payload: {frameLen}};
                            break;
                        }
                        case 'openFrame': {
                            // TODO this should save the previous stuff too, probably just needs to be added to the list?
                            let {mapId, dataPlaybackSelected} = c2s.serverPayload;
                            mapId = ObjectId(mapId);
                            let mapStorage = await getPlaybackMapData(mapId, dataPlaybackSelected);
                            s2c = {cmd: 'openMapSuccess', payload: {mapId, mapStorage, mapSource: 'dataPlayback', dataPlaybackSelected}};
                            break;
                        }
                        case 'importFrame': {
                            let {mapIdOut} = c2s.serverPayload;
                            let mapStorageToCopy = await getMapData(ObjectId(mapIdOut));
                            await collectionMaps.updateOne({_id: ObjectId(mapIdOut)}, {$push: {"dataPlayback": mapStorageToCopy}});
                            let frameLen = await getFrameLen(mapIdOut);
                            s2c = {cmd: 'importFrameSuccess', payload: {frameLen}};
                            break;
                        }
                        case 'deleteFrame': {
                            let {mapId, dataPlaybackSelected} = c2s.serverPayload;
                            mapId = ObjectId(mapId);
                            await collectionMaps.updateOne({_id: mapId}, [{
                                $set: {
                                    dataPlayback: {
                                        $concatArrays: [
                                            {$slice: ["$dataPlayback", dataPlaybackSelected]},
                                            {$slice: ["$dataPlayback", {$add: [1, dataPlaybackSelected]}, {$size: "$dataPlayback"}]}
                                        ]}}}]);
                            let frameLen = await getFrameLen(mapId);
                            let mapStorage = await getPlaybackMapData(mapId, dataPlaybackSelected - 1);
                            s2c = {cmd: 'openMapSuccess', payload: {mapId, mapStorage, mapSource: 'dataPlayback', frameLen}};
                            break;
                        }
                        case 'duplicateFrame': {
                            // await collectionMaps.updateOne({_id: ObjectId(mapIdOut)}, {$push: {"dataPlayback": {$each: [mapStorageOut], $position: mapSourcePosOut}}});
                            break;
                        }
                    }
                }
            }
        } catch (err) {
            console.log('mongo error');
            console.log(err.stack);
        }
    }
    return s2c;
}

async function getMapData(mapId) {
    return (await collectionMaps.findOne({_id: mapId})).data
}

async function getPlaybackMapData(mapId, dataPlaybackSelected) {
    return (await collectionMaps.findOne({_id: mapId})).dataPlayback[dataPlaybackSelected]
}

async function getFrameLen(mapId) {
    return (await collectionMaps.findOne({_id: ObjectId(mapId)})).dataPlayback.length;
}

async function getMapNameList(mapIdList) {
    let mapNameList = [];
    await collectionMaps.aggregate([
        {$match: {_id: {$in: mapIdList}}},
        {$addFields: {"__order": {$indexOfArray: [mapIdList, "$_id"]}}},
        {$sort: {"__order": 1}},
    ]).forEach(function (m) {mapNameList.push(m.data[1].content)});
    return mapNameList;
}

function getConfirmationCode() {
    let [min, max] = [1000, 9999];
    return Math.round(Math.random() * (max - min) + min);
}

function getDefaultMap(mapName) {
    return {
        data: [
            {path: ['m']},
            {path: ['r'], content: mapName, selected: 1},
            {path: ['r', 'd', 0]},
            {path: ['r', 'd', 1]},
        ],
        dataHistory: [],
        dataPlayback: []
    }
}

module.exports = app;
