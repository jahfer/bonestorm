var Sprite = (function () {
    function Sprite(name) {
        this.initialized = false;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.name = "Sprite";
        this.time = 0;
        this.rotation = 0;
        this.drawPoint = {
            x: 0,
            y: 0
        };
        this.rotatePoint = {
            x: 0,
            y: 0
        };
        this.callback = function (sprite) {
            console.log("Callback not set");
        };
        this.drawSprite = true;
        this.assetNameList = new Array();
        this.name = name;
        return this;
    }
    Sprite.prototype.draw = function () {
        this.drawMethod(this.x, this.y);
    };
    Sprite.prototype.drawAt = function (x, y) {
        this.drawMethod(x, y);
    };
    Sprite.prototype.drawMethod = function (x, y) {
    };
    Sprite.prototype.update = function () {
    };
    Sprite.prototype.pushAsset = function (assets) {
        this.onload();
    };
    Sprite.prototype.addAssetNames = function (name, concat) {
        if(concat) {
            this.assetNameList.concat(name);
            return this;
        }
        this.assetNameList = name;
        return this;
    };
    Sprite.prototype.requestAssets = function (names) {
        console.log("SPRITE REQUEST ASSETS");
        this.initialized = false;
        this.assetHandler.pushFrom(this, names ? names : this.assetNameList);
    };
    Sprite.prototype.setCamera = function (camera) {
        this.camera = camera;
    };
    Sprite.prototype.setAssetHandler = function (loadHandler) {
        this.assetHandler = loadHandler;
    };
    Sprite.prototype.setCanvas = function (canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
    };
    Sprite.prototype.setPos = function (x, y) {
        this.x = x;
        this.y = y;
    };
    Sprite.prototype.setRotation = function (rotation) {
        this.rotation = rotation;
    };
    Sprite.prototype.setSize = function (width, height) {
        if((this.rotatePoint.x === 0 && this.rotatePoint.y === 0) || (this.rotatePoint.x === this.width / 2 && this.rotatePoint.y == this.height / 2)) {
            this.setRotatePoint(width / 2, height / 2);
        }
        this.width = width;
        this.height = height;
        return this;
    };
    Sprite.prototype.setRotatePoint = function (x, y) {
        this.rotatePoint = {
            x: x,
            y: y
        };
        return this;
    };
    Sprite.prototype.setDrawPoint = function (x, y) {
        this.drawPoint = {
            x: Math.round(x),
            y: Math.round(y)
        };
        return this;
    };
    Sprite.prototype.setScale = function (scaleX, scaleY) {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    };
    Sprite.prototype.setCallback = function (callback) {
        this.callback = callback;
    };
    Sprite.prototype.collisionDetect = function (sprite, margin) {
        margin = margin ? margin : 0;
        var x = this.x - this.drawPoint.x;
        var y = this.y - this.drawPoint.y;
        if(this.x < sprite.x + sprite.width && this.x + this.width > sprite.x && this.y < sprite.y + sprite.height && this.y + this.height > sprite.y) {
            return true;
        }
        return false;
    };
    Sprite.prototype.onload = function () {
        this.initialized = true;
        this.callback(this);
    };
    Sprite.prototype.toString = function () {
        return "SPRITE: " + this.name;
    };
    return Sprite;
})();
var CBCamera = (function () {
    function CBCamera(width, height, x, y) {
        this.width = 0;
        this.height = 0;
        this.x = 0;
        this.y = 0;
        this.upperX = 0;
        this.upperY = 0;
        this.maxX = 0;
        this.maxY = 0;
        if(x && y) {
            this.x = x;
            this.y = y;
        }
        this.width = width;
        this.height = height;
        this.upperX = this.x + this.width;
        this.upperY = this.y + this.height;
    }
    CBCamera.prototype.setSize = function (width, height) {
        this.width = width;
        this.height = height;
    };
    CBCamera.prototype.setPos = function (x, y) {
        this.x = x;
        this.y = y;
        this.upperX = this.x + this.width;
        this.upperY = this.y + this.height;
    };
    CBCamera.prototype.setMax = function (x, y) {
        this.maxX = x;
        this.maxY = y;
    };
    return CBCamera;
})();
//@ sourceMappingURL=Sprite.js.map
