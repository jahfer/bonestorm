/// <reference path="Bonestorm/Sprites.ts" />
/// <reference path="myLibs/Appframe.ts" />
/// <reference path="assets/AssetLoadHandler.ts" />
/// <reference path="myLibs/KeyboardController.ts" />

var socket = socket || null;

class BonestormTest extends AppFrame{
    public name:string = "BONESTORM: TEST";

    private player: PlayerSprite;
    private enemyPlayers: EnemyPlayerSprite[] = new EnemyPlayerSprite[]();
    private background: BSBackground;

    private bullets: Projectile[] = new Projectile[]();

    // Canvas
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    // LIBRARIES
    private loader: AssetLoadHandler;
    private keyboard: KeyboardController;
        public keyPressed: string = "NONE";

    public camera: CBCamera;

    // CONSTANTS
    public MAX_X: number;
    public MAX_Y: number;

    constructor (canvas: HTMLCanvasElement) {
        super(30);

        // BONESTORM
        this.setCanvas(canvas);

        this.loader = new AssetLoadHandler();
        this.keyboard = new KeyboardController();
        this.camera = new CBCamera(this.canvas.width, this.canvas.height);

        this.background = new BSBackground();
        this.background.setAssetHandler(this.loader);
        this.background.setCanvas(this.canvas);

        this.player = new PlayerSprite(this.canvas, this, this.camera);
        
        //this.enemyPlayers.push(new EnemyPlayerSprite(this.canvas, this, this.camera));
        //this.enemyPlayers[0].setPosition(100, 100);

        // SOCKETIO
        socket.emit("user:connect", "THRILLHO");
        socket.on("server:userSettings", function (data) {
            this.player.id = data.id;
            this.player.X = data.coords.x;
            this.player.Y = data.coord.y;
        });
        socket.on("user:move:pos", function (data) {
            if (typeof this.enemyPlayers[data.id] != "undefined")
                this.enemyPlayers[data.id].setPosition(data.x, data.y);
            else {
                this.enemyPlayers[data.id] = new EnemyPlayerSprite(this.canvas, this, this.camera);
                this.enemyPlayers[data.id].setPosition(data.x, data.y);
            }
        });
        socket.on("user:disconnect", function (id) {
            delete this.enemyPlayers[id];
        });

        this.start();
    }

    private addImageAsset(name:string, sprite:Sprite, src:string){
        var asset: ImageAsset = new ImageAsset("bg");
        asset.setSrc(src);
        this.loader.addAsset(asset.name, asset);
        sprite.requestAssets(["bg"]);
    }

    public initialize() {
        console.log("INITIALIZE");
        var _this = this;
        var _player = this.player;
        
        // SET LOAD PARAMS
        this.addImageAsset("bg", this.background, "img/Background/terrain_1.png");

        // LOAD
        this.loader.setCallback(function () { console.log("LOADED"); _this.onLoad(); }); //
        this.loader.load();

        // KEYBOARD
        this.keyboard.bind("up", function () { _this.keyPressed = "UP"; }, "keypress", true, function () { if(_this.keyPressed == "UP") _this.keyPressed = "NONE"; });
        this.keyboard.bind("down", function () {  _this.keyPressed = "DOWN"; }, "keypress", true, function () { if(_this.keyPressed == "DOWN") _this.keyPressed = "NONE";  });
        this.keyboard.bind("left", function () {  _this.keyPressed = "LEFT"; }, "keypress", true, function () { if(_this.keyPressed == "LEFT") _this.keyPressed = "NONE";  });
        this.keyboard.bind("right", function () {  _this.keyPressed = "RIGHT"; }, "keypress", true, function () { if(_this.keyPressed == "RIGHT") _this.keyPressed = "NONE";  });

        this.keyboard.bind("space", function () { _player.shoot(); }, "keypress", true, function () { });
    }

    public update() {
        this.player.keyPressed(this.keyPressed);
        this.player.update();

        this.camera.setPos(this.player.X - (this.canvas.width / 2), this.player.Y - (this.canvas.height / 2));

        this.background.setPos(this.player.X, this.player.Y);

        this.enemyPlayers.forEach(function (enemyPlayer, i, arr) {
            enemyPlayer.update();
        });

        for (var i in this.bullets) {
            if (this.bullets[i].hit == true) {
                delete this.bullets[i];
            }
            else {
                this.bullets[i].detectCollisions(this.enemyPlayers);
                this.bullets[i].update();
            }
        }
    }

    public draw() {
        this.clearCanvas();
        this.background.draw();
        
        //for (var i = 0; i < this.enemyPlayers.length; i++) {
        for (var i in this.enemyPlayers){
            this.enemyPlayers[i].draw();
        }

        this.player.draw();

        //for (var i = 0; i < this.bullets.length; i++) {
        for (var i in this.bullets) {
            this.bullets[i].draw();
        }
    }

    public exit() { }

    public setCanvas(canvas: HTMLCanvasElement){
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    }

    public onLoad(){
        this.MAX_X = this.background.width;
        this.MAX_Y = this.background.height;

        var limits = {minX: 100, minY: 100, maxX: this.MAX_X - 100, maxY: this.MAX_Y - 100};
        this.player.setLimits(limits);

        this.camera.setMax(this.MAX_X, this.MAX_Y);

        this.initialized = true;
    }

    public clearCanvas() {
        this.context.fillStyle = '#000';
        this.context.fillRect  (0, 0, this.canvas.width, this.canvas.height);
    }

    public addBullet(bullet: Projectile) {
        this.bullets.push(bullet);
    }

    // SOCKET RECEIVING
    public checkOtherPlayerExists(id) {
        if (this.enemyPlayers[id]) return true;
        return false;
    }

    public newOtherPlayer(id, x, y) {
        this.enemyPlayers[id] = new EnemyPlayerSprite(this.canvas, this, this.camera);
        this.enemyPlayers[id].setPosition(x, y);
    }

    public otherPlayerMoved(id, x, y) {
        this.enemyPlayers[id].setPosition(x, y);
    }

    public removeOtherPlayer(id) {
        delete this.enemyPlayers[id];
    }

    // SOCKET SEND OUT
    public onPlayerMove(func:Function) {

    }
}