var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CatBucket = (function (_super) {
    __extends(CatBucket, _super);
    function CatBucket(fps) {
        _super.call(this, fps);
        this.name = "CAT BUCKET v1.1";
        this.currentLevelIndex = 0;
        this.Levels = new Array();
        this.levelNames = new Array();
        this.drawCtrl = null;
        this.keyboard = null;
        this.mouse = null;
        this.settings = new HashCat();
        this.AssetHandler = new AssetLoadHandler();
    }
    CatBucket.prototype.addLevel = function (level) {
    };
    return CatBucket;
})(AppFrameDrawn);
//@ sourceMappingURL=CatBucket.js.map
