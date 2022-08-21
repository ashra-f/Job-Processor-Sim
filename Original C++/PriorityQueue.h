//File: PriorityQueue.h
#pragma once
#include "job.h"

class Queue {
    Job* arrPtr = nullptr;                       // array to store queue elements
    Job* head = nullptr;
    int capacity = TOTAL_NUM_OF_JOBS;       // maximum capacity of the queue
    int front;                          // points to the front element in the queue
    int rear;                               // points to the last element in the queue
    int currentQSize;                      // current queue size

public:
    Queue();                    // constructor

    void enqueue(Job newJob);            // adds job to queue
    Job dequeue();                // returns front job and removes it from queue
    void cutInLine(Job interruptedJob);           // adds job to the front of queue if interrupted
    Job peek();                    // looks at first job in queue
    int size();                    // returns current size of queue
    bool isEmpty();                // checks if queue if empty
    bool isFull();                // checks if queue is full
};

Queue::Queue() {
    arrPtr = new Job[capacity];
    front = 0;
    rear = -1;
    currentQSize = 0;
}

void Queue::enqueue(Job newjob) {
    rear = (rear + 1) % capacity;
    arrPtr[rear] = newjob;
    currentQSize++;
    if (head == nullptr) {
        head = new Job(arrPtr[front]);
    }
    else {
        *head = arrPtr[front];
    }
    *head = arrPtr[front];
}

Job Queue::dequeue() {
    Job val = arrPtr[front];
    front = (front + 1) % capacity;
    currentQSize--;
    *head = arrPtr[front];
    return val;
}

void Queue::cutInLine(Job interruptedJob) {
    rear = (rear + 1) % capacity;
    arrPtr[rear] = interruptedJob;
    currentQSize++;
    if (head == nullptr) {
        head = new Job(arrPtr[front]);
    }
    else {
        *head = arrPtr[front];
    }

    for (int i = currentQSize - 1; i >= 0; i--) {
        Job replacedJob = arrPtr[i - 1];
        arrPtr[i - 1] = interruptedJob;
        arrPtr[i + 1] = replacedJob;
    }

    *head = arrPtr[front];
}

Job Queue::peek() {
    return arrPtr[front];
}

int Queue::size() {
    return currentQSize;
}

bool Queue::isEmpty() {
    return (size() == 0);
}

bool Queue::isFull() {
    return (size() == capacity);
}
