/// <reference path="Asset.ts" />

class AssetLoadHandler{
    public Assets:Asset[] = new Asset[]();
    private nameArray: any[] = new Array();
    private objArray: any[] = new Array();

    public initialized: bool = false;

    public callback: Function = function () { };
    
    constructor(){

    }

    public addAsset(name:string, asset:Asset){
        if(this.nameArray[name]){ return false;}

        this.nameArray[name] = this.Assets.length;
        this.Assets.push(asset);
    }

    public setCallback(callback:Function){
        this.callback = callback;
        return this;
    }

    public load(){
        var _this = this;

        for (var i = 0; i < this.Assets.length; i++){
            var tempCallback = this.Assets[i].callback;
            this.Assets[i].callback = (function(that) { return function () {
                that.onload();
                if (tempCallback)
                    tempCallback();
             } }(this));
            this.Assets[i].load();
        }
        //this.Assets.forEach(function (asset, i) {
        //    asset.callback = (function (that) { return that.onload }(_this));
        //    asset.load();
        //});
    }

    public get(name:string){
        if (this.nameArray[name] != undefined) { return this.Assets[this.nameArray[name]]; }
        
        return null;
    }

    public getAll(name:string[]){
        var _temp = [];

        for (var i = 0; i < name.length; i++) {
            _temp.push({
                name: name[i],
                asset: this.get(name[i])
            });
        }

        return _temp;
    }

    // When the load is complete push assets to those who requested
    private pushTo(obj:any, names:string[]){
        console.log("pushTo" + names[0]);
        obj.pushAsset(this.getAll(names));
    }

    // Setting callback params to push the assets to the obj.
    public pushFrom(obj:any, names:string[]){
        console.log("pushFrom " + names[0]);
        this.objArray.push({ _obj: obj, _name: names});
        if (this.initialized) { this.initializeAll(); }
    }

    private initializeAll(){
        var temp;
        console.log("initAll");
        console.log(this.objArray);
        while(temp = this.objArray.pop()){
            this.pushTo(temp._obj, temp._name);
        }
        //for (var i = 0; i < this.objarray.length; i++){
        //    this.pushto(this.objarray[i]._obj, this.objarray[i]._name);
        //}
    }

    // Check if loaded and run if all assets have been loaded.
    public onload(){
        var _init = true;
        for (var i = 0; i < this.Assets.length; i++){
            if(this.Assets[i].initialized === false){
                _init = false;
                break;
            }
        }

        if(_init){
            console.log("init");
            this.initialized = true;
            this.initializeAll();
            this.callback();
            return true;
        }
        return false;
    }

    public reset(){
        this.Assets.length = 0;
        this.nameArray.length = 0;
        this.objArray.length = 0;
    }
}