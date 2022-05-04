/**
 * a generic Heap
 * @author Finn Taylor
 */
 class Heap {
    #arr = []
    /**
     * the comparator of the heap
     * @param {Function} comparator the comparator method to compare data
     */
    constructor(comparator) {
        if(comparator) {
            this.comparator = comparator
        }
    }
    /**
     * checks if the heap is empty. 
     * @returns true if heap is empty, false if not. 
     * O(1)
     */
    isEmpty() {
        if(this.#arr.length === 0) {
            return true
        }
        return false
    }
    /**
     * pushes data into the heap. 
     * @param {*} data the data to add to the heap
     * O(log n)
     */
    push(data) {
        this.#arr.push(data)
        this.#heapifyUp()
    }
    /**
     * removes the first item from the heap, and then heapify downs. 
     * @returns the data that has been removed from the heap
     * O(log n)
     */
    pop() {
        if(this.isEmpty()) {
            return null
        }
        let poppedData = this.#arr[0]
        let last = this.#arr.pop()
        if(!this.isEmpty()) {
            this.#arr[0] = last
            this.#heapifyDown()
        }
        return poppedData
    }
    /**
     * checks the value of data inside a heap at an index. 
     * @param {number} index the index to look inside the heap
     * @returns the value of the index inside the heap
     * O(1)
     */
    peek(index) {
        return this.#arr[index]
    }
    /**
     * finds the length of the heap
     * @returns the length of the heap
     * O(1)
     */
    length() {
        return this.#arr.length
    }
    // O(n)
    #heapifyUp() {
        let index = this.#arr.length - 1
         while(this.#arr[index] && index >= 0) { 
            let parent = Math.ceil(index / 2) - 1
            if(parent >= 0 && this.comparator(this.#arr[parent], this.#arr[index]) > 0) {
                let temp = this.#arr[parent];
                this.#arr[parent] = this.#arr[index];
                this.#arr[index] = temp;
            }
            else {
                break;
            }
            index = parent;
        }
    }
    // O(log n)
    #heapifyDown() {
        let index = 0
        let done = false
        while(!done) {
            let leftChild = (index * 2) + 1
            let rightChild = (index * 2) + 2
            let whoIsSmaller = index
            if( this.#arr[leftChild] && this.comparator(this.#arr[whoIsSmaller], this.#arr[leftChild]) > 0 ) {
                whoIsSmaller = leftChild
            } 
            if (this.#arr[rightChild] && this.comparator(this.#arr[whoIsSmaller], this.#arr[rightChild]) > 0){
                whoIsSmaller = rightChild
            }
            if(whoIsSmaller !== index) {
                let temp = this.#arr[index]
                this.#arr[index] = this.#arr[whoIsSmaller]
                this.#arr[whoIsSmaller] = temp
                index = whoIsSmaller
            } else {
                done = true
            }       
        }
    }
    /**
     * prints the heap to the console. 
     * O(1)
     */
    printValues() {
        console.log(this.#arr)
    }
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
