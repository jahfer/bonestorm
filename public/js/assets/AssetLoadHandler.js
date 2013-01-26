var AssetLoadHandler = (function () {
    function AssetLoadHandler() {
        this.Assets = new Array();
        this.nameArray = new Array();
        this.objArray = new Array();
        this.initialized = false;
        this.callback = function () {
        };
    }
    AssetLoadHandler.prototype.addAsset = function (name, asset) {
        if(this.nameArray[name]) {
            return false;
        }
        this.nameArray[name] = this.Assets.length;
        this.Assets.push(asset);
    };
    AssetLoadHandler.prototype.setCallback = function (callback) {
        this.callback = callback;
        return this;
    };
    AssetLoadHandler.prototype.load = function () {
        var _this = this;
        for(var i = 0; i < this.Assets.length; i++) {
            var tempCallback = this.Assets[i].callback;
            this.Assets[i].callback = ((function (that) {
                return function () {
                    that.onload();
                    if(tempCallback) {
                        tempCallback();
                    }
                }
            })(this));
            this.Assets[i].load();
        }
    };
    AssetLoadHandler.prototype.get = function (name) {
        if(this.nameArray[name] != undefined) {
            return this.Assets[this.nameArray[name]];
        }
        return null;
    };
    AssetLoadHandler.prototype.getAll = function (name) {
        var _temp = [];
        for(var i = 0; i < name.length; i++) {
            _temp.push({
                name: name[i],
                asset: this.get(name[i])
            });
        }
        return _temp;
    };
    AssetLoadHandler.prototype.pushTo = function (obj, names) {
        console.log("pushTo" + names[0]);
        obj.pushAsset(this.getAll(names));
    };
    AssetLoadHandler.prototype.pushFrom = function (obj, names) {
        console.log("pushFrom " + names[0]);
        this.objArray.push({
            _obj: obj,
            _name: names
        });
        if(this.initialized) {
            this.initializeAll();
        }
    };
    AssetLoadHandler.prototype.initializeAll = function () {
        var temp;
        console.log("initAll");
        console.log(this.objArray);
        while(temp = this.objArray.pop()) {
            this.pushTo(temp._obj, temp._name);
        }
    };
    AssetLoadHandler.prototype.onload = function () {
        var _init = true;
        for(var i = 0; i < this.Assets.length; i++) {
            if(this.Assets[i].initialized === false) {
                _init = false;
                break;
            }
        }
        if(_init) {
            console.log("init");
            this.initialized = true;
            this.initializeAll();
            this.callback();
            return true;
        }
        return false;
    };
    AssetLoadHandler.prototype.reset = function () {
        this.Assets.length = 0;
        this.nameArray.length = 0;
        this.objArray.length = 0;
    };
    return AssetLoadHandler;
})();
//@ sourceMappingURL=AssetLoadHandler.js.map
