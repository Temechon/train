/**
 * This class will handle all the GUI display
 */
class GUIManager {
    
    private _scene : BABYLON.Scene;
    
    private _game : Game;
    
    // The gui canvas where all data will be displayed
    private _canvas2D : BABYLON.ScreenSpaceCanvas2D;
    
    // All text displaying resources
    private _resourcesText : ResourceMap<BABYLON.Text2D> = [];
    
    
    constructor(game:Game){
        
        this._game = game;
        this._scene = game.scene;
        
        this._canvas2D = new BABYLON.ScreenSpaceCanvas2D(this._scene, {id: "game_screencanvas"});
    }
    
    /**
     * Create a group2D for each resources. Each group is composed of a sprite and a text2D
     */
    private _initResourcesTexts() {
        // Wood
        let textureWood = new BABYLON.Texture("img/gui/resource.png", this._scene, true, true);
        let spriteWood = new BABYLON.Sprite2D(textureWood,{x:0, y:0, spriteSize: new BABYLON.Size(80,80)}); 
        let text2DWood = new BABYLON.Text2D(this._game.resources[Resources.Wood].toString(), { x:50, marginAlignment: "h: center, v: center" });        
        let groupWood = new BABYLON.Group2D({x:60, y:800, parent: this._canvas2D, children: [spriteWood, text2DWood]});
        
        // Rock
        let textureRock = new BABYLON.Texture("img/gui/resource.png", this._scene, true, true);
        let spriteRock = new BABYLON.Sprite2D(textureRock,{x:0, y:0, spriteSize: new BABYLON.Size(80,80)}); 
        let text2DRock = new BABYLON.Text2D(this._game.resources[Resources.Rock].toString(), { x:50, marginAlignment: "h: center, v: center" });        
        let groupRock = new BABYLON.Group2D({x:200, y:800, parent: this._canvas2D, children: [spriteRock, text2DRock]});
        
        // Meat
        let textureMeat = new BABYLON.Texture("img/gui/resource.png", this._scene, true, true);
        let spriteMeat = new BABYLON.Sprite2D(textureMeat,{x:0, y:0, spriteSize: new BABYLON.Size(80,80)}); 
        let text2DMeat = new BABYLON.Text2D(this._game.resources[Resources.Meat].toString(), { x:50, marginAlignment: "h: center, v: center" });        
        let groupMeat = new BABYLON.Group2D({x:340, y:800, parent: this._canvas2D, children: [spriteMeat, text2DMeat]});
        
        this._resourcesText[Resources.Wood] = text2DWood;
        this._resourcesText[Resources.Rock] = text2DRock;
        this._resourcesText[Resources.Meat] = text2DMeat; 
    } 
    
    /**
     * Update the resource value displayed in the GUI
     */
    public updateResourceText(value:number, res:Resources) {
        this._resourcesText[res].text = value.toString();
    }
    
    /**
     * Create the 'static' button : 
     * - Build
     * - Gather wood
     * ...
     */
    public initHUD() {
        
        this._initResourcesTexts();
        
        let buttonBuild = new BABYLON.Rectangle2D(
		{ 	parent: this._canvas2D, id: "build", x: 60, y: 100, width: 100, height: 40, 
			fill: "#40C040FF",
			children: 
			[
				new BABYLON.Text2D("Build", { marginAlignment: "h: center, v: center" })
			]
		});
        // Add action to the build button
        buttonBuild.pointerEventObservable.add(this._game.build.bind(this._game), BABYLON.PrimitivePointerInfo.PointerUp); 

        // Gather wood
        let buttonWood = new BABYLON.Rectangle2D(
		{ 	parent: this._canvas2D, id: "gatherWood", x: 180, y: 100, width: 120, height: 40, 
			fill: "#40C040FF",
			children: 
			[
				new BABYLON.Text2D("Gather Wood", { marginAlignment: "h: center, v: center" })
			]
		});
        // Add action to the button
        buttonWood.pointerEventObservable.add(this._game.gatherWood.bind(this._game), BABYLON.PrimitivePointerInfo.PointerUp);
        
        // Gather wood
        let buttonRock = new BABYLON.Rectangle2D(
		{ 	parent: this._canvas2D, id: "gatherRock", x: 320, y: 100, width: 120, height: 40, 
			fill: "#40C040FF",
			children: 
			[
				new BABYLON.Text2D("Gather Rock", { marginAlignment: "h: center, v: center" })
			]
		});
        // Add action to the button
        buttonRock.pointerEventObservable.add(this._game.gatherRock.bind(this._game), BABYLON.PrimitivePointerInfo.PointerUp);
    }
    
    /**
     * Display the number of resource generated above the given node
     */
    public displayResourceCounter(node:BABYLON.Node){        
        
        var texture = new BABYLON.Texture("img/gui/increment.png", this._scene, true, true);
        let sprite = new BABYLON.Sprite2D(texture,
		{
			x:-17, y:0, spriteSize: new BABYLON.Size(35, 59)
		}); 
        
        let groupNode = new BABYLON.Group2D({parent: this._canvas2D, width:1 /* BUG IN CANVAS2D */, trackNode: node,children: [sprite]});
                
        this._createAndStartCounterAnimation(sprite, 1500, () => {
            sprite.dispose();
            groupNode.dispose();
        });
    }
    
    /**
     * Create a simple animation
     * @param p The sprite position in pixels
     * @param duration The animation duration in milliseconds 
     */
    private _createAndStartCounterAnimation = function(obj:BABYLON.RenderablePrim2D, duration : number, callback?: () => void) : void {
        var quarter = duration*60*0.001/4;

        // Position animation
        var position = new BABYLON.Animation("position", "y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        position.setKeys([
            { frame: 0, value: obj.y },
            { frame: quarter*4, value: obj.y + 75 }
        ]); 
        var e = new BABYLON.ExponentialEase();
        e.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        position.setEasingFunction(e);
        obj.animations.push(position);
        
        // Scale
        var scale = new BABYLON.Animation("scale", "scale", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        scale.setKeys([
            { frame: 0, value: 0 },
            { frame: quarter*4, value: 1 }
        ]); 
        var f = new BABYLON.ElasticEase();
        f.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        scale.setEasingFunction(f);
        obj.animations.push(scale);
        
        // Opacity animation
        var opacity = new BABYLON.Animation("opacity", "opacity", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        opacity.setKeys([
            { frame: 0, value: 1 },
            { frame: quarter*2, value: 1 },
            { frame: quarter*4, value: 0.0  } 
        ]); 
        obj.animations.push(opacity);

        this._scene.beginAnimation(obj, 0, quarter*4, false, 1, callback);
    }
}