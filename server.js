var app = require('express').createServer(),
	io = require('socket.io').listen(app);

var port = process.env.PORT || 5000;

app.listen(port);
io.set('log level', 1);

app.get('/', function(req, res) {
	res.sendfile(__dirname + "/index.html");
});

io.sockets.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
		console.log(data);
	});
});

/*var app = express.createServer(express.logger());

app.get('/', function(request, response) {
	response.send('Hello world!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log('Listening on ' + port);
});*/

