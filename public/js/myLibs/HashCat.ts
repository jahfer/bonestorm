class HashCat{
    public array:Array;

    constructor(map?){
        this.array = map ? map : new Array();
    }

    public addKey(name:string, value){
        if(this.array[name]) {
            return false;
        }
        this.array[name] = value;
        return true;
    }

    public removeKey(name:string){
        if(this.array[name]){
            delete this.array[name];
            return true;
        }
        return false;
    }

    public get(name:string){
        return this.array[name];
    }

    public set(name:string, value){
        if(this.array[name]){
            this.array[name] = value;
            return true;
        }
        return false;
    }
}