var HashCat = (function () {
    function HashCat(map) {
        this.array = map ? map : new Array();
    }
    HashCat.prototype.addKey = function (name, value) {
        if(this.array[name]) {
            return false;
        }
        this.array[name] = value;
        return true;
    };
    HashCat.prototype.removeKey = function (name) {
        if(this.array[name]) {
            delete this.array[name];
            return true;
        }
        return false;
    };
    HashCat.prototype.get = function (name) {
        return this.array[name];
    };
    HashCat.prototype.set = function (name, value) {
        if(this.array[name]) {
            this.array[name] = value;
            return true;
        }
        return false;
    };
    return HashCat;
})();
//@ sourceMappingURL=HashCat.js.map
