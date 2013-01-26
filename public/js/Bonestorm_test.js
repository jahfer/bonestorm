var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var socket = socket || null;
var BonestormTest = (function (_super) {
    __extends(BonestormTest, _super);
    function BonestormTest(canvas) {
        _super.call(this, 30);
        this.name = "BONESTORM: TEST";
        this.enemyPlayers = new Array();
        this.bullets = new Array();
        this.keyPressed = "NONE";
        this.setCanvas(canvas);
        this.loader = new AssetLoadHandler();
        this.keyboard = new KeyboardController();
        this.camera = new CBCamera(this.canvas.width, this.canvas.height);
        this.background = new BSBackground();
        this.background.setAssetHandler(this.loader);
        this.background.setCanvas(this.canvas);
        this.player = new PlayerSprite(this.canvas, this, this.camera);
        var _this = this;
        socket.emit("user:connect", "THRILLHO");
        socket.on("server:userSettings", function (data) {
            console.log(data);
            _this.player.id = data.id;
            _this.player.X = data.coords.x;
            _this.player.Y = data.coord.y;
        });
        socket.on("user:move:pos", function (data) {
            console.log(data);
            if(typeof _this.enemyPlayers[data.id] != "undefined") {
                _this.enemyPlayers[data.id].setPosition(data.x, data.y);
            } else {
                _this.enemyPlayers[data.id] = new EnemyPlayerSprite(_this.canvas, _this, _this.camera);
                _this.enemyPlayers[data.id].setPosition(data.x, data.y);
            }
        });
        socket.on("user:disconnect", function (id) {
            console.log(id);
            delete _this.enemyPlayers[id];
        });
        this.start();
    }
    BonestormTest.prototype.addImageAsset = function (name, sprite, src) {
        var asset = new ImageAsset("bg");
        asset.setSrc(src);
        this.loader.addAsset(asset.name, asset);
        sprite.requestAssets([
            "bg"
        ]);
    };
    BonestormTest.prototype.initialize = function () {
        console.log("INITIALIZE");
        var _this = this;
        var _player = this.player;
        this.addImageAsset("bg", this.background, "img/Background/terrain_1.png");
        this.loader.setCallback(function () {
            console.log("LOADED");
            _this.onLoad();
        });
        this.loader.load();
        this.keyboard.bind("up", function () {
            _this.keyPressed = "UP";
        }, "keypress", true, function () {
            if(_this.keyPressed == "UP") {
                _this.keyPressed = "NONE";
            }
        });
        this.keyboard.bind("down", function () {
            _this.keyPressed = "DOWN";
        }, "keypress", true, function () {
            if(_this.keyPressed == "DOWN") {
                _this.keyPressed = "NONE";
            }
        });
        this.keyboard.bind("left", function () {
            _this.keyPressed = "LEFT";
        }, "keypress", true, function () {
            if(_this.keyPressed == "LEFT") {
                _this.keyPressed = "NONE";
            }
        });
        this.keyboard.bind("right", function () {
            _this.keyPressed = "RIGHT";
        }, "keypress", true, function () {
            if(_this.keyPressed == "RIGHT") {
                _this.keyPressed = "NONE";
            }
        });
        this.keyboard.bind("space", function () {
            _player.shoot();
        }, "keypress", true, function () {
        });
    };
    BonestormTest.prototype.update = function () {
        this.player.keyPressed(this.keyPressed);
        this.player.update();
        this.camera.setPos(this.player.X - (this.canvas.width / 2), this.player.Y - (this.canvas.height / 2));
        this.background.setPos(this.player.X, this.player.Y);
        this.enemyPlayers.forEach(function (enemyPlayer, i, arr) {
            enemyPlayer.update();
        });
        for(var i in this.bullets) {
            if(this.bullets[i].hit == true) {
                delete this.bullets[i];
            } else {
                this.bullets[i].detectCollisions(this.enemyPlayers);
                this.bullets[i].update();
            }
        }
    };
    BonestormTest.prototype.draw = function () {
        this.clearCanvas();
        this.background.draw();
        for(var i in this.enemyPlayers) {
            this.enemyPlayers[i].draw();
        }
        this.player.draw();
        for(var i in this.bullets) {
            this.bullets[i].draw();
        }
    };
    BonestormTest.prototype.exit = function () {
    };
    BonestormTest.prototype.setCanvas = function (canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    };
    BonestormTest.prototype.onLoad = function () {
        this.MAX_X = this.background.width;
        this.MAX_Y = this.background.height;
        var limits = {
            minX: 100,
            minY: 100,
            maxX: this.MAX_X - 100,
            maxY: this.MAX_Y - 100
        };
        this.player.setLimits(limits);
        this.camera.setMax(this.MAX_X, this.MAX_Y);
        this.initialized = true;
    };
    BonestormTest.prototype.clearCanvas = function () {
        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
    BonestormTest.prototype.addBullet = function (bullet) {
        this.bullets.push(bullet);
    };
    BonestormTest.prototype.checkOtherPlayerExists = function (id) {
        if(this.enemyPlayers[id]) {
            return true;
        }
        return false;
    };
    BonestormTest.prototype.newOtherPlayer = function (id, x, y) {
        this.enemyPlayers[id] = new EnemyPlayerSprite(this.canvas, this, this.camera);
        this.enemyPlayers[id].setPosition(x, y);
    };
    BonestormTest.prototype.otherPlayerMoved = function (id, x, y) {
        this.enemyPlayers[id].setPosition(x, y);
    };
    BonestormTest.prototype.removeOtherPlayer = function (id) {
        delete this.enemyPlayers[id];
    };
    BonestormTest.prototype.onPlayerMove = function (func) {
    };
    return BonestormTest;
})(AppFrame);
//@ sourceMappingURL=Bonestorm_test.js.map
