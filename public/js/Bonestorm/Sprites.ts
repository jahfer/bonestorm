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

    // CONSTANTS
    private MAX_SPEED: number = 10;
    private ACCEL: number = 2;
    private DECCEL: number = 0.1;

    private LIMITS = {minX: 0, minY: 0, maxX: 0, maxY: 0};

    private BS: BonestormTest;

    constructor (canvas: HTMLCanvasElement, BS: BonestormTest, camera:CBCamera) {
        //var name = "Bonestorm: Player";
        super("Bonestorm: Player");
        console.log(this.name);
        this.setCanvas(canvas);
        
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.BS = BS;
        this.camera = camera;
    }

    public setLimits(limits){
        this.LIMITS = limits;

        return this;
    }

    public update() {
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
                this.speedX = Math.round(this.speedX * this.DECCEL);
                this.speedY = Math.round(this.speedY * this.DECCEL);
        }

        if(this.speedX < 0 && this.X > this.LIMITS.minX || this.speedX > 0 && this.X < this.LIMITS.maxX )
            this.X += this.speedX;
        else
            this.speedX = 0;

        if(this.speedY < 0 && this.Y > this.LIMITS.minY || this.speedY > 0 && this.Y < this.LIMITS.maxY )
            this.Y += this.speedY;
        else
            this.speedY = 0;

        return true;
    }

    private onMove() {
        this.dir = this.key;
        socket.emit("user:move:pos", {id:this.id, x:this.X, y:this.Y});
    }

    public drawMethod(x: number, y: number) {
        this.context.beginPath();
        this.context.arc(this.x, this.y, 40, 0, 2 * Math.PI, false);
        this.context.fillStyle = 'green';
        this.context.fill();
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
    }

    public keyPressed(key:string) {
        this.key = key;
    }

    private moveUp() {
        if (this.speedY > -this.MAX_SPEED) {
            this.speedY -= this.ACCEL;
        }
    }

    private moveDown() {
        if (this.speedY < this.MAX_SPEED) this.speedY += this.ACCEL;
    }

    private moveLeft() {
        if (this.speedX > -this.MAX_SPEED) this.speedX -= this.ACCEL;
    }

    private moveRight() {
        if (this.speedX < this.MAX_SPEED) this.speedX += this.ACCEL;
    }
}

class EnemyPlayerSprite extends SpritesheetSprite {
    public dir: string = "UP";
    public X: number = 0;
    public Y: number = 0;
    public health: number = 0;

    // CONSTANTS
    private MAXHEALTH: number = 10;
    private BS: BonestormTest;

    constructor (canvas: HTMLCanvasElement, BS: BonestormTest, camera:CBCamera) {
        //var name = "Bonestorm: Player";
        super("ENEMYPLAYER SPRITE");
        this.health = this.MAXHEALTH;
        this.setCanvas(canvas);
        this.BS = BS;
        this.camera = camera;
        this.setSize(80, 80);
        
        this.x = -100;
        this.y = -100;
    }

    public setPosition(x: number, y:number) {
        //DIRECTION
        var diffX = x - this.X;
        var diffY = y - this.Y;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX < 0) {
                this.dir = "LEFT";
            }
            else
                this.dir = "RIGHT";

        }
        else {
            if (diffY > 0) {
                this.dir = "DOWN";
            }
            else
                this.dir = "UP";
        }

        this.X = x;
        this.Y = y;
    }

    public detectHit(bullet: Projectile):bool {
        if (bullet.X > this.X && bullet.X < this.X + this.width && bullet.Y > this.Y && bullet.Y < this.Y + this.height) {
            this.health -= bullet.damage;
            console.log("PLAYER HIT");
            return true;
        }
        
        return false;
    }

    public log(b, t) {
        console.log("X: " + b + " Y:" + t);
    }

    public update() {
        this.log(this.X, this.Y);
        this.x = this.X - this.camera.x;
        this.y = this.Y - this.camera.y;
    }

    public drawMethod() {
        this.context.beginPath();
        this.context.arc(this.x+this.width/2, this.y+this.height/2, 40, 0, 2 * Math.PI, false);
        this.context.fillStyle = 'red';
        this.context.fill();
    }
}

class Projectile extends Sprite{

    public hit: bool = false;
    
    public X: number = 0;
    public Y: number = 0;

    public damage: number = 1;

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
        for (var i = 0; i < players.length; i++) {
            if (players[i].detectHit(this) == true) {
                this.hit = true;
            }
        }
    }

    public drawMethod(x:number, y:number) {
        this.context.beginPath();
        this.context.arc(this.x-this.width/2, this.y-this.width/2, this.width, this.height, 2 * Math.PI, false);
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