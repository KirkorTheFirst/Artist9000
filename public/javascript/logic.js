let ourDrawing = new Image(28, 28);
ourDrawing.src = sessionStorage.getItem("canvasURL");

//(this is the big scary algorithm)
/**
 * @returns heap of similar items sorted by similarity (%)
 */
function compare(){
    //first get the items
    let items = getItems();
    //then find the ones that are similar and how similar (%)
    let similarityMap = getSimilarity(items, ourDrawing);
    //sort in heap
    return toHeap(similarityMap);
}

/**
 * gets all the items from the database and puts them in a map with each key pointing to an array of the images
 * @returns map of all item categories and an array of images that were recognized as true
 */
function getItems(){
    let items = new Map();
    return items;
}

/**
 * reformats our drawing to specified dimensions
 * @param {} drawing 
 * @param {*} width 
 * @param {*} height 
 */
function reformatDrawing(drawing, width, height){

}

/**
 * compares our drawing to each items and ranks similarity
 * @param {*} items map of all item categories and an array of images
 * @param {Image} drawing the user-created drawing (28x28)
 * @returns map of all items and their similarity to our drawing
 */
function getSimilarity(items, drawing){
    let similarityMap = new Map();
    return similarityMap;
}

/**
 * @param {Map} map of similar categories and its similarity value (%)
 * @returns sorted heap of items based on similarity
 */
function toHeap(map){
    let heap = new Heap();
    
    return heap;
}
