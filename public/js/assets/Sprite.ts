/// <reference path="Asset.ts" />
/// <reference path="AssetLoadHandler.ts" />

class Sprite{
    public initialized = false;

    public x: number = 0;
    public y: number = 0;
    public width: number = 0;
    public height: number = 0;
    public scaleX: number = 1;
    public scaleY: number = 1;
    public name: string = "Sprite";
    public time: number = 0;
    public rotation: number = 0;

    public drawPoint = { x: 0, y: 0 };
    public rotatePoint = { x: 0, y: 0 };
    
    public canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;
    public callback: Function = function(sprite:Sprite) { console.log("Callback not set"); };
    public drawSprite: bool = true;

    public assetHandler: AssetLoadHandler;
    public assetNameList: string[] = new string[]();

    public camera: CBCamera;

    constructor (name: string) {
        this.name = name;
        return this;
    }
    
    public draw() { this.drawMethod(this.x, this.y); }
    public drawAt(x: number, y: number) { this.drawMethod(x, y); }
    public drawMethod(x:number, y:number){}

    public update(){ }

    public pushAsset(assets: AssetContainer[]) { this.onload(); }
    public addAssetNames(name: string[], concat?:bool){
        if(concat){
            this.assetNameList.concat(name);
            return this;
        }
        this.assetNameList = name;
        return this;
    }

    public requestAssets(names?:string[]) {
        console.log("SPRITE REQUEST ASSETS");
        this.initialized = false;
        this.assetHandler.pushFrom(this, names ? names : this.assetNameList);
    }

    public setCamera(camera: CBCamera) {
        this.camera = camera;
    }

    public setAssetHandler(loadHandler: AssetLoadHandler){
        this.assetHandler = loadHandler;
    }

    public setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
    }

    public setPos(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public setRotation(rotation: number){
        this.rotation = rotation;
    }

    public setSize(width: number, height: number) {
        if((this.rotatePoint.x === 0 && this.rotatePoint.y === 0) || (this.rotatePoint.x === this.width/2 && this.rotatePoint.y == this.height/2))
            this.setRotatePoint(width / 2, height / 2);
        this.width = width;
        this.height = height;
        return this;
    }

    public setRotatePoint(x: number, y: number) {
        this.rotatePoint = { x: x, y: y };
        return this;
    }

    public setDrawPoint(x: number, y: number) {
        this.drawPoint = { x: Math.round(x), y: Math.round(y) };
        return this;
    }

    public setScale(scaleX: number, scaleY:number) {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    }

    public setCallback(callback: Function) {
        this.callback = callback;
    }

    public collisionDetect(sprite: Sprite, margin?:number) {
        margin = margin ? margin : 0;
        var x = this.x - this.drawPoint.x;
        var y = this.y - this.drawPoint.y;
        if(this.x  < sprite.x + sprite.width && this.x + this.width > sprite.x && this.y  < sprite.y + sprite.height && this.y + this.height > sprite.y)
            return true;

        return false;
    }

    public onload() {
        this.initialized = true;
        this.callback(this);
    }

    public toString(){
        return "SPRITE: " + this.name;
    }
}

class CBCamera {
    public width: number = 0;
    public height: number = 0;
    
    public x: number = 0;
    public y: number = 0;
    
    public upperX: number = 0;
    public upperY: number = 0;
    
    public maxX: number = 0;
    public maxY: number = 0;
    constructor (width, height, x?, y?) {
        if (x && y) {
            this.x = x;
            this.y = y;
        }
        
        this.width = width;
        this.height = height;
        
        this.upperX = this.x + this.width;
        this.upperY = this.y + this.height;
    }

    public setSize(width, height) {
        this.width = width;
        this.height = height;
    }

    public setPos(x:number, y:number) {
        this.x = x;
        this.y = y;

        this.upperX = this.x + this.width;
        this.upperY = this.y + this.height;
    }

    public setMax(x: number, y: number) {
        this.maxX = x;
        this.maxY = y;
    }
}