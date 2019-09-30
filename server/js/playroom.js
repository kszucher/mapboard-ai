const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mindboard-server:3%21q.FkpzkJPTM-Q@cluster0-sg0ny.mongodb.net/test?retryWrites=true&w=majority";
const ObjectId = require('mongodb').ObjectId;

async function mongoFunction() {
    const client = new MongoClient(uri, { useNewUrlParser: true });

    try {
        await client.connect();

        const collectionMaps =    client.db("app").collection("maps1v1");


        const collectionUsers =         client.db("app").collection("users");

        //
        // let nowid = '5d91cdc5bc560b176c9e7cf0'
        //
        // let x = await collectionUsers.findOne({_id: ObjectId(nowid)})

        // collectionUsers.insertOne({'cica': 'kutya'}, function(err,docsInserted){
        //     console.log(docsInserted.insertedId);
        // });



        let headerMapListX = [];




        // let currUser = await collectionUsers.findOne({id: 'a591e739'});
        // let headerMapList = currUser.headerMapList;
        // await collectionMaps.aggregate([
        //     {$match:        {id:            {$in:           headerMapList}}             },
        //     {$addFields:    {"__order":     {$indexOfArray: [headerMapList, "$id" ]}}   },
        //     {$sort:         {"__order":     1}                                       },
        // ]).forEach(function (m) {
        //     headerMapListX.push(m._id)
        // });



        // let x = await collectionMapsLatest.findOne({id: 'f17bffc4'})

        //
        // await collectionUsers.updateOne(
        //     {id: 'a591e739'},
        //     {$set: {"headerMapListX": headerMapListX}});

        // await currUser



        // végig kellene menni az összes map-en




    }
    catch (err) {
        console.log('error');
        console.log(err.stack);
    }
    client.close();
}

mongoFunction();
