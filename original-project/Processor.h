//File: Processor.h
#pragma once

class Processor {
public:
    Job myJob;                            //job linked to processor
    bool isAvailable = true;            //processor availability
    int idleTime = 0;                    //idle time counter (for log file)
    int runTime = 0;                    //run time counter (for log file)
    void linkJobtoProc(Job conJob);        //linking queue job to processor
};

void Processor::linkJobtoProc(Job conJob) {
    myJob = conJob;
}
