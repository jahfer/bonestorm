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
        this.MAX_SPEED = 10;
        this.ACCEL = 2;
        this.DECCEL = 0.1;
        this.LIMITS = {
            minX: 0,
            minY: 0,
            maxX: 0,
            maxY: 0
        };
        console.log(this.name);
        this.setCanvas(canvas);
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.BS = BS;
        this.camera = camera;
    }
    PlayerSprite.prototype.setLimits = function (limits) {
        this.LIMITS = limits;
        return this;
    };
    PlayerSprite.prototype.update = function () {
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
        this.context.beginPath();
        this.context.arc(this.x, this.y, 40, 0, 2 * Math.PI, false);
        this.context.fillStyle = 'green';
        this.context.fill();
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
        this.BS.addBullet(temp);
    };
    PlayerSprite.prototype.keyPressed = function (key) {
        this.key = key;
    };
    PlayerSprite.prototype.moveUp = function () {
        if(this.speedY > -this.MAX_SPEED) {
            this.speedY -= this.ACCEL;
        }
    };
    PlayerSprite.prototype.moveDown = function () {
        if(this.speedY < this.MAX_SPEED) {
            this.speedY += this.ACCEL;
        }
    };
    PlayerSprite.prototype.moveLeft = function () {
        if(this.speedX > -this.MAX_SPEED) {
            this.speedX -= this.ACCEL;
        }
    };
    PlayerSprite.prototype.moveRight = function () {
        if(this.speedX < this.MAX_SPEED) {
            this.speedX += this.ACCEL;
        }
    };
    return PlayerSprite;
})(SpritesheetSprite);
var EnemyPlayerSprite = (function (_super) {
    __extends(EnemyPlayerSprite, _super);
    function EnemyPlayerSprite(canvas, BS, camera) {
        _super.call(this, "ENEMYPLAYER SPRITE");
        this.dir = "UP";
        this.X = 0;
        this.Y = 0;
        this.health = 0;
        this.MAXHEALTH = 10;
        this.health = this.MAXHEALTH;
        this.setCanvas(canvas);
        this.BS = BS;
        this.camera = camera;
        this.setSize(80, 80);
        this.x = -100;
        this.y = -100;
    }
    EnemyPlayerSprite.prototype.setPosition = function (x, y) {
        var diffX = x - this.X;
        var diffY = y - this.Y;
        if(Math.abs(diffX) > Math.abs(diffY)) {
            if(diffX < 0) {
                this.dir = "LEFT";
            } else {
                this.dir = "RIGHT";
            }
        } else {
            if(diffY > 0) {
                this.dir = "DOWN";
            } else {
                this.dir = "UP";
            }
        }
        this.X = x;
        this.Y = y;
    };
    EnemyPlayerSprite.prototype.detectHit = function (bullet) {
        if(bullet.X > this.X && bullet.X < this.X + this.width && bullet.Y > this.Y && bullet.Y < this.Y + this.height) {
            this.health -= bullet.damage;
            console.log("PLAYER HIT");
            return true;
        }
        return false;
    };
    EnemyPlayerSprite.prototype.log = function (b, t) {
        console.log("X: " + b + " Y:" + t);
    };
    EnemyPlayerSprite.prototype.update = function () {
        this.log(this.X, this.Y);
        this.x = this.X - this.camera.x;
        this.y = this.Y - this.camera.y;
    };
    EnemyPlayerSprite.prototype.drawMethod = function () {
        this.context.beginPath();
        this.context.arc(this.x + this.width / 2, this.y + this.height / 2, 40, 0, 2 * Math.PI, false);
        this.context.fillStyle = 'red';
        this.context.fill();
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
        this.dist = 0;
        this.owner = "player";
        this.SPEED = 20;
        this.RANGE = 500;
        this.setSize(2, 2);
        this.X = X;
        this.Y = Y;
        this.speedX = speedX * this.SPEED;
        this.speedY = speedY * this.SPEED;
        this.camera = camera;
    }
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
        for(var i = 0; i < players.length; i++) {
            if(players[i].detectHit(this) == true) {
                this.hit = true;
            }
        }
    };
    Projectile.prototype.drawMethod = function (x, y) {
        this.context.beginPath();
        this.context.arc(this.x - this.width / 2, this.y - this.width / 2, this.width, this.height, 2 * Math.PI, false);
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
