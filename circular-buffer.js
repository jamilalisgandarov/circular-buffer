// Resources used to learn about Circular Buffer (Circular Queue)
// * https://www.geeksforgeeks.org/circular-queue-set-1-introduction-array-implementation/
// * https://www.simplilearn.com/tutorials/data-structure-tutorial/circular-queue-in-data-structure
// * https://www.youtube.com/watch?v=uvD9_Wdtjtw
// * https://betterprogramming.pub/now-buffering-7a7d384faab5

class CircularBuffer {
  #capacity;
  #initialPoint = -1;
  #size = 0;
  #start = this.#initialPoint;
  #end = this.#initialPoint;
  #list = [];

  constructor(capacity, initialValues = []) {
    const _capacity = Number(capacity);
  
    if(!_capacity || isNaN(_capacity) || _capacity<2){
      throw new Error('Capacity must be a number which is greater than or equal to 2.');
    }

    if(!Array.isArray(initialValues)){
      throw new Error('Initial values should be passed as an array.');
    }

    if(initialValues.length > capacity){
      throw new Error(`Initial values size should be less than or equal to capacity.`);
    }

    this.#capacity = _capacity;


    this.#list = Array(...initialValues);
    this.#list.length = _capacity;
  }

  #isEmpty(){
    return this.#size === 0;
  }

  #isFull(){
    return this.#size === this.#capacity;
  }

  write(item,forceWrite = false) {
    if(this.#isFull() && !forceWrite){
      throw new BufferFullError(); 
    }

    if(forceWrite){
      this.#start = (this.#start+1)%this.#capacity;
    }else{
      this.#size+=1;
    }

    this.#end = (this.#end+1)%this.#capacity;
    this.#list[this.#end] = item;

    if(this.#start === this.#initialPoint){
      this.#start = this.#end;
    }
  }

  read() {
    if(!this.#isEmpty()){
      let item = this.#list[this.#start];

      this.#list[this.#start] = undefined;
      this.#start = (this.#start+1)%this.#capacity;
      this.#size-=1;
      
      if(this.#size === 0){
        this.#start = this.#initialPoint;
        this.#end = this.#initialPoint; 
      }

      return item;
    }

    throw new BufferEmptyError();
  }

  forceWrite(item) {
    this.write(item,true);
  }

  clear() {
    this.#list = Array(this.#capacity).fill(undefined);
    this.#start = this.#initialPoint;
    this.#end = this.#initialPoint;
    this.#size = 0;
  }

  getSize(){
    return this.#size;
  }

  getListAsArray(){
    return this.#list;
  }
}

export default CircularBuffer;

export class BufferFullError extends Error {
  constructor() {
    super('Buffer is full.');

    Object.setPrototypeOf(this, BufferFullError.prototype);
  }
}

export class BufferEmptyError extends Error {
  constructor() {
    super("Buffer doesn't have any element.");

    Object.setPrototypeOf(this, BufferEmptyError.prototype);
  }
}

