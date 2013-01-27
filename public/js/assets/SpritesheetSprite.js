var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SpritesheetSprite = (function (_super) {
    __extends(SpritesheetSprite, _super);
    function SpritesheetSprite(name) {
        _super.call(this, name);
        this.name = "Sprite: Spritesheet";
        this.spriteSheets = new Array();
        this.currentFrame = 0;
        this.currentAnim = "all";
        this.numFrames = 0;
        return this;
    }
    SpritesheetSprite.prototype.drawMethod = function (x, y) {
        if(this.drawSprite === true && x < this.canvas.width && y < this.canvas.height && x > (-this.width) && y > (-this.height)) {
            this.context.save();
            this.context.translate(this.x + this.width / 2, this.y + this.height / 2);
            this.context.rotate(this.rotation);
            var _width = this.width * this.scaleX;
            var _height = this.height * this.scaleY;
            this.sprSheet.draw(this.context, this.currentFrame, -_width / 2, -_height / 2, _width, _height);
            this.context.restore();
        }
    };
    SpritesheetSprite.prototype.update = function () {
    };
    SpritesheetSprite.prototype.nextFrame = function () {
        this.currentFrame = this.sprSheet.getNextFrame(this.currentFrame, this.currentAnim);
    };
    SpritesheetSprite.prototype.prevFrame = function () {
        this.currentFrame = this.sprSheet.getPrevFrame(this.currentFrame, this.currentAnim);
    };
    SpritesheetSprite.prototype.setCurrentAnimation = function (name) {
        this.currentAnim = name;
        this.currentFrame = this.sprSheet.getFirstFrame(this.currentAnim);
        return this;
    };
    SpritesheetSprite.prototype.addSpriteSheet = function (name, spriteSheet, makeCurrent) {
        this.spriteSheets[name] = spriteSheet;
        if(makeCurrent) {
            this.setCurrent(name);
        }
    };
    SpritesheetSprite.prototype.setCurrent = function (name) {
        if(this.spriteSheets[name]) {
            this.currentAnim = "all";
            return this.sprSheet = this.spriteSheets[name];
        }
        return null;
    };
    SpritesheetSprite.prototype.pushAsset = function (assets) {
        var objArray = [];
        for(var i = 0; i < assets.length; i++) {
            objArray.push(assets[i].asset);
        }
        this.spriteSheets = objArray;
        this.sprSheet = objArray[0];
        _super.prototype.pushAsset.call(this, assets);
    };
    return SpritesheetSprite;
})(Sprite);
//@ sourceMappingURL=SpritesheetSprite.js.map
