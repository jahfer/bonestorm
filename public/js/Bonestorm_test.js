var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var socket = socket || null;
var Bonestorm = (function (_super) {
    __extends(Bonestorm, _super);
    function Bonestorm(canvas) {
        _super.call(this, 30);
        this.name = "BONESTORM: TEST";
        this.enemyPlayers = new Array();
        this.bullets = new Array();
        this.opponentBullets = new Array();
        this.time = 0;
        this.score = 0;
        this.keyPressed = "NONE";
        this.setCanvas(canvas);
        this.loader = new AssetLoadHandler();
        this.keyboard = new KeyboardController();
        this.camera = new CBCamera(this.canvas.width, this.canvas.height);
        this.background = new BSBackground();
        this.background.setAssetHandler(this.loader);
        this.background.setCanvas(this.canvas);
        this.pipes = new BSBackground();
        this.pipes.setAssetHandler(this.loader);
        this.pipes.setCanvas(this.canvas);
        this.player = new PlayerSprite(this.canvas, this, this.camera);
        this.initSocket();
        this.start();
    }
    Bonestorm.prototype.initSocket = function () {
        var _this = this;
        socket.emit("user:connect", "THRILLHO");
        socket.on("server:userSettings", function (data) {
            console.log("PLAYER SPAWNED");
            _this.player.id = data.id;
            _this.player.X = data.coords.x;
            _this.player.Y = data.coords.y;
        });
        socket.on("user:move:pos", function (data) {
            if(typeof _this.enemyPlayers[data.id] != "undefined") {
                _this.enemyPlayers[data.id].setPosition(data.x, data.y);
            } else {
                console.log("OPPONENT SPAWNED");
                _this.enemyPlayers[data.id] = new EnemyPlayerSprite(_this.canvas, _this, _this.camera, data.id);
                _this.enemyPlayers[data.id].setPosition(data.x, data.y);
                _this.enemyPlayers[data.id].setAssetHandler(_this.loader);
                _this.enemyPlayers[data.id].requestAssets([
                    "player", 
                    "splatter"
                ]);
            }
        });
        socket.on("user:disconnect", function (id) {
            delete _this.enemyPlayers[id];
        });
        socket.on("user:weapon:shot", function (data) {
            var temp = new Projectile(data.x, data.y, data.speed.x, data.speed.y, _this.camera, "opponent");
            temp.setCanvas(_this.canvas);
            _this.opponentBullets[data.id] = temp;
        });
        socket.on("user:death", function (id) {
            _this.enemyPlayers[id].playerDied();
        });
        socket.on("weapon:hit", function (id) {
            delete _this.opponentBullets[id];
        });
    };
    Bonestorm.prototype.addImageAsset = function (name, sprite, src) {
        var asset = new ImageAsset(name);
        asset.setSrc(src);
        this.loader.addAsset(asset.name, asset);
        sprite.requestAssets([
            name
        ]);
    };
    Bonestorm.prototype.addSpritesheetAsset = function (name, sprite, src, frameInit, animInit) {
        var asset = new SpriteSheet(name);
        asset.setSrc(src);
        asset.init(frameInit.width, frameInit.height, frameInit.padX, frameInit.padY);
        for(var i in animInit) {
            if(typeof animInit[i].callback !== "undefined") {
                animInit[i].callback = function () {
                };
            }
            asset.setAnimation(animInit[i].name, animInit[i].start, animInit[i].end, animInit[i].reversed, animInit[i].repeat, animInit[i].callback);
        }
        this.loader.addAsset(name, asset);
        sprite.setAssetHandler(this.loader);
    };
    Bonestorm.prototype.initialize = function () {
        console.log("INITIALIZE");
        var _this = this;
        var _player = this.player;
        this.addImageAsset("bg", this.background, "img/Background/terrain_1.png");
        this.addImageAsset("pipes", this.pipes, "img/Background/Pipes_Layer.png");
        var init = {
            width: 80,
            height: 80,
            padX: 0,
            padY: 0
        };
        var animInit = [
            {
                name: "idle",
                start: 0,
                end: 0
            }, 
            {
                name: "walk",
                start: 1,
                end: 8
            }
        ];
        this.addSpritesheetAsset("player", this.player, "img/WalkCycles/blue_player.png", init, animInit);
        var init2 = {
            width: 80,
            height: 80,
            padX: 0,
            padY: 0
        };
        var animInit2 = [
            {
                name: "hit",
                start: 0,
                end: 4,
                reversed: false,
                repeat: false
            }, 
            {
                name: "death",
                start: 5,
                end: 11,
                reversed: false,
                repeat: false
            }
        ];
        this.addSpritesheetAsset("splatter", this.player, "img/Splatters/splatter_1_2.png", init2, animInit2);
        this.player.requestAssets([
            "player", 
            "splatter"
        ]);
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
        this.keyboard.bind("r", function () {
            _this.displayReloadPrompt = false;
            _player.bulletCount = 0;
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
    Bonestorm.prototype.update = function () {
        this.player.keyPressed(this.keyPressed);
        this.player.update();
        this.camera.setPos(this.player.X - (this.canvas.width / 2), this.player.Y - (this.canvas.height / 2));
        this.background.setPos(this.player.X, this.player.Y);
        this.pipes.setPos(this.player.X, this.player.Y);
        this.enemyPlayers.forEach(function (enemyPlayer, i, arr) {
            enemyPlayer.update();
        });
        for(var i in this.bullets) {
            if(this.bullets[i].hit == true) {
                socket.emit("weapon:hit", this.bullets[i].id);
                delete this.bullets[i];
            } else {
                this.bullets[i].detectCollisions(this.enemyPlayers);
                this.bullets[i].update();
            }
        }
        for(var i in this.opponentBullets) {
            this.opponentBullets[i].update();
        }
        this.time++;
    };
    Bonestorm.prototype.draw = function () {
        this.clearCanvas();
        this.background.draw();
        for(var i in this.enemyPlayers) {
            this.enemyPlayers[i].draw();
        }
        this.player.draw();
        for(var i in this.bullets) {
            this.bullets[i].draw();
        }
        for(var i in this.opponentBullets) {
            this.opponentBullets[i].draw();
        }

        this.pipes.draw();

        this.context.save();
        this.context.fillStyle = "#000";
        this.context.fillRect(25, 25, 200, 20);
        this.context.fillStyle = "#D00";
        this.context.fillRect(26, 26, this.player.health * 20 - 2, 18);
        if(typeof this.displayDeathPrompt != "undefined" && this.displayDeathPrompt) {
            this.context.fillStyle = "rgba(0, 0, 0, 0.3)";
            this.context.fillRect(0, 0, 600, 600);
            this.context.fillStyle = "#F00";
            this.context.font = "30px Courier";
            this.context.fillText("YOU DIED!", 220, 250);
        } else {
            this.context.save();
            if(this.player.health > 0 && this.player.health < this.player.MAX_HEALTH) {
                var sinVal = (Math.sin((this.time / this.player.health) / 2) + 1) / 2;
                var opacity = sinVal * (1 - this.player.health / this.player.MAX_HEALTH) / 2 + 0.001;
                console.log(opacity);
                this.context.fillStyle = "rgba(255, 0, 0, " + opacity + ")";
                this.context.fillRect(0, 0, 600, 600);
            }
            this.context.restore();
            if(typeof this.displayReloadPrompt != "undefined" && this.displayReloadPrompt) {
                this.context.fillStyle = "#FFF";
                this.context.font = "30px Courier";
                this.context.fillText("Press 'R' to Reload", 120, 250);
            }
        }
        this.context.fillStyle = "#FFF";
        this.context.font = "20px Courier New";
        this.context.fillText("Hearts Broken: " + this.score, 360, 40);
        this.context.restore();
    };
    Bonestorm.prototype.exit = function () {
    };
    Bonestorm.prototype.promptReload = function () {
        this.displayReloadPrompt = true;
    };
    Bonestorm.prototype.promptDeath = function () {
        this.displayDeathPrompt = true;
    };
    Bonestorm.prototype.removeDeathPrompt = function () {
        this.displayDeathPrompt = false;
    };
    Bonestorm.prototype.setCanvas = function (canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    };
    Bonestorm.prototype.onLoad = function () {
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
    Bonestorm.prototype.clearEnemies = function () {
        this.enemyPlayers.slice(0);
    };
    Bonestorm.prototype.clearCanvas = function () {
        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
    Bonestorm.prototype.addBullet = function (bullet) {
        this.bullets.push(bullet);
    };
    return Bonestorm;
})(AppFrame);
//@ sourceMappingURL=Bonestorm_test.js.map
