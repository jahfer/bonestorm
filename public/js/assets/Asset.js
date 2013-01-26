var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetContainer = (function () {
    function AssetContainer(name, asset) {
        this.name = name;
        this.asset = asset;
    }
    return AssetContainer;
})();
var AudioAsset = (function () {
    function AudioAsset(src) {
        this.initialized = false;
        this.callback = function () {
            console.log("AUDIO CALLBACK NOT SET");
        };
        this.name = "";
        if(src !== undefined) {
            this.src = src;
        }
        this.audio = new Audio();
    }
    AudioAsset.prototype.setCallback = function (callback) {
        this.callback = callback;
    };
    AudioAsset.prototype.setSrc = function (src) {
        this.initialized = false;
        this.src = src;
    };
    AudioAsset.prototype.getAudio = function () {
        return this.audio;
    };
    AudioAsset.prototype.load = function () {
        this.initialized = false;
        this.audio.src = this.src;
        this.audio.addEventListener('canplaythrough', ((function (that) {
            return function () {
                that.onload();
            }
        })(this)), false);
        return true;
    };
    AudioAsset.prototype.onload = function () {
        this.initialized = true;
        this.callback(this);
    };
    AudioAsset.prototype.play = function () {
        this.audio.play();
    };
    AudioAsset.prototype.pause = function () {
        this.audio.pause();
    };
    AudioAsset.prototype.stop = function () {
        this.audio.pause();
        this.audio.currentTime = 0;
    };
    AudioAsset.prototype.setVolume = function (volume) {
        this.audio.volume = volume;
    };
    AudioAsset.prototype.update = function () {
    };
    return AudioAsset;
})();
var ImageAsset = (function () {
    function ImageAsset(name) {
        this.src = "";
        this.initialized = false;
        this.callback = function () {
        };
        this.name = "";
        this.name = name;
        this.image = new Image();
    }
    ImageAsset.prototype.setCallback = function (callback) {
        this.callback = callback;
        return this;
    };
    ImageAsset.prototype.setSrc = function (src) {
        this.src = src;
        return this;
    };
    ImageAsset.prototype.load = function () {
        if(this.src === "" || this.initialized === true) {
            return false;
        }
        this.image.onload = ((function (that) {
            return function () {
                that.onload();
            }
        })(this));
        this.image.src = this.src;
        return true;
    };
    ImageAsset.prototype.onload = function () {
        this.initialized = true;
        this.callback(this);
    };
    return ImageAsset;
})();
var SpriteSheet = (function (_super) {
    __extends(SpriteSheet, _super);
    function SpriteSheet(name) {
        _super.call(this, name ? name : "SPRITESHEET");
        this.numFrames = 0;
        this.Animations = new Array();
        this.defaultAnim = "all";
        this.framePos = new Array();
        this.origWidth = 0;
        this.origHeight = 0;
        this.width = 0;
        this.height = 0;
        this.padX = 0;
        this.padY = 0;
        this.sheetSpecs = {
            rows: 0,
            columns: 0
        };
    }
    SpriteSheet.prototype.init = function (width, height, padX, padY) {
        this.origWidth = width;
        this.origHeight = height;
        this.padX = padX;
        this.padY = padY;
        return this;
    };
    SpriteSheet.prototype.setAnimation = function (name, start, end, reversed, repeat, callback) {
        this.Animations[name] = new Animation(start, end, reversed, repeat, callback);
        return this;
    };
    SpriteSheet.prototype.setDefaultAnim = function (name) {
        if(this.Animations[name]) {
            this.defaultAnim = name;
            return this;
        }
        return null;
    };
    SpriteSheet.prototype.checkAnimation = function (name) {
        if(this.Animations[name]) {
            return true;
        }
        return false;
    };
    SpriteSheet.prototype.getFirstFrame = function (anim) {
        if(this.Animations[anim]) {
            return this.Animations[anim].start;
        }
        return null;
    };
    SpriteSheet.prototype.getNextFrame = function (frame, anim) {
        if(this.Animations[anim]) {
            if(this.Animations[anim].reversed) {
                return this.getPrevFrame(frame, anim);
            }
            if(frame < this.Animations[anim].end) {
                return (frame + 1);
            } else {
                if(frame == this.Animations[anim].end) {
                    this.Animations[anim].callback();
                    if(this.Animations[anim].repeat == true) {
                        return this.Animations[anim].start;
                    } else {
                        return null;
                    }
                } else {
                    if(frame > this.Animations[anim].end) {
                        return this.Animations[anim].start;
                    }
                }
            }
        } else {
            return null;
        }
    };
    SpriteSheet.prototype.getPrevFrame = function (frame, anim) {
        if(this.Animations[anim]) {
            if(this.Animations[anim].reversed) {
                return this.getNextFrame(frame, anim);
            }
            if(frame > this.Animations[anim].start) {
                return (frame + 1);
            } else {
                if(frame == this.Animations[anim].start) {
                    this.Animations[anim].callback();
                    if(this.Animations[anim].repeat == true) {
                        return this.Animations[anim].end;
                    } else {
                        return null;
                    }
                } else {
                    if(frame < this.Animations[anim].start) {
                        return this.Animations[anim].end;
                    }
                }
            }
        } else {
            return null;
        }
    };
    SpriteSheet.prototype.draw = function (context, frame, x, y, width, height) {
        x = x ? x : 0;
        y = y ? y : 0;
        width = width ? width : this.image.width;
        height = height ? height : this.image.height;
        context.drawImage(this.image, this.framePos[frame].x, this.framePos[frame].y, this.width, this.height, x, y, width, height);
    };
    SpriteSheet.prototype.onload = function () {
        this.animInit();
        this.initialized = true;
        this.callback(this);
    };
    SpriteSheet.prototype.animInit = function () {
        var w = this.image.width;
        var h = this.image.height;
        this.sheetSpecs.columns = Math.floor(w / this.origWidth);
        this.sheetSpecs.rows = Math.floor(h / this.origHeight);
        this.numFrames = this.sheetSpecs.columns * this.sheetSpecs.rows;
        var _this = this;
        this.Animations["all"] = {
            start: 0,
            end: _this.numFrames - 1
        };
        this.width = this.origWidth - 2 * this.padX;
        this.height = this.origHeight - 2 * this.padY;
        for(var i = 0; i < this.numFrames; i++) {
            var frameX = (i % this.sheetSpecs.columns) * this.origWidth + this.padX;
            var frameY = Math.floor(i / this.sheetSpecs.columns) * this.origHeight + this.padY;
            this.framePos[i] = {
                x: frameX,
                y: frameY
            };
        }
    };
    return SpriteSheet;
})(ImageAsset);
var Animation = (function () {
    function Animation(start, end, reversed, repeat, callback) {
        this.start = 0;
        this.end = 0;
        this.repeat = true;
        this.callback = function () {
        };
        this.reversed = false;
        this.start = start;
        this.end = end;
        if(reversed) {
            this.reversed = reversed;
        }
        if(repeat) {
            this.repeat = repeat;
        }
        if(callback) {
            this.callback = callback;
        }
    }
    return Animation;
})();
//@ sourceMappingURL=Asset.js.map
