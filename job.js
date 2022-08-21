class Job {
    jobType = "-";                               //Type of job
    arrivalTime = 0;                        //Time since the last job of type A
    processTime = 0;                       //Time to process job
    jobTypeCount = 0;                       //Overall count of specific job (for printing to log file)
    overallJobNum = 0;                      //Overall job number throughout the simulation
    beingProcessed = false;                //If the job is being processed or not
    isInterrupted = false;                 //If the job has been interrupted or not
    isNewJob;
    //Job* nextJob = nullptr;
    //Job* prevJob = nullptr;

    //Constructor
    constructor(type) {
        this.jobType = type;
        if (this.jobType == 'A') {
            this.arrivalTime = Math.floor(Math.random() * 3) + 4 + Job.commulativeArrTimeA; //Range: 4 - 6

            this.processTime = Math.floor(Math.random() * 5) + 1;                        //Range: 1 - 5
            Job.commulativeArrTimeA = this.arrivalTime;
        }
        else if (this.jobType == 'B') {
            this.arrivalTime = Math.floor(Math.random() * 3) + 6 + Job.commulativeArrTimeB; //Range: 6 - 8

            this.processTime = Math.floor(Math.random() * 9) + 2;                        //Range: 2 - 10
            Job.commulativeArrTimeB = this.arrivalTime;
        }
        else if (this.jobType == 'C') {
            this.arrivalTime = Math.floor(Math.random() * 11) + 8 + Job.commulativeArrTimeC; //Range: 8 - 18

            this.processTime = Math.floor(Math.random() * 7) + 6;                        //Range: 6 - 12
            Job.commulativeArrTimeC = this.arrivalTime;
        }
        else if (this.jobType == 'D') {
            this.arrivalTime = Math.floor(Math.random() * 11) + 14 + Job.commulativeArrTimeD; //Range: 14 - 24

            this.processTime = Math.floor(Math.random() * 9) + 9;                        //Range: 9 - 17
            Job.commulativeArrTimeD = this.arrivalTime;
        }
    }
    /*constructor() {
        this.jobType = ' ';
        this.arrivalTime = 0;
        this.processTime = 0;
    }*/
}

Job.commulativeArrTimeD = Number(0);
Job.commulativeArrTimeA = Number(0);             //Arrival time should be cumulative within each job
Job.commulativeArrTimeB = Number(0);
Job.commulativeArrTimeC = Number(0);
