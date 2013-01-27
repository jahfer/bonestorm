var CatMouse = (function () {
    function CatMouse() {
        this.x = 0;
        this.y = 0;
        this.elementX = 0;
        this.elementY = 0;
        this.domElement = null;
        this.staticElement = false;
        this.clicked = false;
        this.verbose = false;
        var _this = this;
        this.moveMouse = function (e) {
            _this.update(e);
            _this.mouseMoveEvent();
        };
        this.clickMouse = function (e) {
            _this.update(e);
            _this.mouseClickEvent();
        };
        this.rightClickMouse = function (e) {
            _this.update(e);
            _this.mouseRightClickEvent();
        };
        this.overMouse = function (e) {
            _this.update(e);
            _this.mouseOverEvent();
        };
        this.outMouse = function (e) {
            _this.update(e);
            _this.mouseOutEvent();
        };
        this.clickDownMouse = function (e) {
            _this.update(e);
            _this.mouseDownEvent();
            _this.clicked = true;
        };
        this.clickUpMouse = function (e) {
            _this.update(e);
            _this.mouseUpEvent();
            _this.clicked = false;
        };
    }
    CatMouse.prototype.mouseMoveEvent = function () {
        this.log("[mouseMoveEvent] - Not set");
    };
    CatMouse.prototype.mouseClickEvent = function () {
        this.log("[mouseClickEvent] - Not set");
    };
    CatMouse.prototype.mouseRightClickEvent = function () {
        this.log("[mouseRightClickEvent] - Not set");
    };
    CatMouse.prototype.mouseOverEvent = function () {
        this.log("[mouseOverEvent] - Not set");
    };
    CatMouse.prototype.mouseOutEvent = function () {
        this.log("[mouseOutEvent] - Not set");
    };
    CatMouse.prototype.mouseDownEvent = function () {
        this.log("[mouseDownEvent] - Not set");
    };
    CatMouse.prototype.mouseUpEvent = function () {
        this.log("[mouseUpEvent] - Not set");
    };
    CatMouse.prototype.moveMouse = function (e) {
    };
    CatMouse.prototype.clickMouse = function (e) {
    };
    CatMouse.prototype.rightClickMouse = function (e) {
    };
    CatMouse.prototype.overMouse = function (e) {
    };
    CatMouse.prototype.outMouse = function (e) {
    };
    CatMouse.prototype.clickDownMouse = function (e) {
    };
    CatMouse.prototype.clickUpMouse = function (e) {
    };
    CatMouse.prototype.setProperties = function (element, events) {
        this.setElement(element);
        this.setEvents(events);
    };
    CatMouse.prototype.setElement = function (element) {
        this.domElement = element;
        var coor = this._getOffset(this.domElement);
        this.elementX = coor.X;
        this.elementY = coor.Y;
    };
    CatMouse.prototype.setEvents = function (events) {
        if(events.Move) {
            this.domElement.addEventListener("mousemove", this.moveMouse);
            this.mouseMoveEvent = events.Move;
        }
        if(events.Click) {
            this.domElement.addEventListener("click", this.clickMouse);
            this.mouseClickEvent = events.Click;
        }
        if(events.rightClick) {
            this.domElement.addEventListener("contextmenu", this.rightClickMouse);
            this.mouseRightClickEvent = events.rightClick;
        }
        if(events.mouseOver) {
            this.domElement.addEventListener("mouseover", this.overMouse);
            this.mouseOverEvent = events.mouseOver;
        }
        if(events.mouseOut) {
            this.domElement.addEventListener("mouseout", this.outMouse);
            this.mouseOutEvent = events.mouseOut;
        }
        if(events.mouseUp) {
            this.domElement.addEventListener("mouseup", this.clickUpMouse);
            this.mouseUpEvent = events.mouseUp;
        }
        if(events.mouseDown) {
            this.domElement.addEventListener("mousedown", this.clickDownMouse);
            this.mouseDownEvent = events.mouseDown;
        }
    };
    CatMouse.prototype.removeEvents = function (events) {
        for(var i = 0; i < events.length; i++) {
            switch(events[i]) {
                case "mousemove": {
                    this.domElement.removeEventListener("mousemove", this.moveMouse);
                    break;

                }
                case "mousedown": {
                    this.domElement.removeEventListener("click", this.clickMouse);
                    break;

                }
                case "contextmenu": {
                    this.domElement.removeEventListener("contextmenu", this.rightClickMouse);
                    break;

                }
                case "mouseover": {
                    this.domElement.removeEventListener("mouseover", this.overMouse);
                    break;

                }
                case "mouseout": {
                    this.domElement.removeEventListener("mouseout", this.outMouse);
                    break;

                }
                case "mouseup": {
                    this.domElement.removeEventListener("mouseup", this.clickUpMouse);
                    break;

                }
                case "mousedown": {
                    this.domElement.removeEventListener("mousedown", this.clickDownMouse);
                    break;

                }
            }
        }
    };
    CatMouse.prototype.update = function (e) {
        if(!this.staticElement) {
            var coor = this._getOffset(this.domElement);
            this.elementX = coor.X;
            this.elementY = coor.Y;
        }
        this.x = e.clientX - this.elementX;
        this.y = e.clientY - this.elementY;
        if(this.x > this.domElement.offsetWidth) {
            this.x = this.domElement.offsetWidth;
        } else {
            if(this.x <= 0) {
                this.x = 0;
            }
        }
        if(this.y > this.domElement.offsetHeight) {
            this.y = this.domElement.offsetHeight;
        } else {
            if(this.y <= 0) {
                this.y = 0;
            }
        }
    };
    CatMouse.prototype._getOffset = function (obj) {
        var _x = 0;
        var _y = 0;
        if(obj.offsetParent) {
            do {
                _x += obj.offsetLeft;
                _y += obj.offsetTop;
            }while(obj = obj.offsetParent)
        }
        return {
            Y: _y,
            X: _x
        };
    };
    CatMouse.prototype.log = function (msg) {
        if(this.verbose) {
            console.log("[" + this.domElement.id + "] - " + msg);
        }
    };
    return CatMouse;
})();
//@ sourceMappingURL=CatMouse.js.map
