var COM = (function() {

	this.sock = io.connect('http://localhost');
	this.sock.emit('user:connect', nickname);
	this.sock.on('server:userSettings', this.initUserSettings);
	
	this.sock.on('user:disconnect', this.onUserDisconnect);
	this.sock.on('user:move:pos', this.onUserMove);

}());

COM.prototype.initUserSettings = function (data) {
	/* data = { id:#, coords: {x:#, y:#} } */
};

COM.prototype.onUserMove = function (data) {
	/* data = {id:#, x:#, y:#} */
};

COM.prototype.onUserDisconnect = function (id) {
	/* data = # */

	// delete players[id]
};

