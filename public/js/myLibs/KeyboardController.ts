var Mousetrap = Mousetrap ? Mousetrap : null;

class KeyboardController{
    private mousetrap = null;
    private keydownMap = new keydownObject[]();

    constructor(){
        this.mousetrap = Mousetrap;
    }

    // keypress: keydown, keypress, keyup
    public bind(key:any, func:Function, keypress?:string, override?:bool, onup?:Function){
        var _func = function (e) { func(); };
        var _onup = function (e) { onup(); };

        if (override) {
            _func = function (e) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    // internet explorer
                    e.returnValue = false;
                }

                func();
            }
            _onup = function (e) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    // internet explorer
                    e.returnValue = false;
                }
                onup();
            };
        }
        
        if(keypress){
            if (keypress === "keypress") {
                this.keypressBind(key, _func, keypress, _onup);
                return;
            }
            
            this.mousetrap.bind(key, _func, keypress);

            if(onup){
                this.mousetrap.bind(key, _onup, "keyup");
            }
        }
        else
            this.mousetrap.bind(key, _func);
    }

    private keypressBind(key, func, keypress, onup?){
        var _obj = new keydownObject();
        _obj.key = key;
        _obj.func = func;
        this.keydownMap[key] = _obj;

        var _this = this;
        
        console.log(keypress);
        this.mousetrap.bind(key, function (e) {
            var temp = _this.keydownMap[key];
            if(temp.keypressed !== true){
                temp.keypressed = true;
                temp.func(e);
            }
        }, "keydown");

        this.mousetrap.bind(key, function (e) {
            _this.keydownMap[key].keypressed = false;
            if(onup)
                onup(e);
        }, "keyup");
    }

    public bindMap(keyMap:any[]){
        for (var i = 0; i < keyMap.length; i++){
            this.bind(keyMap[i].key, keyMap[i].func, keyMap[i].keypress, keyMap[i].onup);
        }
    }

    public unbind(key:string){
        this.mousetrap.unbind(key);
    }

    public trigger(key:string, keypress?:string){
        if(keypress)
            this.mousetrap.trigger(key, keypress);
        else
            this.mousetrap.trigger(key);
    }

    public reset(){
        this.mousetrap.reset();
    }
}

class keydownObject{
    public key: string = null;
    public keypressed: bool = false;
    public func: Function = function () { };
}