/// <reference path="Sprite.ts" />

class SpritesheetSprite extends Sprite{
    public name = "Sprite: Spritesheet";

    public sprSheet: SpriteSheet;
    public spriteSheets: SpriteSheet[] = new SpriteSheet[]();

    public currentFrame: number = 0;
    private currentAnim: string = "all";
    private numFrames: number = 0;
    
    constructor (name: string){
        super(name);
        return this;
    }

    public drawMethod(x: number, y:number){
        if (this.drawSprite === true && x < this.canvas.width && y < this.canvas.height && x > (-this.width) && y > (-this.height)) {
            this.context.save();
            this.context.translate(this.x + this.width/2, this.y + this.height/2);
            this.context.rotate(this.rotation);
            var _width = this.width * this.scaleX;
            var _height = this.height * this.scaleY;
            this.sprSheet.draw(this.context, this.currentFrame, -_width/2, -_height/2, _width, _height);
            this.context.restore();
        }
    }

    public update(){ }

    public nextFrame(){
        this.currentFrame = this.sprSheet.getNextFrame(this.currentFrame, this.currentAnim);
    }

    public prevFrame(){
        this.currentFrame = this.sprSheet.getPrevFrame(this.currentFrame, this.currentAnim);
    }

    public setCurrentAnimation(name: string):SpritesheetSprite{
        this.currentAnim = name;
        this.currentFrame = this.sprSheet.getFirstFrame(this.currentAnim);
        return this;
    }

    public addSpriteSheet(name:string, spriteSheet: SpriteSheet, makeCurrent?:bool){
        this.spriteSheets[name] = spriteSheet;
        if (makeCurrent) { this.setCurrent(name); }
    }

    public setCurrent(name:string):SpriteSheet{
        if (this.spriteSheets[name]) {
            this.currentAnim = "all";
            return this.sprSheet = this.spriteSheets[name];
        }
        return null;

    }

    public pushAsset(assets: AssetContainer[]){
        var objArray:Asset[] = [];
        for (var i = 0; i < assets.length; i++){
            objArray.push(assets[i].asset);
        }

        this.spriteSheets = <SpriteSheet[]>objArray;
        this.sprSheet = <SpriteSheet>objArray[0];
        super.pushAsset(assets);
    }
}