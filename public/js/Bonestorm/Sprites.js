var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BSBackground = (function (_super) {
    __extends(BSBackground, _super);
    function BSBackground() {
        _super.call(this, "Bonestorm BACKGROUND");
    }
    BSBackground.prototype.pushAsset = function (assets) {
        this.image = (assets[0].asset).image;
        this.setSize(this.image.width, this.image.height);
        _super.prototype.pushAsset.call(this, assets);
    };
    BSBackground.prototype.drawMethod = function (x, y) {
        this.context.drawImage(this.image, x + this.canvas.width / 2, y + this.canvas.height / 2, this.width, this.height);
    };
    BSBackground.prototype.setPos = function (x, y) {
        this.x = -x;
        this.y = -y;
    };
    return BSBackground;
})(Sprite);
var PlayerSprite = (function (_super) {
    __extends(PlayerSprite, _super);
    function PlayerSprite(canvas, BS, camera) {
        _super.call(this, "Bonestorm: Player");
        this.name = "";
        this.id = -1;
        this.key = "NONE";
        this.dir = "UP";
        this.X = 0;
        this.Y = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.alive = true;
        this.bulletCount = 0;
        this.health = 0;
        this.killer = "";
        this.MAX_SPEED = 10;
        this.ACCEL = 2;
        this.DECCEL = 0.1;
        this.MAX_HEALTH = 10;
        this.TIMEOUT = 5000;
        this.LIMITS = {
            minX: 0,
            minY: 0,
            maxX: 0,
            maxY: 0
        };
        this.setCanvas(canvas);
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.BS = BS;
        this.camera = camera;
        this.health = this.MAX_HEALTH;
        var _this = this;
        socket.on("self:hit", function (data) {
            _this.damagePlayer(data.damage, data.killer);
        });
    }
    PlayerSprite.prototype.damagePlayer = function (damage, killer) {
        console.log("DAMAGED PLAYER");
        this.health -= damage;
        if(this.health <= 0) {
            this.playerDies();
        }
    };
    PlayerSprite.prototype.playerDies = function () {
        this.alive = false;
        socket.emit("user:death");
        this.setCurrent(1);
        this.setCurrentAnimation("death");
        this.BS.promptDeath();
        var _this = this;
        setTimeout(function () {
            _this.playerRespawn();
        }, this.TIMEOUT);
    };
    PlayerSprite.prototype.playerRespawn = function () {
        this.alive = true;
        this.BS.clearEnemies();
        socket.emit("user:connect", "THRILLHO");
        this.health = this.MAX_HEALTH;
        this.setCurrent(0);
        this.setCurrentAnimation("idle");
        this.BS.removeDeathPrompt();
    };
    PlayerSprite.prototype.setLimits = function (limits) {
        this.LIMITS = limits;
        return this;
    };
    PlayerSprite.prototype.update = function () {
        if(this.alive == true) {
            switch(this.key) {
                case "UP": {
                    this.onMove();
                    this.moveUp();
                    this.speedX = Math.round(this.speedX * this.DECCEL);
                    break;

                }
                case "DOWN": {
                    this.onMove();
                    this.moveDown();
                    this.speedX = Math.round(this.speedX * this.DECCEL);
                    break;

                }
                case "LEFT": {
                    this.onMove();
                    this.moveLeft();
                    this.speedY = Math.round(this.speedY * this.DECCEL);
                    break;

                }
                case "RIGHT": {
                    this.onMove();
                    this.moveRight();
                    this.speedY = Math.round(this.speedY * this.DECCEL);
                    break;

                }
                default: {
                    this.setCurrentAnimation("idle");
                    this.speedX = Math.round(this.speedX * this.DECCEL);
                    this.speedY = Math.round(this.speedY * this.DECCEL);

                }
            }
            if(this.speedX < 0 && this.X > this.LIMITS.minX || this.speedX > 0 && this.X < this.LIMITS.maxX) {
                this.X += this.speedX;
            } else {
                this.speedX = 0;
            }
            if(this.speedY < 0 && this.Y > this.LIMITS.minY || this.speedY > 0 && this.Y < this.LIMITS.maxY) {
                this.Y += this.speedY;
            } else {
                this.speedY = 0;
            }
        }
        this.time++;
        return true;
    };
    PlayerSprite.prototype.onMove = function () {
        this.dir = this.key;
        socket.emit("user:move:pos", {
            id: this.id,
            x: this.X,
            y: this.Y
        });
    };
    PlayerSprite.prototype.drawMethod = function (x, y) {
        if(this.drawSprite === true && x < this.canvas.width && y < this.canvas.height && x > (-this.width) && y > (-this.height)) {
            this.context.save();
            this.context.translate(this.x, this.y);
            this.context.rotate(this.rotation);
            this.sprSheet.draw(this.context, this.currentFrame, -40, -40, 80, 80);
            this.context.restore();
        }
        if(this.time % 3 == 0) {
            this.nextFrame();
        }
    };
    PlayerSprite.prototype.shoot = function () {
        var bX = 0, bY = 0;
        if(this.dir == "DOWN") {
            bY = 1;
        } else {
            if(this.dir == "LEFT") {
                bX = -1;
            } else {
                if(this.dir == "RIGHT") {
                    bX = 1;
                } else {
                    bY = -1;
                }
            }
        }
        var temp = new Projectile(this.X, this.Y, bX, bY, this.camera, "player");
        temp.setCanvas(this.canvas);
        if(this.bulletCount != -1) {
            this.BS.addBullet(temp);
            this.bulletCount++;
        }
        if(this.bulletCount > 10) {
            this.bulletCount = -1;
            this.BS.promptReload();
        }
        socket.emit("user:weapon:shot", {
            x: temp.X,
            y: temp.Y,
            speed: temp.getSpeed(),
            range: temp.getRange()
        }, function (id) {
            temp.id = id;
        });
    };
    PlayerSprite.prototype.keyPressed = function (key) {
        if(this.key == key) {
            return;
        }
        this.key = key;
        if(this.alive && this.currentAnim != "walk") {
            this.setCurrentAnimation("walk");
        }
    };
    PlayerSprite.prototype.moveUp = function () {
        this.setRotation(0);
        if(this.speedY > -this.MAX_SPEED) {
            this.speedY -= this.ACCEL;
        }
    };
    PlayerSprite.prototype.moveDown = function () {
        this.setRotation(Math.PI);
        if(this.speedY < this.MAX_SPEED) {
            this.speedY += this.ACCEL;
        }
    };
    PlayerSprite.prototype.moveLeft = function () {
        this.setRotation(-Math.PI / 2);
        if(this.speedX > -this.MAX_SPEED) {
            this.speedX -= this.ACCEL;
        }
    };
    PlayerSprite.prototype.moveRight = function () {
        this.setRotation(Math.PI / 2);
        if(this.speedX < this.MAX_SPEED) {
            this.speedX += this.ACCEL;
        }
    };
    return PlayerSprite;
})(SpritesheetSprite);
var EnemyPlayerSprite = (function (_super) {
    __extends(EnemyPlayerSprite, _super);
    function EnemyPlayerSprite(canvas, BS, camera, id) {
        _super.call(this, "ENEMYPLAYER SPRITE");
        this.dir = "UP";
        this.X = 0;
        this.Y = 0;
        this.health = 0;
        this.alive = true;
        this.isDrawn = true;
        this.id = -1;
        this.MAXHEALTH = 10;
        this.health = this.MAXHEALTH;
        this.setCanvas(canvas);
        this.BS = BS;
        this.camera = camera;
        this.setSize(80, 80);
        this.id = id;
        this.x = -100;
        this.y = -100;
    }
    EnemyPlayerSprite.prototype.playerDied = function () {
        this.alive = false;
        this.setCurrent(1);
        this.setCurrentAnimation("death");
        var _this = this;
        setTimeout(function () {
            _this.isDrawn = false;
        }, 3000);
    };
    EnemyPlayerSprite.prototype.setPosition = function (x, y) {
        var diffX = x - this.X;
        var diffY = y - this.Y;
        if(diffX == 0 && diffY == 0) {
            this.X = x;
            this.Y = y;
            return;
        }
        if(this.alive == true && Math.abs(diffX) > Math.abs(diffY)) {
            if(diffX < 0) {
                this.dir = "LEFT";
                this.setRotation(-Math.PI / 2);
            } else {
                this.dir = "RIGHT";
                this.setRotation(Math.PI / 2);
            }
        } else {
            if(diffY > 0) {
                this.dir = "DOWN";
                this.setRotation(Math.PI);
            } else {
                this.dir = "UP";
                this.setRotation(0);
            }
        }
        this.X = x;
        this.Y = y;
    };
    EnemyPlayerSprite.prototype.detectHit = function (bullet) {
        var _this = this;
        if(bullet.X > this.X - this.width / 2 && bullet.X < this.X + this.width / 2 && bullet.Y > this.Y - this.height / 2 && bullet.Y < this.Y + this.height / 2) {
            this.health -= bullet.damage;
            console.log("PLAYER HIT");
            socket.emit("user:hit", {
                player: _this.id,
                damage: bullet.damage,
                bulletId: bullet.id
            });
            return true;
        }
        return false;
    };
    EnemyPlayerSprite.prototype.update = function () {
        this.x = this.X - this.camera.x;
        this.y = this.Y - this.camera.y;
        this.time++;
    };
    EnemyPlayerSprite.prototype.drawMethod = function (x, y) {
        if(this.drawSprite === true && x < this.canvas.width && y < this.canvas.height && x > (-this.width) && y > (-this.height)) {
            this.context.save();
            this.context.translate(this.x, this.y);
            this.context.rotate(this.rotation);
            this.sprSheet.draw(this.context, this.currentFrame, -40, -40, 80, 80);
            this.context.restore();
        }
        if(this.time % 3 == 0) {
            this.nextFrame();
        }
    };
    return EnemyPlayerSprite;
})(SpritesheetSprite);
var Projectile = (function (_super) {
    __extends(Projectile, _super);
    function Projectile(X, Y, speedX, speedY, camera, owner) {
        _super.call(this, "bullet");
        this.hit = false;
        this.X = 0;
        this.Y = 0;
        this.damage = 1;
        this.id = -1;
        this.dist = 0;
        this.owner = "player";
        this.SPEED = 30;
        this.RANGE = 520;
        this.setSize(2, 2);
        this.X = X;
        this.Y = Y;
        this.speedX = speedX * this.SPEED;
        this.speedY = speedY * this.SPEED;
        this.camera = camera;
    }
    Projectile.prototype.getSpeed = function () {
        var tempX = (this.speedX == 0) ? 0 : ((this.speedX > 0) ? 1 : -1);
        var tempY = (this.speedY == 0) ? 0 : ((this.speedY > 0) ? 1 : -1);
        return {
            x: tempX,
            y: tempY
        };
    };
    Projectile.prototype.getRange = function () {
        return this.RANGE;
    };
    Projectile.prototype.update = function () {
        this.x = this.X - this.camera.x;
        this.y = this.Y - this.camera.y;
        this.X += this.speedX;
        this.Y += this.speedY;
        this.dist += this.SPEED;
        if(this.dist > this.RANGE || (this.X < 0 || this.X > this.camera.maxX || this.Y < 0 || this.Y > this.camera.maxY)) {
            this.hit = true;
        }
    };
    Projectile.prototype.detectCollisions = function (players) {
        for(var i in players) {
            if(players[i].detectHit(this) == true) {
                this.hit = true;
            }
        }
    };
    Projectile.prototype.drawMethod = function (x, y) {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.width, this.height, 2 * Math.PI, false);
        this.context.fillStyle = 'yellow';
        this.context.fill();
    };
    return Projectile;
})(Sprite);
var TextSprite = (function (_super) {
    __extends(TextSprite, _super);
    function TextSprite(color, font) {
        _super.call(this, "TEXT SPRITE");
        this.text = "";
        this.color = "black";
        this.font = '40pt Calibri';
        if(color) {
            this.color = color;
        }
        if(font) {
            this.font = font;
        }
    }
    TextSprite.prototype.setText = function (text) {
        this.text = text;
    };
    TextSprite.prototype.update = function () {
    };
    TextSprite.prototype.drawMethod = function (x, y) {
        this.context.font = this.font;
        this.context.fillStyle = this.color;
        this.context.fillText(this.text, x, y);
    };
    return TextSprite;
})(Sprite);
//@ sourceMappingURL=Sprites.js.map
