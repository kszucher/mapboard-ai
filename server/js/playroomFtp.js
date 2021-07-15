var Client = require('ftp');

var c = new Client();
c.on('ready', function() {
    c.list(function(err, list) {
        if (err) throw err;
        console.log(list);
        c.end();
    });
});

c.connect({
    host:       'server248.web-hosting.com',
    port:       21,
    user:       'mindliha',
    password: 	'KUSNqGeYd3KA'
});

// put can be a local file, a buffer or a path to a local file --> so it should work from the buffer soon

// TODO should change DB to prod before upload