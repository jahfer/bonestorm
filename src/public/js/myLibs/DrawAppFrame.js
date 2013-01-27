var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AppFrameDrawn = (function (_super) {
    __extends(AppFrameDrawn, _super);
    function AppFrameDrawn() {
        _super.apply(this, arguments);

        this.element = document.body;
    }
    AppFrameDrawn.prototype.initialize = function () {
    };
    AppFrameDrawn.prototype.update = function () {
    };
    AppFrameDrawn.prototype.draw = function () {
    };
    AppFrameDrawn.prototype.exit = function () {
    };
    AppFrameDrawn.prototype.setElement = function (element) {
        this.element = element;
    };
    AppFrameDrawn.prototype.run = function (that) {
        if(that.running) {
            that.update();
            setTimeout(function () {
                requestAnimationFrame(function () {
                    that.run(that);
                });
                that.draw();
            }, this.sleep);
        } else {
            this.exit();
        }
    };
    return AppFrameDrawn;
})(AppFrame);
//@ sourceMappingURL=DrawAppFrame.js.map
