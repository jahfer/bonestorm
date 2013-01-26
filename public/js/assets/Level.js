var log = function (e) {
    console.log(e);
};
var Level = (function () {
    function Level(name) {
        this.name = "LEVEL";
        this.spriteList = new Array();
        this.spriteOrder = new Array();
        this.spriteSorter = function (nameArray, sprArray) {
        };
        this.audioList = new Array();
        this.assetList = new Array();
        this.initialized = false;
        this.name = name ? name : this.name;
        return this;
    }
    Level.prototype.setCanvas = function (canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        return this;
    };
    Level.prototype.setAssetHandler = function (handler, resetAssets) {
        this.assetHandler = handler;
        if(resetAssets) {
            this.assetHandler.reset();
        }
        return this;
    };
    Level.prototype.setBackground = function (bg) {
        this.spriteList["background"] = bg;
        return this;
    };
    Level.prototype.setSpriteSorter = function (sorter) {
        this.spriteSorter = sorter;
        return this;
    };
    Level.prototype.setKeyboard = function (keyboard, reset) {
        if(reset) {
            this.keyboard.reset();
        }
        this.keyboard = keyboard;
        return this;
    };
    Level.prototype.setKeyMap = function (map) {
        this.keyboard.bindMap(map);
        return this;
    };
    Level.prototype.setMouse = function (mouse) {
        this.mouse = mouse;
        return this;
    };
    Level.prototype.setMouseMap = function (events) {
        this.mouse.setEvents(events);
        return this;
    };
    Level.prototype.getAssetHandler = function () {
        return this.assetHandler;
    };
    Level.prototype.addAsset = function (asset) {
        this.initialized = false;
        this.assetList.push(asset);
    };
    Level.prototype.addSprite = function (sprite) {
        sprite.setCanvas(this.canvas);
        sprite.setAssetHandler(this.assetHandler);
        this.spriteList[sprite.name] = sprite;
        this.spriteOrder.push(sprite.name);
    };
    Level.prototype.addAudio = function (audio, name) {
        this.audioList[name] = audio;
        this.addAsset(audio);
    };
    Level.prototype.getSpriteOrder = function () {
        return this.spriteOrder;
    };
    Level.prototype.sort = function () {
        this.spriteSorter(this.spriteOrder, this.spriteList);
    };
    Level.prototype.load = function () {
        log(this.name + " load");
        var _this = this;
        var tempCallback = this.assetHandler.callback;
        this.assetHandler.setCallback(function () {
            _this.initialize(tempCallback);
        });
        for(var i = 0; i < this.assetList.length; i++) {
            this.assetHandler.addAsset(this.assetList[i].name, this.assetList[i]);
        }
        console.log(this.spriteList);
        for(var i = 0; i < this.spriteOrder.length; i++) {
            this.spriteList[this.spriteOrder[i]].requestAssets();
        }
        this.assetHandler.load();
    };
    Level.prototype.initialize = function (tempCallback) {
        this.initialized = true;
        if(tempCallback) {
            tempCallback();
        }
    };
    Level.prototype.staticUpdate = function () {
    };
    Level.prototype.update = function () {
        this.staticUpdate();
        for(var i = 0; i < this.spriteOrder.length; i++) {
            this.spriteList[this.spriteOrder[i]].update();
        }
        for(var i = 0; i < this.audioList.length; i++) {
            this.audioList[i].update();
        }
    };
    Level.prototype.draw = function () {
        for(var i = 0; i < this.spriteOrder.length; i++) {
            this.spriteList[this.spriteOrder[i]].draw();
        }
    };
    return Level;
})();
//@ sourceMappingURL=Level.js.map
