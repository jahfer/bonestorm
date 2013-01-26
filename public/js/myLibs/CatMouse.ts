class CatMouse{

    // PUBLIC VARS
    public x:number = 0;
	public y:number = 0;
	public elementX:number = 0;
	public elementY:number = 0;
	public domElement: HTMLElement =  null;
	public staticElement:bool =  false;
	public clicked:bool = false;

    // RUNTIME SET EVENTS
    private mouseMoveEvent(){this.log("[mouseMoveEvent] - Not set");}
	private mouseClickEvent(){this.log("[mouseClickEvent] - Not set");}
	private mouseRightClickEvent(){this.log("[mouseRightClickEvent] - Not set");}
	private mouseOverEvent(){this.log("[mouseOverEvent] - Not set");}
	private mouseOutEvent(){this.log("[mouseOutEvent] - Not set");}
	private mouseDownEvent(){this.log("[mouseDownEvent] - Not set");}
	private mouseUpEvent(){this.log("[mouseUpEvent] - Not set");}

    // UPDATE EVENTS
    private moveMouse(e){};
	private clickMouse(e){};
	private rightClickMouse(e){};
	private overMouse(e){};
	private outMouse(e){};
	private clickDownMouse(e){};
	private clickUpMouse(e){};

    // FOR DEBUGGING
    public verbose:bool = false;

    constructor(){
        // Preserve scope
        var _this = this;

        this.moveMouse = function(e) { _this.update(e); _this.mouseMoveEvent();}
	    this.clickMouse = function(e) {_this.update(e); _this.mouseClickEvent();}
	    this.rightClickMouse = function(e) {_this.update(e); _this.mouseRightClickEvent();}
	    this.overMouse = function(e) {_this.update(e); _this.mouseOverEvent();}
	    this.outMouse = function(e) {_this.update(e); _this.mouseOutEvent();}
	    this.clickDownMouse = function(e) {_this.update(e); _this.mouseDownEvent(); _this.clicked = true;}
	    this.clickUpMouse = function(e) {_this.update(e); _this.mouseUpEvent(); _this.clicked = false;}
    }

    // SET ELEMENT AND EVENTS
    public setProperties(element:HTMLElement, events)
	{
		this.setElement(element);
		this.setEvents(events);
	}

    // SET ELEMENT AND ADD EVENT LISTENERS
	public setElement(element: HTMLElement){
		this.domElement = element;

		var coor = this._getOffset(this.domElement);
		this.elementX = coor.X;
		this.elementY = coor.Y;
	}

    // EVENT SETTER
	public setEvents(events){
	    if (events.Move) {
		    this.domElement.addEventListener("mousemove", this.moveMouse );
	        this.mouseMoveEvent = events.Move;
	    }
	    if (events.Click) {
		    this.domElement.addEventListener("click", this.clickMouse );
	        this.mouseClickEvent = events.Click;
	    }
	    if (events.rightClick) {
		    this.domElement.addEventListener("contextmenu", this.rightClickMouse );
	        this.mouseRightClickEvent = events.rightClick;
	    }
	    if (events.mouseOver) {
		    this.domElement.addEventListener("mouseover", this.overMouse );
	        this.mouseOverEvent = events.mouseOver;
	    }
	    if (events.mouseOut) {
		    this.domElement.addEventListener("mouseout", this.outMouse );
	        this.mouseOutEvent = events.mouseOut;
	    }
	    if (events.mouseUp) {
		    this.domElement.addEventListener("mouseup", this.clickUpMouse );
	        this.mouseUpEvent = events.mouseUp;
	    }
	    if (events.mouseDown) {
		    this.domElement.addEventListener("mousedown", this.clickDownMouse );
	        this.mouseDownEvent = events.mouseDown;
	    }
	}

    public removeEvents(events:string[]){
        for (var i = 0; i < events.length; i++){
            switch (events[i]) {
                case "mousemove":
                    this.domElement.removeEventListener("mousemove", this.moveMouse);
                    break;

                case "mousedown":
                    this.domElement.removeEventListener("click", this.clickMouse);
                    break;

                case "contextmenu":
                    this.domElement.removeEventListener("contextmenu", this.rightClickMouse);
                    break;

                case "mouseover":
                    this.domElement.removeEventListener("mouseover", this.overMouse);
                    break;

                case "mouseout":
                    this.domElement.removeEventListener("mouseout", this.outMouse);
                    break;

                case "mouseup":
                    this.domElement.removeEventListener("mouseup", this.clickUpMouse);
                    break;

                case "mousedown":
                    this.domElement.removeEventListener("mousedown", this.clickDownMouse);
                    break;
            }
        }
    }

    // UPDATE VARS
    private update(e:MouseEvent){
		if(!this.staticElement)
		{
			var coor = this._getOffset(this.domElement);
			this.elementX = coor.X;
			this.elementY = coor.Y;
		}

		//console.log(this.domElement.id + " " + this.elementX + ' ' + this.elementY);

		this.x = e.clientX-this.elementX;
		this.y = e.clientY-this.elementY;

		if(this.x > this.domElement.offsetWidth)
			this.x = this.domElement.offsetWidth;
		else if(this.x <= 0)
			this.x = 0;
		if(this.y > this.domElement.offsetHeight)
			this.y = this.domElement.offsetHeight;
		else if(this.y <= 0)
			this.y = 0;
	}

    // GET ELEMENT OFFSET
    private _getOffset( obj ) {
	    var _x = 0;
	    var _y = 0;

		if (obj.offsetParent) {
			do {
				_x += obj.offsetLeft;
				_y += obj.offsetTop;
			} while (obj = obj.offsetParent);
		}
	    return { Y: _y, X: _x };
	}

    // DEBUG LOG
    private log(msg)
	{
		if(this.verbose)
			console.log("[" + this.domElement.id + "] - " + msg);
	}
}