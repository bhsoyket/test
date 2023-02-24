(function() {
    const http = require('http');

    const server = http.createServer(function(req, res) {
        res.end('It works!');
    });


    server.listen(3000, 'localhost', function(err) {
        if(err) {
            console.log('was an errr');
        }
    });
}) ();
