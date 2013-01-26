var app = require('express').createServer(),
	io = require('socket.io').listen(app);

var port = process.env.PORT || 5000;

var nextUserId = 0;
var nextEnemyId = 0;
var enemies = [];

app.listen(port);
io.set('log level', 1);

app.get('/', function(req, res) {
	res.sendfile(__dirname + "/index.html");
});



var Enemy = function() {
	this.x = Math.random() * 3600;
	this.y = Math.random() * 3600;
	this.health = 100;
	this.uid = getNextEnemyId();
};

for (var i=0; i < 50; i++) {
	var e = new Enemy();
	enemies[e.uid] = e;
}


io.sockets.on('connection', function (socket) {

	socket.on('user:connect', function(name){
		socket.set('nickname', name);
		socket.set('uid', nextUserId);
		return getNextUserId();
	});

	socket.on('user:move:pos', function(data) {
		// x, y
		socket.broadcast.volatile.emit('user:move:pos', data);
	});

	socket.on('user:move:dir', function(data) {
		//n-s-e-w
		socket.broadcast.volatile.emit('user:move:dir', data);
	});

	socket.on('user:weapon:pickup', function(data) {
		// picked up a new weapon
		socket.broadcast.volatile.emit('user:weapon:pickup', data);
	});

	socket.on('user:weapon:state', function(data) {
		// shooting?
		socket.broadcast.volatile.emit('user:weapon:state', data);
	});

	socket.on('user:death', function() {
		socket.get('uid', function(err, id) {
			socket.broadcast.volatile.emit('user:death', id);
		});
	});

	socket.on('enemy:death', function(enemyId) {
		delete enemies[enemyId];
		socket.broadcast.volatile.emit('enemy:death', enemyId);
		var e = new Enemy();
		enemies[e.uid] = e;
	});
});

function getNextEnemyId() {
	var nextId = nextEnemyId++;
	if (nextId > 9000000000000000) {
		nextId = 0;
	}
}

function getNextUserId() {
	var nextId = nextUserId++;
	if (nextId > 9000000000000000) {
		nextId = 0;
	}
}


// [x] <- pos/dir/state of player
// [ ] <- pos/dir/state of all enemies
// [ ] <- enemy health
// [ ] <- user dis/connection
// [x] <- weapon pickup

// [x] -> current player pos/dir/state
// [x] -> new player (username)
// [x] -> weapon pickup
// [x] -> fire weapon
// [x] -> player death