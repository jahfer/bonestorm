class CanvasLayerControl
{
    public canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;

    private buffers: bufferCanvas[] = new Array();
    private bufferOrder: string[] = new Array();

    constructor (canvas:HTMLElement) {
        this.canvas = <HTMLCanvasElement> canvas;
        this.context = this.canvas.getContext("2d");
    }

    public addCanvas(name:string) {
        var temp = new bufferCanvas();
        temp.setSize(this.canvas.width, this.canvas.height);

        this.buffers[name] = temp;
        this.bufferOrder.push(name);

        return temp;
    }
    
    public getCanvas(name:string) {
        return this.buffers[name].canvas;
    }

    public getContext(name:string) {
        return this.buffers[name].context;
    }

    public getOrder() {
        return this.bufferOrder;
    }

    public clear() {
        this.canvas.width = this.canvas.width;
    }

    public drawAll() {
        for (var i = 0; i < this.bufferOrder.length; i++) {
            var temp: bufferCanvas = this.buffers[this.bufferOrder[i]];
            this.context.drawImage(temp.canvas, temp.x, temp.y, temp.canvas.width, temp.canvas.height);
        }
    }

    public clearAll() {
        for (var i = 0; i < this.bufferOrder.length; i++) {
            this.buffers[this.bufferOrder[i]].clear();
        }
    }
}

class bufferCanvas
{
    public canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;

    public x: number = 0;
    public y: number = 0;

    constructor () {
        this.canvas = <HTMLCanvasElement> document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
    }

    public setSize(w:number, h:number) {
        this.canvas.width = w;
        this.canvas.height = h;
    }

    public setPos(x:number, y:number) {
        this.x = x;
        this.y = y;
    }

    public clear() {
        this.canvas.width = this.canvas.width;
    }
}