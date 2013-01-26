var express = require('express'),
	app = express.createServer(),
	io = require('socket.io').listen(app);

var MAX_ID_SIZE  = 9000000000000000;
var port = process.env.PORT || 5000;

var nextUserId  = 0;
var nextEnemyId = 0;

var players = [];
var enemies = [];
var weapons = [];

app.use(express.static('public'));
app.listen(port);

io.configure(function () {
	io.set('log level', 1);
});

app.get('/', function(req, res) {
	res.sendfile(__dirname + "/index.html");
});

// initialize enemies
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


// initialize weapons
var Weapon = function(name, strength) {
	this.name = name;
	this.strength = strength || 1;
};
weapons.push('shotgun', 100);


// handle sockets
io.sockets.on('connection', function (socket) {

	socket.on('user:connect', function(name){
		socket.set('nickname', name);

		var id = getNextUserId();

		players[id] = socket.id;
		console.log("Received", name, "| Sending", id);

		socket.set('uid', id);
		socket.emit('server:userId', id);
	});

	socket.on('user:hit', function(data) {
		// tell the player that was hit to update their health
		io.sockets.socket(players[data.player.id]).emit('self:hit', data);
	});

	socket.on('user:move:pos', function(data) {
		console.log('user:move:pos', data);
		// id, x, y
		socket.broadcast.volatile.emit('user:move:pos', data);
	});

	socket.on('user:move:dir', function(data) {
		// id, n-s-e-w
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
		socket.get('uid', function (err, id) {
			socket.broadcast.emit('user:death', id);
		});
	});

	socket.on('enemy:hit', function(data) {
		// enemy uid
		enemies[data.enemy.uid].health -= weapons[data.weapon].strength;

		if (enemies[data.enemy.uid].health < 0) {
			delete enemies[data.enemy.uid];
			socket.broadcast.emit('enemy:death', data.enemy.uid);
		} else {
			socket.broadcast.volatile.emit('enemy:hit', enemies[data.enemy.uid]);
		}

	});

	socket.on('enemy:death', function(enemyId) {
		delete enemies[enemyId];
		socket.broadcast.emit('enemy:death', enemyId);
		// generate new enemy
		var e = new Enemy();
		enemies[e.uid] = e;
	});
});

function getNextEnemyId() {
	var nextId = nextEnemyId++;
	if (nextId > MAX_ID_SIZE) {
		nextId = 0;
	}
	
	return nextId;
}

function getNextUserId() {
	var nextId = nextUserId++;
	if (nextId > MAX_ID_SIZE) {
		nextId = 0;
	}

	return nextId;
}


// [x] <- pos/dir/state of player
// [ ] <- pos/dir/state of all enemies
// [x] <- enemy health
// [ ] <- user dis/connection
// [x] <- weapon pickup

// [x] -> current player pos/dir/state
// [x] -> new player (username)
// [x] -> weapon pickup
// [x] -> fire weapon
// [x] -> player death