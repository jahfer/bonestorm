class AssetContainer{
    public name: string;
    public asset: Asset;

    constructor (name:string, asset:Asset){this.name = name; this.asset = asset;}
}

interface Asset {
    initialized: bool;
    src;
    name: string;

    load(): bool;
    onload(): void;
    callback: Function;
}

class AudioAsset implements Asset {
    public initialized: bool = false;
    public src:string;
    private callback: Function = function () { console.log("AUDIO CALLBACK NOT SET"); };
    private audio: HTMLAudioElement;
    public name: string = "";

    constructor(src: string) {
        if (src !== undefined) { this.src = src; }
        this.audio = new Audio();
    }

// GET/SETTERS
    public setCallback(callback: Function) {
        this.callback = callback;
    }

    public setSrc(src: string) {
        this.initialized = false;
        this.src = src;
    }

    public getAudio() {
        return this.audio;
    }

// LOAD
    public load() {
        this.initialized = false;
        this.audio.src = this.src;
        this.audio.addEventListener('canplaythrough', (function(that: AudioAsset) { return function () { that.onload(); } } (this)), false);
        
        return true;
    }

    public onload() {
        this.initialized = true;
        this.callback(this);
    }

// CONTROLS
    public play() {
        this.audio.play();
    }

    public pause() {
        this.audio.pause();
    }

    public stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    public setVolume(volume:number){
        this.audio.volume = volume;
    }

    public update(){ }
}

class ImageAsset implements Asset {
    public image: HTMLImageElement;
    public src: string = "";
    public initialized: bool = false;
    public callback: Function = function () { };
    public name: string = "";

    constructor (name:string) {
        this.name = name;
        this.image = new Image();
    }

    public setCallback(callback:Function):ImageAsset {
        this.callback = callback;
        return this;
    }

    public setSrc(src:string):ImageAsset {
        this.src = src;
        return this;
    }

    public load(){
        if(this.src === "" || this.initialized === true)
            return false;

        this.image.onload = (function(that: ImageAsset) {return function () { that.onload() } } (this));
        
        this.image.src = this.src;
        return true;
    }
    public onload(): void {
        this.initialized = true;
        this.callback(this);
    }
}

class SpriteSheet extends ImageAsset{
    private numFrames: number = 0;
    private Animations: Animation[] = new Animation[]();
    public defaultAnim: string = "all";

    private framePos: any[] = new Array();
    public origWidth: number = 0;
    public origHeight: number = 0;
    public width: number = 0;
    public height: number = 0;
    private padX: number = 0;
    private padY: number = 0;

    private sheetSpecs = {
        rows: 0,
        columns: 0
    };

    constructor(name?:string){
        super(name ? name : "SPRITESHEET");
    }

    public init(width:number, height:number, padX:number, padY:number):SpriteSheet{
        this.origWidth = width;
        this.origHeight = height;
        this.padX = padX;
        this.padY = padY;

        return this;
    }

    public setAnimation(name:string, start:number, end:number, reversed?:bool, repeat?:bool, callback?: Function): SpriteSheet{
        this.Animations[name] = new Animation(start, end, reversed, repeat, callback);
        return this;
    }

    public setDefaultAnim(name:string): SpriteSheet{
        if (this.Animations[name]) {
            this.defaultAnim = name;
            return this;
        }
        return null;
    }

    public checkAnimation(name:string):bool{
        if (this.Animations[name]) {return true;}
        return false;
    }

    public getFirstFrame(anim: string) {
        if (this.Animations[anim]) {
            return this.Animations[anim].start;
        }
        return null;
    }

    public getNextFrame(frame:number, anim:string):number{
        if(this.Animations[anim]){
            if (this.Animations[anim].reversed) { return this.getPrevFrame(frame, anim);}

            if (frame < this.Animations[anim].end) {
                return (frame + 1);
            }
            else if (frame == this.Animations[anim].end) {
                this.Animations[anim].callback();
                if (this.Animations[anim].repeat == true) { return this.Animations[anim].start; }
                else { return null; }
            }
            else if (frame > this.Animations[anim].end) {
                return this.Animations[anim].start;
            }
        }
        else
            return null;
    }

    public getPrevFrame(frame:number, anim:string):number{
        if(this.Animations[anim]){
            if (this.Animations[anim].reversed) { return this.getNextFrame(frame, anim);}

            if (frame > this.Animations[anim].start) {
                return (frame + 1);
            }
            else if (frame == this.Animations[anim].start) {
                this.Animations[anim].callback();
                if (this.Animations[anim].repeat == true) { return this.Animations[anim].end; }
                else { return null; }
            }
            else if (frame < this.Animations[anim].start) {
                return this.Animations[anim].end;
            }
        }
        else
            return null;
    }

    public draw(context: CanvasRenderingContext2D, frame:number, x?:number, y?:number, width?:number, height?:number){
        x = x ? x : 0;
        y = y ? y : 0;
        width = width ? width : this.image.width;
        height = height ? height : this.image.height;

        context.drawImage(this.image, this.framePos[frame].x, this.framePos[frame].y, this.width, this.height, x , y , width, height);
        //context.drawImage(this.frames[this.currentFrame], x, y, width, height);
    }

    public onload():void{
        this.animInit();
        this.initialized = true;
        this.callback(this);
    }

    private animInit(){
        var w = this.image.width;
        var h = this.image.height;
        
        this.sheetSpecs.columns = Math.floor(w / this.origWidth);
        this.sheetSpecs.rows = Math.floor(h / this.origHeight);
        this.numFrames = this.sheetSpecs.columns * this.sheetSpecs.rows;
        var _this = this;
        this.Animations["all"] = { start: 0, end: _this.numFrames-1 };
        this.width = this.origWidth - 2 * this.padX;
        this.height = this.origHeight - 2 * this.padY;

        for (var i = 0; i < this.numFrames; i++){
            var frameX = (i % this.sheetSpecs.columns) * this.origWidth + this.padX;
            var frameY = Math.floor(i / this.sheetSpecs.columns) * this.origHeight + this.padY;

            this.framePos[i] = {x: frameX, y: frameY};
        }
    }
}

class Animation {
    public start: number = 0;
    public end: number = 0;
    public repeat: bool = true;
    public callback: Function = function () { };
    public reversed: bool = false;

    constructor (start: number, end: number, reversed?:bool, repeat?: bool, callback?: Function) {
        this.start = start;
        this.end = end;
        if (reversed) { this.reversed = reversed; }
        if (repeat) { this.repeat = repeat; }
        if (callback) { this.callback = callback; }
    }
}

// Interface
/*interface IPoint {
    getDist(): number;
}

// Module
module Shapes {

    // Class
    export class Point implements IPoint {
        // Constructor
        constructor (public x: number, public y: number) { }

        // Instance member
        getDist() { return Math.sqrt(this.x * this.x + this.y * this.y); }

        // Static member
        static origin = new Point(0, 0);
    }

}

// Local variables
var p: IPoint = new Shapes.Point(3, 4);
var dist = p.getDist();*/