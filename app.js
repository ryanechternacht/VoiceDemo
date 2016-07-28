var express = require('express'),
    path = require('path'),
    app = express();

var staticPath = path.join(__dirname, 'src');
console.log('static path: ' + staticPath);
app.use(express.static(staticPath));

var env = process.env || {};

var port = env.PORT || 3002;

app.listen(port);

console.log('listening on ' + port + '...');