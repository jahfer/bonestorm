var express = require('express'),
	app = express.createServer(),
	io = require('socket.io').listen(app);

var MAX_ID_SIZE  = 9000000000000000;
var port = process.env.PORT || 5000;

var WIN_SIZE = 3600;

var nextUserId  = 0;
var nextEnemyId = 0;
var nextBulletId = 0;
var nextGridUnit = 0;

var players = [];
var enemies = [];
var weapons = [];
var districts = [
	{x:0, y:0},
	{x:2400, y:2400},
	{x:0, y:2400},
	{x:2400, y:0},
	{x:0, y:1200},
	{x:2400, y:1200},
	{x:1200, y:2400},
	{x:1200, y:0},
	{x:1200, y:1200}
];

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
	this.speed = {
		x: (10 * Math.random()) - 5, // -5 to 5
		y: (10 * Math.random()) - 5  // -5 to 5
	};
};

Enemy.prototype.update = function() {
	this.x += this.speed.x;
	this.y += this.speed.y;
	if (this.x > WIN_SIZE) this.x = 0;
	if (this.y > WIN_SIZE) this.y = 0;

	// only send data for enemies in range...
	io.sockets.emit('enemy:move:pos', {id: this.uid, x: this.x, y: this.y});
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
weapons.push('pistol', 100);


var Coords = function() {

	var dIndex;

	if (nextGridUnit >= 9) dIndex = parseInt(Math.random() * 8, 10);
	else dIndex = nextGridUnit++;

	var district = districts[dIndex];

	this.x = parseInt(Math.random() * 600, 10) + district.x + 300; // center of each district
	this.y = parseInt(Math.random() * 600, 10) + district.y + 300;
};


// handle sockets
io.sockets.on('connection', function (socket) {

	socket.on('user:connect', function(name){
		socket.set('nickname', name);

		var out = {
			id: getNextUserId(),
			coords: new Coords()
		};

		console.log("Received", name, "| Sending", out.id);

		socket.set('uid', out.id);
		socket.emit('server:userSettings', out);

		players.forEach(function (player, index, array) {
			socket.emit('user:move:pos', {id: player.uid, x: player.coords.x, y: player.coords.y});
		});

		players[out.id] = {
			uid: out.id,
			socketid: socket.id,
			coords: out.coords
		};
	});

	socket.on('user:hit', function(data) {
		// tell the player that was hit to update their health
		console.log("user:hit", data);
		if (typeof data.player != "undefined" && typeof players[data.player] != "undefined") {
			var sid = players[data.player].socketid;
			/*{ damage: #, killer: # }*/
			socket.get('uid', function (err, id) {
				console.log("self:hit", id);
				io.sockets.socket(players[data.player].socketid).emit('self:hit', {damage: data.damage, killer: id});
			});

			socket.broadcast.emit('weapon:hit', data.bulletId);
		}
	});

	// hits a wall
	socket.on('weapon:hit', function(id) {
		socket.broadcast.emit('weapon:hit', id);
	});

	socket.on('user:move:pos', function(data) {
		// id, x, y
		if (data.x < 0) data.x = 0;
		if (data.x > WIN_SIZE) data.x = WIN_SIZE;
		if (data.y < 0) data.y = 0;
		if (data.y > WIN_SIZE) data.y = WIN_SIZE;

		console.log('user:move:pos', data);

		if (typeof players[data.id] != "undefined")
			players[data.id].coords = {x: data.x, y: data.y};

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

	socket.on('user:weapon:shot', function(data, fn) {
		// SHOTS FIRED!!!
		/* data = {x:#, y:#, speed:{x:#, y:#}, range:#} */

		var bulletId = getNextBulletId();

		if (typeof fn != "undefined")
			fn(bulletId);

		data.id = bulletId;
		socket.broadcast.volatile.emit('user:weapon:shot', data);
	});

	socket.on('user:death', function() {
		socket.get('uid', function (err, id) {
			delete players[id];
			socket.broadcast.emit('user:death', id);
		});
	});

	socket.on('enemy:hit', function(data) {
		// enemy uid
		if (typeof enemies[data.enemy.uid] != "undefined" && typeof weapons[data.weapon] != "undefined")
			enemies[data.enemy.uid].health -= weapons[data.weapon].strength;

		if (typeof enemies[data.enemy.uid] != "undefined")
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

	socket.on('disconnect', function() {
		socket.get('uid', function (err, id) {
			console.log("User " + id + " disconnected");
			delete players[id];
			socket.broadcast.emit('user:disconnect', id);
		});
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

function getNextBulletId() {
	var nextId = nextBulletId++;
	if (nextId > MAX_ID_SIZE) {
		nextId = 0;
	}

	return nextId;
}