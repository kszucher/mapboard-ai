const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mindboard-server:3%21q.FkpzkJPTM-Q@cluster0-sg0ny.mongodb.net/test?retryWrites=true&w=majority";

async function mongoFunction() {
    const client = new MongoClient(uri, { useNewUrlParser: true });

    try {
        await client.connect();

        const collectionMapsLatest =    client.db("app").collection("maps1v1");
        const collectionUsers =         client.db("app").collection("users");

        let username = 'a591e739';



        // USUAL steps
        // 1. create backup
        // 2. do some query
        // 3. do modification based on query
        // 4. test



        let currUser = await collectionUsers.findOne({id: username});
        
        let mapIdList = currUser.headerMaps;
        let mapNameList = [];
        await collectionMapsLatest.aggregate([
            {$match:        {id:            {$in:           mapIdList}}             },
            {$addFields:    {"__order":     {$indexOfArray: [mapIdList, "$id" ]}}   },
            {$sort:         {"__order":     1}                                      },
        ]).forEach(function (m) {
            mapNameList.push(m.data[0].content)
        });


        console.log(mapIdList)
        console.log(mapNameList)

        // console.log( await collectionMapsLatest.find({id: {$in: currUser.headerMaps}}).toArray())

        // console.log(await collectionMapsLatest.distinct('data[0]'))


        // kiszedegetem egy tömbbe a neveiket szépen

        // let mapNameList = [];

        // for (let i = 0; i < headerMaps.length; i++) {


            // let

            // mapNameList.push(headerMaps[i])
        // }

        let headerMapsActive = await collectionMapsLatest.findOne({id: currUser.headerMapsActive});

        // console.log(headerMapsActive.data[0].content)



        // TRADEOFF: vagy a lekérés lesz indokolatlanul böszme, vagy a segédlogikák lesznek indokolatlanul bonyolultak
        // lusta algoritmus
        // kezdjük el kiértékelni a másik esetet is:


    }
    catch (err) {
        console.log('error');
        console.log(err.stack);
    }
    client.close();
}

mongoFunction();

// minimum features
// - registration
// - undo-redo
// - sharing
// - drift for communication
// - welcome page: generated, animated (?) artwork

// follow best practive!!! csak akkor lesznek pluszok, ha rákattintottam egy ilyen kis szarra

// - THATS IT. THATS IT AND ALL.
// --> MVP for learning, do NOT forget that!!!!!!!!!!!!!!!!!!

// I WANT THIS TO BE ON BETA LIST