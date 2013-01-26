/// <reference path="AppFrame.ts" />
// APPFRAME DRAW EXTENSION BY SUNMOCK YANG
class AppFrameDrawn extends AppFrame {
    private sleep: number;
    private element: HTMLElement = document.body;

    //USER DEFINED RUN METHODS
    public initialize() { }
    public update() { }
    public draw() { }
    public exit() { }

    public setElement(element: HTMLElement){
        this.element = element;
    }

    private run(that:AppFrameDrawn){
        if (that.running) {
            that.update();
            setTimeout(function () {
                requestAnimationFrame(function () { that.run(that); });
                that.draw();
            }, this.sleep);
        }
        else this.exit();
    }
}