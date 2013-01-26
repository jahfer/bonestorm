/// <reference path="Sprite.ts" />
/// <reference path="AssetLoadHandler.ts" />
/// <reference path="../myLibs/KeyboardController.ts" />
/// <reference path="../myLibs/CatMouse.ts" />

var log = function (e) { console.log(e); }

class Level{
    public name: string = "LEVEL";

    // ASSETS
    //public background: Sprite;
    private assetHandler: AssetLoadHandler;

    public spriteList: Sprite[] = new Sprite[]();
    public spriteOrder: string[] = new string[]();
    public spriteSorter: Function = function (nameArray:string[], sprArray: Sprite[]) { };

    public audioList: AudioAsset[] = new AudioAsset[]();

    private assetList: Asset[] = new Asset[]();

    public initialized: bool = false;
    
    // INPUT 
    private keyboard: KeyboardController;
    private mouse: CatMouse;
    
    // CANVAS
    public canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    // METHODS
    constructor(name?: string){
        this.name = name ? name : this.name;
        return this;
    }

    // SETTERS
    public setCanvas(canvas:HTMLCanvasElement):Level {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        return this;
    }

    public setAssetHandler(handler: AssetLoadHandler, resetAssets?:bool):Level{
        this.assetHandler = handler;
        if(resetAssets){
            this.assetHandler.reset();
        }
        return this;
    }
    
    public setBackground(bg: Sprite):Level{
        this.spriteList["background"] = bg;
        return this;
    }

    public setSpriteSorter(sorter: Function):Level{
        this.spriteSorter = sorter;
        return this;
    }

    public setKeyboard(keyboard: KeyboardController, reset?: bool):Level{
        if (reset) { this.keyboard.reset(); }
        this.keyboard = keyboard;
        return this;
    }

    public setKeyMap(map: any[]):Level{
        this.keyboard.bindMap(map);
        return this;
    }

    public setMouse(mouse: CatMouse):Level{
        this.mouse = mouse;
        return this;
    }

    public setMouseMap(events):Level{
        this.mouse.setEvents(events);
        return this;
    }

    public getAssetHandler(){
        return this.assetHandler;
    }

    // ASSETS
    public addAsset(asset: Asset){
        this.initialized = false;
        this.assetList.push(asset);
    }

    public addSprite(sprite: Sprite){
        sprite.setCanvas(this.canvas);
        sprite.setAssetHandler(this.assetHandler);

        this.spriteList[sprite.name] = sprite;
        this.spriteOrder.push(sprite.name);
    }

    public addAudio(audio:AudioAsset, name:string){
        this.audioList[name] = audio;
        this.addAsset(audio);
    }

    public getSpriteOrder(){
        return this.spriteOrder;
    }

    public sort(){
        this.spriteSorter(this.spriteOrder, this.spriteList);
    }

    // LOADING
    public load(){
        log(this.name + " load");
        var _this = this;
        var tempCallback = this.assetHandler.callback;
        this.assetHandler.setCallback(function () {
            _this.initialize(tempCallback);
        });

        for (var i = 0; i < this.assetList.length; i++){
            this.assetHandler.addAsset(this.assetList[i].name, this.assetList[i]);
        }

        console.log(this.spriteList);
        for (var i = 0; i < this.spriteOrder.length; i++){
            this.spriteList[this.spriteOrder[i]].requestAssets();
        }
        this.assetHandler.load();
    }

    // RUNTIME

    public initialize(tempCallback: Function){
        this.initialized = true;
        if (tempCallback) { tempCallback(); }
    }

    public staticUpdate(){ }

    public update(){
        this.staticUpdate();
        for (var i = 0; i < this.spriteOrder.length; i++) {
            this.spriteList[this.spriteOrder[i]].update();
        }

        for (var i = 0; i < this.audioList.length; i++) {
            this.audioList[i].update();
        }
    }

    public draw(){
        for (var i = 0; i < this.spriteOrder.length; i++){
            this.spriteList[this.spriteOrder[i]].draw();
        }
    }
}