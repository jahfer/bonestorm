/// <reference path="../assets/SpritesheetSprite.ts" />

class BSBackground extends Sprite {
    private image: HTMLImageElement;

    constructor () {
        super("Bonestorm BACKGROUND");
    }
    
    public pushAsset(assets:AssetContainer[]){
        this.image = (<ImageAsset> assets[0].asset).image;
        this.setSize(this.image.width, this.image.height);
        super.pushAsset(assets);
    }

    public drawMethod(x: number, y:number){
        this.context.drawImage(this.image, x+this.canvas.width/2, y+this.canvas.height/2, this.width, this.height);
    }

    public setPos(x: number, y: number) {
        this.x = -x;
        this.y = -y;
    }
}

class PlayerSprite extends SpritesheetSprite{

    public name: string = "";
    public id: number = -1;
    public key: string = "NONE";
    public dir: string = "UP";
    public X: number = 0;
    public Y: number = 0;
    
    private speedX: number = 0;
    private speedY: number = 0;
    private alive: bool = true;

    public health: number = 0;
    public killer: string = "";

    // CONSTANTS
    private MAX_SPEED: number = 10;
    private ACCEL: number = 2;
    private DECCEL: number = 0.1;
    private MAX_HEALTH: number = 10;
    private TIMEOUT: number = 5000;

    private LIMITS = {minX: 0, minY: 0, maxX: 0, maxY: 0};

    private BS: Bonestorm;

    constructor (canvas: HTMLCanvasElement, BS: Bonestorm, camera:CBCamera) {
        //var name = "Bonestorm: Player";
        super("Bonestorm: Player");
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

    public damagePlayer(damage: number, killer: string) {
        console.log("DAMAGED PLAYER");
        this.health -= damage;

        if (this.health <= 0) {
            this.playerDies();
        }
    }

    private playerDies() {
        this.alive = false;
        socket.emit("user:death");
        console.log("DEAD PLAYER");


        // DEATH ANIMS


        // DEATH FUNCTIONS
        var _this = this;
        setTimeout(function () { _this.playerRespawn(); }, this.TIMEOUT);
    }

    public playerRespawn() {
        this.alive = true;
        this.BS.clearEnemies();
        socket.emit("user:connect", "THRILLHO");
        this.health = this.MAX_HEALTH;
    }

    public setLimits(limits){
        this.LIMITS = limits;

        return this;
    }

    public update() {
        if (this.alive == true) {
            switch (this.key) {
                case "UP":
                    this.onMove();
                    this.moveUp();
                    this.speedX = Math.round(this.speedX * this.DECCEL);
                    break;
                case "DOWN":
                    this.onMove();
                    this.moveDown();
                    this.speedX = Math.round(this.speedX * this.DECCEL);
                    break;
                case "LEFT":
                    this.onMove();
                    this.moveLeft();
                    this.speedY = Math.round(this.speedY * this.DECCEL);
                    break;
                case "RIGHT":
                    this.onMove();
                    this.moveRight();
                    this.speedY = Math.round(this.speedY * this.DECCEL);
                    break;

                default:
                    this.setCurrentAnimation("idle");
                    this.speedX = Math.round(this.speedX * this.DECCEL);
                    this.speedY = Math.round(this.speedY * this.DECCEL);
            }

            if (this.speedX < 0 && this.X > this.LIMITS.minX || this.speedX > 0 && this.X < this.LIMITS.maxX)
                this.X += this.speedX;
            else
                this.speedX = 0;

            if (this.speedY < 0 && this.Y > this.LIMITS.minY || this.speedY > 0 && this.Y < this.LIMITS.maxY)
                this.Y += this.speedY;
            else
                this.speedY = 0;
        }

        //console.log(this.currentFrame);
        this.time++;

        return true;
    }

    private onMove() {
        this.dir = this.key;
        socket.emit("user:move:pos", {id:this.id, x:this.X, y:this.Y});
    }

    /*public drawMethod(x: number, y: number) {
        this.context.beginPath();
        this.context.arc(this.x, this.y, 40, 0, 2 * Math.PI, false);
        this.context.fillStyle = 'green';
        this.context.fill();
    }*/
    public drawMethod(x: number, y:number){
        //this.sprSheet.draw(this.context, this.currentFrame, this.x-40, this.y-40, 80, 80);
        if (this.alive && this.drawSprite === true && x < this.canvas.width && y < this.canvas.height && x > (-this.width) && y > (-this.height)) {
            this.context.save();
            this.context.translate(this.x, this.y);
            this.context.rotate(this.rotation);
            this.sprSheet.draw(this.context, this.currentFrame, -40, -40, 80, 80);
            this.context.restore();
        }
        if(this.time%3 == 0)
            this.nextFrame();
    }

    public shoot() {
        var bX = 0, bY = 0;
        if (this.dir == "DOWN") {
            bY = 1;
        }
        else if (this.dir == "LEFT") {
            bX = -1;
        }
        else if (this.dir == "RIGHT") {
            bX = 1;
        }
        else{ //"UP"
            bY = -1;
        }
        var temp = new Projectile(this.X, this.Y, bX, bY, this.camera, "player");
        temp.setCanvas(this.canvas);
        this.BS.addBullet(temp);

        socket.emit("user:weapon:shot", { x: temp.X, y: temp.Y, speed: temp.getSpeed(), range: temp.getRange() }, function (id) { temp.id = id; });
    }

    public keyPressed(key:string) {
        this.key = key;
        if(this.currentAnim != "walk")
            this.setCurrentAnimation("walk");
    }

    private moveUp() {
        this.setRotation(0);
        if (this.speedY > -this.MAX_SPEED) {
            this.speedY -= this.ACCEL;
        }
    }

    private moveDown() {
        this.setRotation(Math.PI);
        if (this.speedY < this.MAX_SPEED) this.speedY += this.ACCEL;
    }

    private moveLeft() {
        this.setRotation(-Math.PI/2);
        if (this.speedX > -this.MAX_SPEED) this.speedX -= this.ACCEL;
    }

    private moveRight() {
        this.setRotation(Math.PI/2);
        if (this.speedX < this.MAX_SPEED) this.speedX += this.ACCEL;
    }
}

class EnemyPlayerSprite extends SpritesheetSprite {
    public dir: string = "UP";
    public X: number = 0;
    public Y: number = 0;
    public health: number = 0;

    public id: number = -1;

    // CONSTANTS
    private MAXHEALTH: number = 10;
    private BS: Bonestorm;

    constructor (canvas: HTMLCanvasElement, BS: Bonestorm, camera:CBCamera, id:number) {
        //var name = "Bonestorm: Player";
        super("ENEMYPLAYER SPRITE");
        this.health = this.MAXHEALTH;
        this.setCanvas(canvas);
        this.BS = BS;
        this.camera = camera;
        this.setSize(80, 80);
        this.id = id;
        
        this.x = -100;
        this.y = -100;
    }

    public setPosition(x: number, y:number) {
        //DIRECTION
        var diffX = x - this.X;
        var diffY = y - this.Y;
        if (diffX == 0 && diffY == 0) {
            this.X = x;
            this.Y = y;
            //this.setCurrentAnimation("idle");
            return;
        }
        //if(this.currentAnim != "walk")
        //    this.setCurrentAnimation("walk");

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX < 0) {
                this.dir = "LEFT";
                this.setRotation(-Math.PI / 2);
            }
            else {
                this.dir = "RIGHT";
                this.setRotation(Math.PI / 2);
            }

        }
        else {
            if (diffY > 0) {
                this.dir = "DOWN";
                this.setRotation(Math.PI);
            }
            else {
                this.dir = "UP";
                this.setRotation(0);
            }
        }

        this.X = x;
        this.Y = y;
    }

    public detectHit(bullet: Projectile):bool {
        var _this = this;
        if (bullet.X > this.X-this.width/2 && bullet.X < this.X + this.width/2 && bullet.Y > this.Y-this.height/2 && bullet.Y < this.Y + this.height/2) {
            this.health -= bullet.damage;
            console.log("PLAYER HIT");
            socket.emit("user:hit", {player:_this.id, damage: bullet.damage, bulletId:bullet.id});
            return true;
        }
        
        return false;
    }

    public update() {
        this.x = this.X - this.camera.x;
        this.y = this.Y - this.camera.y;
        this.time++;
    }

    public drawMethod(x, y) {
        /*this.context.beginPath();
        this.context.arc(this.x, this.y, 40, 0, 2 * Math.PI, false);
        this.context.fillStyle = 'red';
        this.context.fill();
        this.context.closePath();*/

        if (this.drawSprite === true && x < this.canvas.width && y < this.canvas.height && x > (-this.width) && y > (-this.height)) {
            this.context.save();
            this.context.translate(this.x, this.y);
            this.context.rotate(this.rotation);
            this.sprSheet.draw(this.context, this.currentFrame, -40, -40, 80, 80);
            this.context.restore();
        }

        if(this.time%3 == 0)
            this.nextFrame();
    }
}

class Projectile extends Sprite{

    public hit: bool = false;
    
    public X: number = 0;
    public Y: number = 0;

    public damage: number = 1;

    public id: number = -1;

    private speedX: number;
    private speedY: number;
    
    private dist: number = 0;

    private owner: string = "player";

    //CONSTANT
    private SPEED: number = 20;
    private RANGE: number = 500;

    constructor (X:number, Y:number, speedX:number, speedY:number, camera:CBCamera, owner:string) {
        super("bullet");
        this.setSize(2, 2);
        
        this.X = X;
        this.Y = Y;

        this.speedX = speedX * this.SPEED;
        this.speedY = speedY * this.SPEED;
        this.camera = camera;
    }

    public getSpeed() {
        var tempX = (this.speedX == 0) ? 0 : ((this.speedX > 0) ? 1 : -1);
        var tempY = (this.speedY == 0) ? 0 : ((this.speedY > 0) ? 1 : -1);

        return {x: tempX, y: tempY};
    }

    public getRange() {
        return this.RANGE;
    }

    public update() {
        this.x = this.X - this.camera.x;
        this.y = this.Y - this.camera.y;

        this.X += this.speedX;
        this.Y += this.speedY;

        this.dist += this.SPEED;

        if (this.dist > this.RANGE || (this.X < 0 || this.X > this.camera.maxX || this.Y < 0 || this.Y > this.camera.maxY)) {
            this.hit = true;
        }
    }

    public detectCollisions(players: EnemyPlayerSprite[]) {
        //for (var i = 0; i < players.length; i++) {
        for (var i in players) {
            if (players[i].detectHit(this) == true) {
                this.hit = true;
            }
        }
    }

    public drawMethod(x:number, y:number) {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.width, this.height, 2 * Math.PI, false);
        this.context.fillStyle = 'yellow';
        this.context.fill();
    }
}

class TextSprite extends Sprite{
    private text: string = "";
    private color: string = "black";
    private font: string = '40pt Calibri';
    
    constructor (color?:string, font?:string) {
        super("TEXT SPRITE");

        if (color) { this.color = color; }
        if (font) { this.font = font; }
    }

    public setText(text: string) {
        this.text = text;
    }

    public update() { }

    public drawMethod(x: number, y: number) {
        this.context.font = this.font;
        this.context.fillStyle = this.color;
        this.context.fillText(this.text, x, y);
    }
}