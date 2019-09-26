var PubNub = require('pubnub')

var pubnubDemo = new PubNub({
    publishKey: 'pub-c-90035b55-0e1c-4b24-b4fb-3027339550d2',
    subscribeKey: 'sub-c-ee4b80f6-beae-11e9-81e6-3e7b6b592954',
    ssl: false
});


// Subscribe to the demo_tutorial channel
pubnubDemo.addListener({
    message: function(message) {
        console.log(message)


        // call MapApiHandler.receive(message)

        console.log('hello from react')
    }
});

pubnubDemo.subscribe({
    channels: ['demo_tutorial']
});

