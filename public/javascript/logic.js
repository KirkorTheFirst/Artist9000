//(this is the big scary algorithm)
/**
 * @param {Array} drawing 3d array of our drawing
 * @returns heap of similar items sorted by similarity (%)
 */
function compare(drawing){

    let items = getItems();
    //then find the ones that are similar and how similar (%)
    let similarityMap = getSimilarity(items, drawing);
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

function getSlopes(arr){
    let i = 0;
    let slopes = new Array();
    for (let stroke of arr){
      slopes.push(new Array());
      let currentSlope = 0;
      let temp = 0;
      for (let j = 0; j < stroke[0].length - 1; j++){
        let x = stroke[0][j];
        let y = stroke[1][j];


        let deltaX = (stroke[0][j + 1] - x);
        let deltaY = (stroke[1][j + 1] - y);
        if (deltaX == 0) deltaX = 1;
        if (deltaY == 0) deltaY = 1; 
        let tempSlope = deltaY/deltaX;

        if (currentSlope != 0){
            slopes[i].push(currentSlope);
            currentSlope = tempSlope;
        } else currentSlope = tempSlope;
        temp++;
      }
      if (slopes[i][slopes[i].length - 1] != currentSlope){
        slopes[i].push(currentSlope);
      }
      i++;
    }
    return slopes;
}

/**
 * compares our drawing to each items and ranks similarity
 * @param {MediaPositionState} items map of all item categories and an array of images
 * @param {Array} drawing the user-created drawing 3d array
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
