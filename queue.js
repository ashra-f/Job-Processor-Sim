//File: PriorityQueue.h
class Queue {
    arrPtr = {Job: nullptr};                       // array to store queue elements
    head = {Job: nullptr}; 
    capacity = TOTAL_NUM_OF_JOBS;       // maximum capacity of the queue
    front;                          // points to the front element in the queue
    rear;                               // points to the last element in the queue
    currentQSize;                      // current queue size

    constructor() {                 // constructor
        arrPtr = new Job[capacity];
        front = 0;
        rear = -1;
        currentQSize = 0;
    }                    

    enqueue(newJob) {                   // adds job to queue
        rear = (rear + 1) % capacity;
        arrPtr[rear] = newJob;
        currentQSize++;
        if (head == nullptr) {
            head = new Job(arrPtr[front]);
        }
        else {
            head = arrPtr[front];
        }
        head = arrPtr[front];
    }
    dequeue() {                              // returns front job and removes it from queue
        val = arrPtr[front];
        front = (front + 1) % capacity;
        currentQSize--;
        head = arrPtr[front];
        return val;
    }
    cutInLine(interruptedJob) {         // adds job to the front of queue if interrupted
        rear = (rear + 1) % capacity;
        arrPtr[rear] = interruptedJob;
        currentQSize++;
        if (head == nullptr) {
            head = new Job(arrPtr[front]);
        }
        else {
            head = arrPtr[front];
        }

        for (let i = currentQSize - 1; i >= 0; i--) {
            replacedJob = arrPtr[i - 1];
            arrPtr[i - 1] = interruptedJob;
            arrPtr[i + 1] = replacedJob;
        }

        head = arrPtr[front];
    }
    peek() {                                // looks at first job in queue
        return arrPtr[front];
    }
    size() {                               // returns current size of queue
        return currentQSize;
    }
    isEmpty() {                            // checks if queue if empty
        return (size() == 0);
    }
    isFull() {                              // checks if queue is full
        return (size() == capacity);
    }
};