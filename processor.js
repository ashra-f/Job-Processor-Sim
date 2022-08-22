class Processor {
    myJob = new Job();                              //job linked to processor
    isAvailable = true;                 //processor availability
    idleTime = 0;                       //idle time counter (for log file)
    runTime = 0;                        //run time counter (for log file)
    linkJobtoProc(conJob) {             //linking queue job to processor
        this.myJob = conJob;
    }
}