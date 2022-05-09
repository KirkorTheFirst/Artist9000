completeDataset = completeDataset.split('ß')
completeDataset.pop()
let jsonItems = {}
for(let i = 0; i < completeDataset.length; i++) {
    console.log(JSON.parse(completeDataset[i]))
}   
let heap = new Heap(function(a, b) {
    if(a < b) {
        return -1
    } else if (a === b) {
        return 0
    } else {
        return 1
    }
})
let ourDrawing = new Image(255, 255);
ourDrawing.src = sessionStorage.getItem("canvasURL");

/**
 * @returns heap of similar items sorted by similarity (%)
 */
function compare(){
    //reformat our drawing
    convertToArray(ourDrawing)
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
 * @param {Image} drawing
 */
function convertToArray(drawing){

    //use ImageData
}

/**
 * compares our drawing to each items and ranks similarity
 * @param {MediaPositionState} items map of all item categories and an array of images
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

    return heap;
}