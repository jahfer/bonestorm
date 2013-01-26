// APPFRAME.TS BY SUNMOCK YANG
class AppFrame {
    public running: bool;
    private fps: number;
    private sleep: number;
    public initialized: bool = false;

    public static blank: Function = function () { };

    //USER DEFINED RUN METHODS
    //public initialize: Function = AppFrame.blank; // Runs once at the start of the application
    //public update: Function  = AppFrame.blank; // Runs every frame before the draw method. Use this function to update your objects
    //public draw: Function  = AppFrame.blank; // Runs every frame after the update method. Use this function to draw your objects
    //public exit: Function  = AppFrame.blank; // Last thing to run before quitting the application.
    
    public initialize() { }
    public update() { }
    public draw() { }
    public exit() { }
    
    public delegate: Function;
    constructor (frames: number, initialized?: bool) {
        this.running = false;
        this.initialized = (initialized) ? initialized : this.initialized;
        this.setFps(frames); // Sets the timeout value based on the desired fps.
    }

    // Not recommended to use. But rather inherit the AppFrame class and define the functions
    public setFunctions(initialize, update, draw, exit) {
        if (initialize !== undefined) { this.initialize = initialize; }
        if (update !== undefined) { this.update = update; }
        if (draw !== undefined) { this.draw = draw; }
        if (exit !== undefined) { this.exit = exit; }
    }

    // Called by user to start the application after each method is defined by the methods function
    public start() {
		if(this.running === true)return;

		this.running = true;
		this.initialize();
		this.delegate = (function(that: AppFrame) {
		    return function () {
		        that.run(that);
		    }
		} (this));
		    
        this.run(this);
    }

    public stop() { this.running = false; }

    // Set the FPS value of the application.
    public setFps(fps:number) {
        this.fps = fps;
        this.sleep = (fps) ? Math.ceil(1000/fps) : 0;
    }

    // Get the FPS value of the application.
    public getFps() { return this.fps; }

    // Main loop that calls the update/draw functions.
    private run(that:AppFrame) {
        if (that.running) {
            if (that.initialized) {
                that.update();
                that.draw();
            }
            setTimeout(that.delegate, that.sleep);
        }
        else
            this.exit();
    }
}

// SUNMOCK YANG