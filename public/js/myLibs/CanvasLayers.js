var CanvasLayerControl = (function () {
    function CanvasLayerControl(canvas) {
        this.buffers = new Array();
        this.bufferOrder = new Array();
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
    }
    CanvasLayerControl.prototype.addCanvas = function (name) {
        var temp = new bufferCanvas();
        temp.setSize(this.canvas.width, this.canvas.height);
        this.buffers[name] = temp;
        this.bufferOrder.push(name);
        return temp;
    };
    CanvasLayerControl.prototype.getCanvas = function (name) {
        return this.buffers[name].canvas;
    };
    CanvasLayerControl.prototype.getContext = function (name) {
        return this.buffers[name].context;
    };
    CanvasLayerControl.prototype.getOrder = function () {
        return this.bufferOrder;
    };
    CanvasLayerControl.prototype.clear = function () {
        this.canvas.width = this.canvas.width;
    };
    CanvasLayerControl.prototype.drawAll = function () {
        for(var i = 0; i < this.bufferOrder.length; i++) {
            var temp = this.buffers[this.bufferOrder[i]];
            this.context.drawImage(temp.canvas, temp.x, temp.y, temp.canvas.width, temp.canvas.height);
        }
    };
    CanvasLayerControl.prototype.clearAll = function () {
        for(var i = 0; i < this.bufferOrder.length; i++) {
            this.buffers[this.bufferOrder[i]].clear();
        }
    };
    return CanvasLayerControl;
})();
var bufferCanvas = (function () {
    function bufferCanvas() {
        this.x = 0;
        this.y = 0;
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
    }
    bufferCanvas.prototype.setSize = function (w, h) {
        this.canvas.width = w;
        this.canvas.height = h;
    };
    bufferCanvas.prototype.setPos = function (x, y) {
        this.x = x;
        this.y = y;
    };
    bufferCanvas.prototype.clear = function () {
        this.canvas.width = this.canvas.width;
    };
    return bufferCanvas;
})();
//@ sourceMappingURL=CanvasLayers.js.map
