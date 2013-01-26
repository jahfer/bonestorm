/// <reference path="../assets/Level.ts" />
/// <reference path="../assets/AssetLoadHandler.ts" />
/// <reference path="DrawAppFrame.ts" />
/// <reference path="CanvasLayers.ts" />
/// <reference path="HashCat.ts" />

class CatBucket extends AppFrameDrawn{
    public name: string = "CAT BUCKET v1.1";

    public currentLevel: Level;
    private currentLevelIndex: number = 0;

    public Levels: Level[] = new Level[]();
    private levelNames: number[] = new number[]();

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private drawCtrl: CanvasLayerControl = null;
    
    private keyboard: KeyboardController = null;
    private mouse: CatMouse = null;

    public settings: HashCat = new HashCat();

    public AssetHandler: AssetLoadHandler = new AssetLoadHandler();

    constructor(fps: number){
        super(fps);
    }

    public addLevel(level: Level){

    }
}