let express = require('express');
let cors = require('cors');
let app = express();
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

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = "mongodb+srv://mindboard-server:3%21q.FkpzkJPTM-Q@cluster0-sg0ny.mongodb.net/test?retryWrites=true&w=majority";

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
let collectionShares;
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
        db = client.db(process.env.MONGO_TARGET_DB || "app_dev");
        collectionUsers = db.collection('users');
        collectionMaps = db.collection('maps');
        collectionShares = db.collection('maps');
        app.listen(process.env.PORT || 8082, function () {console.log('CORS-enabled web server listening on port 8082')});

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
            if (c2s.serverCmd === 'getLandingData') {
                s2c = {cmd: 'getLandingDataSuccess', payload: {landingData: (await collectionMaps.findOne({_id: ObjectId('5f3fd7ba7a84a4205428c96a')})).dataPlayback}}
            } else if (c2s.serverCmd === 'signUpStep1') {
                let {name, email, password} = c2s.serverPayload;
                currUser = await collectionUsers.findOne({email});
                if (currUser === null) {
                    let confirmationCode = getConfirmationCode();
                    await transporter.sendMail({
                        from: "info@mindboard.io",
                        to: email,
                        subject: "MapBoard Email Confirmation",
                        text: "",
                        html:
                            `
                                <p>Hello ${name}!</p>
                                <p>Welcome to MapBoard!<br>You can complete your registration using the following code:</p>
                                <p>${confirmationCode}</p>
                                <p>You can also join the conversation, propose features and get product news here:<br>
                                <a href="MindBoard Slack">https://join.slack.com/t/mindboardio/shared_invite/zt-qunqabbo-fE_2dnrU7GPuEiDsAy6L~A</a></p>
                                <p>Cheers,<br>Krisztian from MapBoard</p>
                            `
                    });
                    currUser = await collectionUsers.insertOne({
                        email: email,
                        password: password,
                        tabMapSelected: 0,
                        tabMapIdList: [
                            ObjectId('5f3fd7ba7a84a4205428c96a'), // features
                            ObjectId('5ee5e343b1945921ec26c781'), // controls
                            ObjectId('5f467ee216bcf436da264a69'), // proposals
                        ],
                        activationStatus: 'awaitingConfirmation',
                        confirmationCode,
                        breadcrumbMapIdList: [
                            ObjectId('5f3fd7ba7a84a4205428c96a') , // features
                        ],
                    })
                    s2c = {cmd: 'signUpStep1Success'};
                } else {
                    s2c = {cmd: 'signUpStep1FailEmailAlreadyInUse'};
                }
            } else if (c2s.serverCmd === 'signUpStep2') {
                let {email, confirmationCode} = c2s.serverPayload;
                currUser = await collectionUsers.findOne({email});
                if (currUser === null ) {
                    s2c = {cmd: 'signUpStep2FailUnknownUser'};
                } else if (currUser.activationStatus === 'completed') {
                    s2c = {cmd: 'signUpStep2FailAlreadyActivated'};
                } else if (parseInt(confirmationCode) !== currUser.confirmationCode) {
                    s2c = {cmd: 'signUpStep2FailWrongCode'};
                } else {
                    await collectionUsers.updateOne({_id: ObjectId(currUser._id)}, {$set: {"activationStatus": 'completed'}});
                    s2c = {cmd: 'signUpStep2Success'};
                }
            } else {
                currUser = await collectionUsers.findOne({email: c2s.cred.email});
                if (currUser === null || currUser.password !== c2s.cred.password) {
                    s2c = {cmd: 'signInFail'};
                } else if (currUser.activationStatus === 'awaitingConfirmation') {
                    s2c = {cmd: 'signInFailIncompleteRegistration'}
                } else {
                    if (c2s.hasOwnProperty('serverPayload') &&
                        c2s.serverPayload.hasOwnProperty('mapIdOut') &&
                        c2s.serverPayload.hasOwnProperty('mapSourceOut') &&
                        c2s.serverPayload.hasOwnProperty('mapStorageOut')) {
                        const {mapIdOut, mapSourceOut, mapStorageOut} = c2s.serverPayload;
                        if (mapSourceOut === 'data') {
                            await collectionMaps.updateOne({_id: ObjectId(mapIdOut)}, {$set: {data: mapStorageOut}});
                        } else if (mapSourceOut === 'dataPlayback') {
                            const {frameSelectedOut} = c2s.serverPayload;
                            await collectionMaps.updateOne({_id: ObjectId(mapIdOut)}, {$set: {[`dataPlayback.${frameSelectedOut}`]: mapStorageOut}});
                        }
                    }
                    switch (c2s.serverCmd) {
                        case 'signIn': {
                            s2c = {cmd: 'signInSuccess'};
                            break;
                        }
                        case 'openMapFromHistory': {
                            let {tabMapIdList, tabMapSelected, breadcrumbMapIdList} = currUser;
                            let tabMapNameList = await getMapNameList(tabMapIdList);
                            let mapId = breadcrumbMapIdList[breadcrumbMapIdList.length - 1];
                            let breadcrumbMapNameList = await getMapNameList(breadcrumbMapIdList);
                            let mapSource = 'data';
                            let mapStorage = await getMapData(mapId);
                            s2c = {
                                cmd: 'openMapFromHistorySuccess',
                                payload: {
                                    tabMapNameList,
                                    tabMapSelected,
                                    breadcrumbMapNameList,
                                    mapId,
                                    mapSource,
                                    mapStorage
                                }
                            };
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
                            let mapSource = 'data';
                            let mapStorage = await getMapData(mapId);
                            s2c = {
                                cmd: 'openMapFromTabSuccess',
                                payload: {
                                    tabMapNameList,
                                    tabMapSelected,
                                    breadcrumbMapNameList,
                                    mapId,
                                    mapSource,
                                    mapStorage
                                }
                            };
                            break;
                        }
                        case 'openMapFromMap': {
                            let {_id, breadcrumbMapIdList} = currUser;
                            let {mapId} = c2s.serverPayload;
                            mapId = ObjectId(mapId);
                            breadcrumbMapIdList = [...breadcrumbMapIdList, mapId];
                            await collectionUsers.updateOne({_id}, {$set: {breadcrumbMapIdList}});
                            let breadcrumbMapNameList = await getMapNameList(breadcrumbMapIdList);
                            let mapSource = 'data';
                            let mapStorage = await getMapData(mapId);
                            s2c = {
                                cmd: 'openMapFromMapSuccess',
                                payload: {breadcrumbMapNameList, mapId, mapSource, mapStorage}
                            };
                            break;
                        }
                        case 'openMapFromBreadcrumbs': {
                            let {_id, breadcrumbMapIdList} = currUser;
                            let {breadcrumbMapSelected} = c2s.serverPayload;
                            breadcrumbMapIdList.length = breadcrumbMapSelected + 1;
                            let mapId = breadcrumbMapIdList[breadcrumbMapIdList.length - 1];
                            await collectionUsers.updateOne({_id}, {$set: {breadcrumbMapIdList}});
                            let breadcrumbMapNameList = await getMapNameList(breadcrumbMapIdList);
                            let mapSource = 'data';
                            let mapStorage = await getMapData(mapId);
                            s2c = {
                                cmd: 'openMapFromBreadcrumbsSuccess',
                                payload: {breadcrumbMapNameList, mapId, mapSource, mapStorage}
                            };
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
                            let mapId = (await collectionMaps.insertOne(newMap)).insertedId;
                            await collectionMaps.updateOne(
                                {_id: ObjectId(mapIdOut)},
                                {$set: {'data.$[elem].linkType': 'internal', 'data.$[elem].link': mapId.toString()}},
                                {"arrayFilters": [{"elem.path": lastPath}], "multi": true}
                            );
                            breadcrumbMapIdList = [...breadcrumbMapIdList, mapId];
                            let breadcrumbMapNameList = await getMapNameList(breadcrumbMapIdList);
                            let mapSource = 'data';
                            let mapStorage = newMap.data;
                            s2c = {
                                cmd: 'createMapInMapSuccess',
                                payload: {breadcrumbMapNameList, mapId, mapSource, mapStorage}
                            };
                            break;
                        }
                        case 'createMapInTab': {
                            let {_id, tabMapIdList, tabMapSelected, breadcrumbMapIdList} = currUser;
                            let newMap = getDefaultMap('New Map');
                            let mapId = (await collectionMaps.insertOne(newMap)).insertedId;
                            tabMapIdList = [...tabMapIdList, mapId];
                            tabMapSelected = tabMapIdList.length - 1;
                            await collectionUsers.updateOne({_id}, {$set: {tabMapIdList, tabMapSelected}});
                            let breadcrumbMapNameList = await getMapNameList(breadcrumbMapIdList);
                            let tabMapNameList = await getMapNameList(tabMapIdList);
                            let mapSource = 'data';
                            let mapStorage = newMap.data;
                            s2c = {
                                cmd: 'createMapInTabSuccess',
                                payload: {
                                    tabMapNameList,
                                    tabMapSelected,
                                    breadcrumbMapNameList,
                                    mapId,
                                    mapSource,
                                    mapStorage
                                }
                            };
                            break;
                        }
                        case 'removeMapInTab': {
                            let {_id, tabMapIdList, tabMapSelected, breadcrumbMapIdList} = currUser;
                            if (tabMapSelected === 0) {
                                s2c = {cmd: 'removeMapInTabFail'};
                            } else {
                                tabMapIdList = tabMapIdList.filter((val, i) => i !== tabMapSelected);
                                tabMapSelected = tabMapSelected - 1;
                                await collectionUsers.updateOne({_id}, {$set: {tabMapIdList, tabMapSelected}});
                                let breadcrumbMapNameList = await getMapNameList(breadcrumbMapIdList);
                                let tabMapNameList = await getMapNameList(tabMapIdList);
                                let mapId = tabMapIdList[tabMapSelected];
                                let mapSource = 'data';
                                let mapStorage = await getMapData(mapId);
                                s2c = {
                                    cmd: 'removeMapInTabSuccess',
                                    payload: {
                                        tabMapNameList,
                                        tabMapSelected,
                                        breadcrumbMapNameList,
                                        mapId,
                                        mapSource,
                                        mapStorage
                                    }
                                };
                            }
                            break;
                        }
                        case 'moveUpMapInTab': {
                            let {_id, tabMapIdList, tabMapSelected} = currUser;
                            if (tabMapSelected === 0) {
                                s2c = {cmd: 'moveUpMapInTabFail'};
                            } else {
                                [tabMapIdList[tabMapSelected], tabMapIdList[tabMapSelected - 1]] =
                                    [tabMapIdList[tabMapSelected - 1], tabMapIdList[tabMapSelected]]
                                tabMapSelected = tabMapSelected - 1;
                                await collectionUsers.updateOne({_id}, {$set: {tabMapIdList, tabMapSelected}});
                                let tabMapNameList = await getMapNameList(tabMapIdList);
                                s2c = {cmd: 'moveUpMapInTabSuccess', payload: {tabMapNameList, tabMapSelected}}
                            }
                            break;
                        }
                        case 'moveDownMapInTab': {
                            let {_id, tabMapIdList, tabMapSelected} = currUser;
                            if (tabMapSelected >= tabMapIdList.length - 1) {
                                s2c = {cmd: 'moveDownMapInTabFail'};
                            } else {
                                [tabMapIdList[tabMapSelected], tabMapIdList[tabMapSelected + 1]] =
                                    [tabMapIdList[tabMapSelected + 1], tabMapIdList[tabMapSelected]]
                                tabMapSelected = tabMapSelected + 1;
                                await collectionUsers.updateOne({_id}, {$set: {tabMapIdList, tabMapSelected}});
                                let tabMapNameList = await getMapNameList(tabMapIdList);
                                s2c = {cmd: 'moveDownMapInTabSuccess', payload: {tabMapNameList, tabMapSelected}};
                            }
                            break;
                        }
                        case 'openFrame': {
                            let {mapIdOut, frameSelected} = c2s.serverPayload;
                            let mapId = ObjectId(mapIdOut);
                            let frameLen = await getFrameLen(mapId);
                            if (frameLen === 0) {
                                s2c = {cmd: 'openFrameFail', payload: {frameLen, frameSelected}};
                            } else {
                                let mapStorage = await getPlaybackMapData(mapId, frameSelected);
                                let mapSource = 'dataPlayback';
                                s2c = {
                                    cmd: 'openFrameSuccess',
                                    payload: {mapId, mapStorage, mapSource, frameLen, frameSelected}
                                };
                            }
                            break;
                        }
                        case 'importFrame': {
                            let {mapIdOut} = c2s.serverPayload;
                            mapIdOut = ObjectId(mapIdOut);
                            let mapStorageToCopy = await getMapData(mapIdOut);
                            await collectionMaps.updateOne({_id: mapIdOut}, {$push: {"dataPlayback": mapStorageToCopy}});
                            let frameLen = await getFrameLen(mapIdOut);
                            let frameSelected = frameLen - 1;
                            s2c = {cmd: 'importFrameSuccess', payload: {frameLen, frameSelected}};
                            break;
                        }
                        case 'deleteFrame': {
                            let {mapId, frameSelectedOut, frameSelected} = c2s.serverPayload;
                            mapId = ObjectId(mapId);
                            let frameLen = await getFrameLen(mapId);
                            if (frameLen === 0) {
                                s2c = {cmd: 'deleteFrameFail'};
                            } else {
                                frameLen = frameLen - 1;
                                await collectionMaps.updateOne({_id: mapId}, [{
                                    $set: {
                                        dataPlayback: {
                                            $concatArrays: [
                                                {$slice: ["$dataPlayback", frameSelectedOut]},
                                                {$slice: ["$dataPlayback", {$add: [1, frameSelectedOut]}, {$size: "$dataPlayback"}]}
                                            ]
                                        }
                                    }
                                }]);
                                let mapSource;
                                let mapStorage;
                                if (frameLen === 0) {
                                    mapSource = 'data';
                                    mapStorage = await getMapData(mapId);
                                } else {
                                    mapSource = 'dataPlayback';
                                    mapStorage = await getPlaybackMapData(mapId, frameSelected);
                                }
                                s2c = {
                                    cmd: 'deleteFrameSuccess',
                                    payload: {mapId, mapSource, mapStorage, frameLen, frameSelected}
                                };
                            }
                            break;
                        }
                        case 'duplicateFrame': {
                            let {
                                mapIdOut,
                                mapSourceOut,
                                mapStorageOut,
                                frameSelectedOut,
                                frameSelected
                            } = c2s.serverPayload;
                            let mapId = ObjectId(mapIdOut);
                            await collectionMaps.updateOne({_id: mapId}, {
                                $push: {
                                    "dataPlayback": {
                                        $each: [mapStorageOut],
                                        $position: frameSelectedOut
                                    }
                                }
                            });
                            let mapSource = mapSourceOut;
                            let mapStorage = mapStorageOut;
                            let frameLen = await getFrameLen(mapId);
                            s2c = {
                                cmd: 'duplicateFrameSuccess',
                                payload: {mapId, mapSource, mapStorage, frameLen, frameSelected}
                            };
                            break;
                        }
                        case 'checkValidity': {
                            let {mapId, email, access} = c2s.serverPayload;
                            let shareUser = await collectionUsers.findOne({email});
                            if (shareUser === null || JSON.stringify(shareUser._id) === JSON.stringify(currUser._id)) {
                                s2c = {cmd: 'shareValidityFail'};
                            } else {
                                let newShare = {
                                    sharedMap: ObjectId(mapId),
                                    ownerUser: ObjectId(currUser._id),
                                    shareUser: ObjectId(shareUser.id),
                                    access,
                                    status: 'waiting'
                                }
                                // let mapId = (await collectionMaps.insertOne(newMap)).insertedId;
                                console.log(newShare)


                                s2c = {cmd: 'shareValiditySuccess', payload: {}};
                            }
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

async function getPlaybackMapData(mapId, frameSelected) {
    return (await collectionMaps.findOne({_id: mapId})).dataPlayback[frameSelected]
}

async function getFrameLen(mapId) {
    return (await collectionMaps.findOne({_id: mapId})).dataPlayback.length;
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
        dataPlayback: [],
    }
}

module.exports = app;
