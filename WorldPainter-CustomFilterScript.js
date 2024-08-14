// This script extends the functionality of the WorldPainter API by enabling more flexible global operations. The standard WorldPainter API lacks the capability to combine multiple filters, such as "only on Sand" and "only on Water." This script addresses that limitation by allowing more complex and customizable operations for tedious global tasks.

// The first section of the script (up to line 420) defines the objects and methods required to perform these enhanced operations. Following that, several examples are provided to demonstrate usage. The syntax is designed to be as close to the original WorldPainter API as possible, ensuring ease of adoption for users familiar with the standard API.


// -------------------------------------------------------------------- //
// ------------------------- Helper Functions ------------------------- //
// -------------------------------------------------------------------- //


// Checks whether any layer in a given list of layers is present at specified coordinates
function isLayerAt(layerList, x_coord, y_coord){
    var listLength = layerList.length;
    for (var i = 0; i < listLength; i++){
        if (dimension.getBitLayerValueAt(layerList[i], x_coord, y_coord)){
            return true;
        }
    }
    return false;
}

// Checks whether the terrain type at specified coordinates is contained in a list of terrain types
function isTerrainAt(terrainList, x_coord, y_coord){
    var listLength = terrainList.length;
    var terrain = dimension.getTerrainAt(x_coord, y_coord);
    for (var i = 0; i < listLength; i++){
        if (terrain == terrainList[i]){
            return true;
        }
    }
    return false;
}

// Checks if the terrain at specified coordinates is below the water level
function isWater(x_coord,y_coord){
    return(dimension.getIntHeightAt(x_coord,y_coord) < dimension.getWaterLevelAt(x_coord,y_coord));
}

// Converts degrees to slope to compare with the return value of dimension.getSlope(x, y)
function degreesToSlope(deg){
    return(Math.tan(deg*(Math.PI/180)));
}



// --------------------------------------------------------------------- //
// --------------------- Object for Setting Layers --------------------- //
// --------------------------------------------------------------------- //


var setLayer = {

    // Initialize filter variables, which can be set by the user through the methods below
    layerNameVar: null,
    onlyOnTerrainFilter: [],
    exceptOnTerrainFilter: [],
    onlyOnLayerFilter: [],
    exceptOnLayerFilter: [],
    onlyOnWaterFilter: false,
    exceptOnWaterFilter: false,
    aboveLevelFilter: null,
    belowLevelFilter: null,
    aboveDegreesFilter: null,
    belowDegreesFilter: null,

    // Methods to set filters
    layerName: function(arg) {
        this.layerNameVar = arg;
        return this;
    },
    onlyOnTerrain: function() {
        this.onlyOnTerrainFilter = Array.prototype.slice.call(arguments); // Convert arguments to an array and store in onlyOnTerrainFilter
        return this;
    },
    exceptOnTerrain: function(){
        this.exceptOnTerrainFilter = Array.prototype.slice.call(arguments);
        return this;
    },
    onlyOnLayer: function() {
        this.onlyOnLayerFilter = Array.prototype.slice.call(arguments);
        return this;
    },
    exceptOnLayer: function(){
        this.exceptOnLayerFilter = Array.prototype.slice.call(arguments);
        return this;
    },
    onlyOnWater: function(){
        this.onlyOnWaterFilter = true;
        return this;
    },
    exceptOnWater: function(){
        this.exceptOnWaterFilter = true;
        return this;
    },
    aboveLevel: function(arg){
        this.aboveLevelFilter = arg;
        return this;
    },
    belowLevel: function(arg){
        this.belowLevelFilter = arg;
        return this;
    },
    aboveDegrees: function(arg){
        this.aboveDegreesFilter = degreesToSlope(arg);
        return this;
    },
    belowDegrees: function(arg){
        this.belowDegreesFilter = degreesToSlope(arg);
        return this;
    },

    // Method to set the layer based on filters
    go: function(){

        // Determine if onlyOnTerrainFilter and onlyOnLayerFilter are empty
        var isEmpty_onlyOnTerrainFilter = (this.onlyOnTerrainFilter.length == 0);
        var isEmpty_onlyOnLayerFilter = (this.onlyOnLayerFilter.length == 0);

        // Get dimension measurements
        var dimMeasure = dimension.getExtent();
        var dimHeight = dimMeasure.height * 128;
        var dimWidth = dimMeasure.width * 128;
        var xMin = dimMeasure.getX() * 128;
        var yMin = dimMeasure.getY()* 128;

        // Loop through all coordinates
        for (var x = xMin; x <= dimWidth; x++){
            for (var y = yMin; y <= dimHeight; y++){  

                var height = dimension.getIntHeightAt(x,y);
                var slope = dimension.getSlope(x,y);

                    // Check all conditions set by the user
                    if ((isEmpty_onlyOnTerrainFilter || isTerrainAt(this.onlyOnTerrainFilter, x, y)) 
                        && !isTerrainAt(this.exceptOnTerrainFilter, x, y) 
                        && (isEmpty_onlyOnLayerFilter || isLayerAt(this.onlyOnLayerFilter, x, y)) 
                        && !isLayerAt(this.exceptOnLayerFilter, x, y)
                        && (!this.onlyOnWaterFilter || isWater(x, y))
                        && (!this.exceptOnWaterFilter || !isWater(x, y))
                        && ((this.belowLevelFilter === null && this.aboveLevelFilter === null) 
                            || (this.belowLevelFilter !== null && height <= this.belowLevelFilter) 
                            || (this.aboveLevelFilter !== null && height >= this.aboveLevelFilter))
                        && ((this.belowDegreesFilter === null && this.aboveDegreesFilter === null) 
                            || (this.belowDegreesFilter !== null && slope <= this.belowDegreesFilter) 
                            || (this.aboveDegreesFilter !== null && slope >= this.aboveDegreesFilter))) {
                        dimension.setBitLayerValueAt(this.layerNameVar, x, y, true); // Set the layer if all conditions are met
                    }
                }
            }
        // Reset properties of setLayer object
        this.layerNameVar = null;
        this.onlyOnTerrainFilter = [];
        this.exceptOnTerrainFilter = [];
        this.onlyOnLayerFilter = [];
        this.exceptOnLayerFilter = [];
        this.onlyOnWaterFilter = false;
        this.exceptOnWaterFilter = false;
        this.aboveLevelFilter = null;
        this.belowLevelFilter = null;
        this.aboveDegreesFilter = null;
        this.belowDegreesFilter = null;

        print("Execution complete.");
        print("For updates and support, visit: https://github.com/BurgerXXL420/WorldPainter-CustomFilterScript.");
        print("Script by BurgerXXL.");
        print("Thank you for using this tool!");
        }
    };


    
// ---------------------------------------------------------------------- //
// --------------------- Object for Removing Layers --------------------- //
// ---------------------------------------------------------------------- //


var removeLayer = {

    // Initialize filter variables, which can be set by the user through the methods below
    layerNameVar: null,
    onlyOnTerrainFilter: [],
    exceptOnTerrainFilter: [],
    onlyOnLayerFilter: [],
    exceptOnLayerFilter: [],
    onlyOnWaterFilter: false,
    exceptOnWaterFilter: false,
    aboveLevelFilter: null,
    belowLevelFilter: null,
    aboveDegreesFilter: null,
    belowDegreesFilter: null,

    // Methods to set filters
    layerName: function(arg) {
        this.layerNameVar = arg;
        return this;
    },
    onlyOnTerrain: function() {
        this.onlyOnTerrainFilter = Array.prototype.slice.call(arguments); // Convert arguments to an array and store in onlyOnTerrainFilter
        return this;
    },
    exceptOnTerrain: function(){
        this.exceptOnTerrainFilter = Array.prototype.slice.call(arguments);
        return this;
    },
    onlyOnLayer: function() {
        this.onlyOnLayerFilter = Array.prototype.slice.call(arguments);
        return this;
    },
    exceptOnLayer: function(){
        this.exceptOnLayerFilter = Array.prototype.slice.call(arguments);
        return this;
    },
    onlyOnWater: function(){
        this.onlyOnWaterFilter = true;
        return this;
    },
    exceptOnWater: function(){
        this.exceptOnWaterFilter = true;
        return this;
    },
    aboveLevel: function(arg){
        this.aboveLevelFilter = arg;
        return this;
    },
    belowLevel: function(arg){
        this.belowLevelFilter = arg;
        return this;
    },
    aboveDegrees: function(arg){
        this.aboveDegreesFilter = degreesToSlope(arg);
        return this;
    },
    belowDegrees: function(arg){
        this.belowDegreesFilter = degreesToSlope(arg);
        return this;
    },

    // Method to set the layer based on filters
    go: function(){

        // Determine if onlyOnTerrainFilter and onlyOnLayerFilter are empty
        var isEmpty_onlyOnTerrainFilter = (this.onlyOnTerrainFilter.length == 0);
        var isEmpty_onlyOnLayerFilter = (this.onlyOnLayerFilter.length == 0);

        // Get dimension measurements
        var dimMeasure = dimension.getExtent();
        var dimHeight = dimMeasure.height * 128;
        var dimWidth = dimMeasure.width * 128;
        var xMin = dimMeasure.getX() * 128;
        var yMin = dimMeasure.getY()* 128;

        // Loop through all coordinates
        for (var x = xMin; x <= dimWidth; x++){
            for (var y = yMin; y <= dimHeight; y++){  

                var height = dimension.getIntHeightAt(x,y);
                var slope = dimension.getSlope(x,y);

                    // Check all conditions set by the user
                    if ((isEmpty_onlyOnTerrainFilter || isTerrainAt(this.onlyOnTerrainFilter, x, y)) 
                        && !isTerrainAt(this.exceptOnTerrainFilter, x, y) 
                        && (isEmpty_onlyOnLayerFilter || isLayerAt(this.onlyOnLayerFilter, x, y)) 
                        && !isLayerAt(this.exceptOnLayerFilter, x, y)
                        && (!this.onlyOnWaterFilter || isWater(x, y))
                        && (!this.exceptOnWaterFilter || !isWater(x, y))
                        && ((this.belowLevelFilter === null && this.aboveLevelFilter === null) 
                            || (this.belowLevelFilter !== null && height <= this.belowLevelFilter) 
                            || (this.aboveLevelFilter !== null && height >= this.aboveLevelFilter))
                        && ((this.belowDegreesFilter === null && this.aboveDegreesFilter === null) 
                            || (this.belowDegreesFilter !== null && slope <= this.belowDegreesFilter) 
                            || (this.aboveDegreesFilter !== null && slope >= this.aboveDegreesFilter))) {
                        dimension.setBitLayerValueAt(this.layerNameVar, x, y, false); // Remove the layer if all conditions are met
                    }
                }
            }
        // Reset properties of removeLayer object
        this.layerNameVar = null;
        this.onlyOnTerrainFilter = [];
        this.exceptOnTerrainFilter = [];
        this.onlyOnLayerFilter = [];
        this.exceptOnLayerFilter = [];
        this.onlyOnWaterFilter = false;
        this.exceptOnWaterFilter = false;
        this.aboveLevelFilter = null;
        this.belowLevelFilter = null;
        this.aboveDegreesFilter = null;
        this.belowDegreesFilter = null;

        print("Execution complete.");
        print("For updates and support, visit: https://github.com/BurgerXXL420/WorldPainter-CustomFilterScript.");
        print("Script by BurgerXXL.");
        print("Thank you for using this tool!");
        }
    };



// ---------------------------------------------------------------------- //
// --------------------- Object for Setting Terrain --------------------- //
// ---------------------------------------------------------------------- //


var setTerrain = {

    // Initialize filter variables, which can be set by the user through the methods below
    terrainNameVar: null,
    onlyOnTerrainFilter: [],
    exceptOnTerrainFilter: [],
    onlyOnLayerFilter: [],
    exceptOnLayerFilter: [],
    onlyOnWaterFilter: false,
    exceptOnWaterFilter: false,
    aboveLevelFilter: null,
    belowLevelFilter: null,
    aboveDegreesFilter: null,
    belowDegreesFilter: null,

    // Methods to set filters
    terrainName: function(arg) {
        this.terrainNameVar = arg;
        return this;
    },
    onlyOnTerrain: function() {
        this.onlyOnTerrainFilter = Array.prototype.slice.call(arguments); // Convert arguments to an array and store in onlyOnTerrainFilter
        return this;
    },
    exceptOnTerrain: function(){
        this.exceptOnTerrainFilter = Array.prototype.slice.call(arguments);
        return this;
    },
    onlyOnLayer: function() {
        this.onlyOnLayerFilter = Array.prototype.slice.call(arguments);
        return this;
    },
    exceptOnLayer: function(){
        this.exceptOnLayerFilter = Array.prototype.slice.call(arguments);
        return this;
    },
    onlyOnWater: function(){
        this.onlyOnWaterFilter = true;
        return this;
    },
    exceptOnWater: function(){
        this.exceptOnWaterFilter = true;
        return this;
    },
    aboveLevel: function(arg){
        this.aboveLevelFilter = arg;
        return this;
    },
    belowLevel: function(arg){
        this.belowLevelFilter = arg;
        return this;
    },
    aboveDegrees: function(arg){
        this.aboveDegreesFilter = degreesToSlope(arg);
        return this;
    },
    belowDegrees: function(arg){
        this.belowDegreesFilter = degreesToSlope(arg);
        return this;
    },

    // Method to set the layer based on filters
    go: function(){

        // Determine if onlyOnTerrainFilter and onlyOnLayerFilter are empty
        var isEmpty_onlyOnTerrainFilter = (this.onlyOnTerrainFilter.length == 0);
        var isEmpty_onlyOnLayerFilter = (this.onlyOnLayerFilter.length == 0);

        // Get dimension measurements
        var dimMeasure = dimension.getExtent();
        var dimHeight = dimMeasure.height * 128;
        var dimWidth = dimMeasure.width * 128;
        var xMin = dimMeasure.getX() * 128;
        var yMin = dimMeasure.getY()* 128;

        // Loop through all coordinates
        for (var x = xMin; x <= dimWidth; x++){
            for (var y = yMin; y <= dimHeight; y++){  

                var height = dimension.getIntHeightAt(x,y);
                var slope = dimension.getSlope(x,y);

                    // Check all conditions set by the user
                    if ((isEmpty_onlyOnTerrainFilter || isTerrainAt(this.onlyOnTerrainFilter, x, y)) 
                        && !isTerrainAt(this.exceptOnTerrainFilter, x, y) 
                        && (isEmpty_onlyOnLayerFilter || isLayerAt(this.onlyOnLayerFilter, x, y)) 
                        && !isLayerAt(this.exceptOnLayerFilter, x, y)
                        && (!this.onlyOnWaterFilter || isWater(x, y))
                        && (!this.exceptOnWaterFilter || !isWater(x, y))
                        && ((this.belowLevelFilter === null && this.aboveLevelFilter === null) 
                            || (this.belowLevelFilter !== null && height <= this.belowLevelFilter) 
                            || (this.aboveLevelFilter !== null && height >= this.aboveLevelFilter))
                        && ((this.belowDegreesFilter === null && this.aboveDegreesFilter === null) 
                            || (this.belowDegreesFilter !== null && slope <= this.belowDegreesFilter) 
                            || (this.aboveDegreesFilter !== null && slope >= this.aboveDegreesFilter))) {
                        dimension.setTerrainAt(x, y, this.terrainNameVar); // Set the terrain if all conditions are met
                    }
                }
            }
        // Reset properties of removeLayer object
        this.terrainName = null;
        this.onlyOnTerrainFilter = [];
        this.exceptOnTerrainFilter = [];
        this.onlyOnLayerFilter = [];
        this.exceptOnLayerFilter = [];
        this.onlyOnWaterFilter = false;
        this.exceptOnWaterFilter = false;
        this.aboveLevelFilter = null;
        this.belowLevelFilter = null;
        this.aboveDegreesFilter = null;
        this.belowDegreesFilter = null;

        print("Execution complete.");
        print("For updates and support, visit: https://github.com/BurgerXXL420/WorldPainter-CustomFilterScript.");
        print("Script by BurgerXXL.");
        print("Thank you for using this tool!");
        }
    };



// --------------------------------------------------------------------- //
// ------------------- HERE THE ACTUAL SCRIPT BEGINS ------------------- //
// --------------------------------------------------------------------- //

// Usage of methods for setting layers, removing layers, and setting terrain:

// For setting a layer:
setLayer.layerName(my_layer0) // Required. Load my_layer0 first. See WorldPainter API documentation or the example below.
        .aboveLevel(122) // Optional. Apply the operation at and above the specified terrain level.
        .belowLevel(40) // Optional. Apply the operation at and below the specified terrain level.
        .aboveDegrees(45) // Optional. Apply the operation on slopes steeper than the specified degree.
        .belowDegrees(20) // Optional. Apply the operation on slopes less steep than the specified degree.
        .onlyOnTerrain(my_terrain1, my_terrain2) // Optional. Apply the operation only on the specified terrains. Multiple terrains can be entered, separated by commas. Ensure terrain is loaded first.
        .onlyOnLayer(my_layer1, my_layer2) // Optional. Apply the operation only on the specified layers. Multiple layers can be entered, separated by commas. Ensure layers are loaded first.
        .onlyOnWater() // Optional. Apply the operation only on flooded areas.
        .exceptOnTerrain(my_terrain1, my_terrain2) // Optional. Exclude the specified terrains from the operation.
        .exceptOnLayer(my_layer1, my_layer2) // Optional. Exclude the specified layers from the operation.
        .exceptOnWater() // Optional. Exclude flooded areas from the operation.
        .go(); // Required. Executes the layer placement under the specified conditions.


// For removing a layer:
removeLayer.layerName(my_layer0) // Required. Load my_layer0 first. See WorldPainter API documentation or the example below.
        .aboveLevel(122) // Optional. Remove the layer at and above the specified terrain level.
        .belowLevel(40) // Optional. Remove the layer at and below the specified terrain level.
        .aboveDegrees(45) // Optional. Remove the layer on slopes steeper than the specified degree.
        .belowDegrees(20) // Optional. Remove the layer on slopes less steep than the specified degree.
        .onlyOnTerrain(my_terrain1, my_terrain2) // Optional. Remove the layer only from the specified terrains. Multiple terrains can be entered, separated by commas. Ensure terrain is loaded first.
        .onlyOnLayer(my_layer1, my_layer2) // Optional. Remove the layer only from the specified layers. Multiple layers can be entered, separated by commas. Ensure layers are loaded first.
        .onlyOnWater() // Optional. Remove the layer only from flooded areas.
        .exceptOnTerrain(my_terrain1, my_terrain2) // Optional. Exclude the specified terrains from layer removal.
        .exceptOnLayer(my_layer1, my_layer2) // Optional. Exclude the specified layers from layer removal.
        .exceptOnWater() // Optional. Exclude flooded areas from layer removal.
        .go(); // Required. Executes the removal of the layer under the specified conditions.


// For setting terrain:
setTerrain.terrainName(my_terrain0) // Required. Load my_terrain0 first. See WorldPainter API documentation or the example below.
        .aboveLevel(122) // Optional. Apply the terrain only at and above the specified terrain level.
        .belowLevel(40) // Optional. Apply the terrain only at and below the specified terrain level.
        .aboveDegrees(45) // Optional. Apply the terrain on slopes steeper than the specified degree.
        .belowDegrees(20) // Optional. Apply the terrain on slopes less steep than the specified degree.
        .onlyOnTerrain(my_terrain1, my_terrain2) // Optional. Apply the terrain only on the specified terrains. Multiple terrains can be entered, separated by commas. Ensure terrain is loaded first.
        .onlyOnLayer(my_layer1, my_layer2) // Optional. Apply the terrain only on the specified layers. Multiple layers can be entered, separated by commas. Ensure layers are loaded first.
        .onlyOnWater() // Optional. Apply the terrain only on flooded areas.
        .exceptOnTerrain(my_terrain1, my_terrain2) // Optional. Exclude the specified terrains from applying the terrain.
        .exceptOnLayer(my_layer1, my_layer2) // Optional. Exclude the specified layers from applying the terrain.
        .exceptOnWater() // Optional. Exclude flooded areas from applying the terrain.
        .go(); // Required. Executes the application of the terrain under the specified conditions.

// Note: The order of the methods does not matter as long as .go() is called last.

// ------ Working Example ------ //

// Loading layers from files
var red_carpet = wp.getLayer()
    .fromFile("C:\\WorldPainter\\Scripts\\Layers\\red_carpet.layer")
    .go();

var prismarine_slab_bottom = wp.getLayer()
    .fromFile("C:\\WorldPainter\\Scripts\\Layers\\prismarine_slab_bottom.layer")
    .go();

// Loading terrain types
// Refer to https://www.worldpainter.net/javadoc/org/pepsoft/worldpainter/Terrain.html 
// under Enum Constant Summary for the correct identifier for each terrain type
var sand = org.pepsoft.worldpainter.Terrain.valueOf("SAND");
var mossyCobblestone = org.pepsoft.worldpainter.Terrain.valueOf("MOSSY_COBBLESTONE");

// Load custom terrain. "CUSTOM_1" refers to the identifier for the terrain slot in the Custom Terrains tab within WorldPainter. Alternatively, this can also be loaded from a file, see WorldPainter API documentation.
var customTerrain = org.pepsoft.worldpainter.Terrain.valueOf("CUSTOM_1"); 

// Example 1: Set red carpet layer only on sand and mossy cobblestone terrain, except on water and prismarine slab bottom layer, above level 75
setLayer.layerName(red_carpet)
    .onlyOnTerrain(sand, mossyCobblestone)
    .exceptOnWater()
    .exceptOnLayer(prismarine_slab_bottom)
    .aboveLevel(75)
    .go();

// Example 2: Remove red carpet layer only on mossy cobblestone terrain, above slope of 38 degrees
removeLayer.layerName(red_carpet)
    .onlyOnTerrain(mossyCobblestone)
    .aboveDegrees(38)
    .go();

// Example 3: Set mossy cobblestone terrain only on sand terrain, except on red carpet and prismarine slab bottom layers
setTerrain.terrainName(mossyCobblestone)
    .onlyOnTerrain(sand)
    .exceptOnLayer(red_carpet, prismarine_slab_bottom)
    .go();

