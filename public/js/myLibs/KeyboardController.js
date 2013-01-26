var Mousetrap = Mousetrap ? Mousetrap : null;
var KeyboardController = (function () {
    function KeyboardController() {
        this.mousetrap = null;
        this.keydownMap = new Array();
        this.mousetrap = Mousetrap;
    }
    KeyboardController.prototype.bind = function (key, func, keypress, override, onup) {
        var _func = function (e) {
            func();
        };
        var _onup = function (e) {
            onup();
        };
        if(override) {
            _func = function (e) {
                if(e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
                func();
            };
            _onup = function (e) {
                if(e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
                onup();
            };
        }
        if(keypress) {
            if(keypress === "keypress") {
                this.keypressBind(key, _func, keypress, _onup);
                return;
            }
            this.mousetrap.bind(key, _func, keypress);
            if(onup) {
                this.mousetrap.bind(key, _onup, "keyup");
            }
        } else {
            this.mousetrap.bind(key, _func);
        }
    };
    KeyboardController.prototype.keypressBind = function (key, func, keypress, onup) {
        var _obj = new keydownObject();
        _obj.key = key;
        _obj.func = func;
        this.keydownMap[key] = _obj;
        var _this = this;
        console.log(keypress);
        this.mousetrap.bind(key, function (e) {
            var temp = _this.keydownMap[key];
            if(temp.keypressed !== true) {
                temp.keypressed = true;
                temp.func(e);
            }
        }, "keydown");
        this.mousetrap.bind(key, function (e) {
            _this.keydownMap[key].keypressed = false;
            if(onup) {
                onup(e);
            }
        }, "keyup");
    };
    KeyboardController.prototype.bindMap = function (keyMap) {
        for(var i = 0; i < keyMap.length; i++) {
            this.bind(keyMap[i].key, keyMap[i].func, keyMap[i].keypress, keyMap[i].onup);
        }
    };
    KeyboardController.prototype.unbind = function (key) {
        this.mousetrap.unbind(key);
    };
    KeyboardController.prototype.trigger = function (key, keypress) {
        if(keypress) {
            this.mousetrap.trigger(key, keypress);
        } else {
            this.mousetrap.trigger(key);
        }
    };
    KeyboardController.prototype.reset = function () {
        this.mousetrap.reset();
    };
    return KeyboardController;
})();
var keydownObject = (function () {
    function keydownObject() {
        this.key = null;
        this.keypressed = false;
        this.func = function () {
        };
    }
    return keydownObject;
})();
//@ sourceMappingURL=KeyboardController.js.map
