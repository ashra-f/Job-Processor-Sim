class Queue {
    arrPtr = {Job: null};                           // array to store queue elements
    head = {Job: null}; 
    capacity = TOTAL_NUM_OF_JOBS;                   // maximum capacity of the queue
    front;                                          // points to the front element in the queue
    rear;                                           // points to the last element in the queue
    currentQSize;                                   // current queue size

    constructor() {
        var jobs = new Array(TOTAL_NUM_OF_JOBS);    // constructor
        this.arrPtr = jobs;
        this.front = 0;
        this.rear = -1;
        this.currentQSize = 0;
    }                    

    enqueue(newJob) {                   // adds job to queue
        this.rear = (this.rear + 1) % this.capacity;
        this.arrPtr[this.rear] = newJob;
        this.currentQSize++;
        if (this.head == null) {
            this.head = new Job(this.arrPtr[this.front]);
        }
        else {
            this.head = this.arrPtr[this.front];
        }
        this.head = this.arrPtr[this.front];
    }
    dequeue() {                              // returns front job and removes it from queue
        let val = this.arrPtr[this.front];
        this.front = (this.front + 1) % this.capacity;
        this.currentQSize--;
        this.head = this.arrPtr[this.front];
        return val;
    }
    cutInLine(interruptedJob) {         // adds job to the front of queue if interrupted
        this.rear = (this.rear + 1) % this.capacity;
        this.arrPtr[rear] = interruptedJob;
        this.currentQSize++;
        if (this.head == null) {
            this.head = new Job(this.arrPtr[this.front]);
        }
        else {
            this.head = this.arrPtr[this.front];
        }

        for (let i = this.currentQSize - 1; i >= 0; i--) {
            let replacedJob = this.arrPtr[i - 1];
            this.arrPtr[i - 1] = interruptedJob;
            this.arrPtr[i + 1] = replacedJob;
        }

        this.head = this.arrPtr[this.front];
    }
    peek() {                                // looks at first job in queue
        return this.arrPtr[this.front];
    }
    size() {                               // returns current size of queue
        return this.currentQSize;
    }
    isEmpty() {                            // checks if queue if empty
        return (this.currentQSize == 0);
    }
    isFull() {                              // checks if queue is full
        return (this.currentQSize == this.capacity);
    }
}