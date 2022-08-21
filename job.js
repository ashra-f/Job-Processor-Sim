const TOTAL_NUM_OF_JOBS = 5570;
const NUM_OF_A_JOBS = 2300;                      
const NUM_OF_B_JOBS = 1700;                     
const NUM_OF_C_JOBS = 950;                       
const NUM_OF_D_JOBS = 620;
class Job {
    jobType = "-";                          //Type of job
    arrivalTime = 0;                        //Time since the last job of type A
    processTime = 0;                        //Time to process job
    jobTypeCount = 0;                       //Overall count of specific job (for printing to log file)
    overallJobNum = 0;                      //Overall job number throughout the simulation
    beingProcessed = false;                 //If the job is being processed or not
    isInterrupted = false;                  //If the job has been interrupted or not
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

function addJobs(jobs) {
    for (let i= 0; i < 200; i++) {      // jobs.length - 1
        document.getElementById("tbody").innerHTML += "<tr><td>" + jobs[i].jobType + "&emsp;&emsp;&ensp;</td>" 
                                                            + "<td>" + jobs[i].arrivalTime + "&emsp;&emsp;&emsp;&emsp;</td>" 
                                                            + "<td>" + jobs[i].processTime + "</td></tr>";
    }
}

function createJobs() {
    let allJobs = new Array(TOTAL_NUM_OF_JOBS);
    //Create type A jobs and pass into array
    let i;
    for (i = 0; i < NUM_OF_A_JOBS; i++) {
        allJobs[i] = new Job('A');
    }
    //Create type B jobs and pass into array
    for (; i < NUM_OF_B_JOBS + NUM_OF_A_JOBS; i++) {
        allJobs[i] = new Job('B');;
    }
    //Create type C jobs and pass into array
    for (; i < NUM_OF_C_JOBS + NUM_OF_A_JOBS + NUM_OF_B_JOBS; i++) {
        allJobs[i] = new Job('C');;
    }
    //Create type D jobs and pass into array
    for (; i < TOTAL_NUM_OF_JOBS; i++) {
        allJobs[i] = new Job('D');;
    }

    return allJobs;
}

function merge(jobs, low, mid, high) {
    let i = low;                                                                    // starting index for left sub array
    let j = mid + 1;                                                                // starting index for right sub array
    let k = low;                                                                    // starting index for temp array

    let temp = new Array(TOTAL_NUM_OF_JOBS);

    while (i <= mid && j <= high) {                                                 // check if indices are within boundary
        // sort by arrival time and job type      
        if (jobs[i].arrivalTime === jobs[j].arrivalTime && jobs[i].jobType !== jobs[j].jobType) {
            if (jobs[i].jobType == 'D') {
                temp[k] = jobs[i];
                i++, k++;
            }
            else if (jobs[j].jobType == 'D') {
                temp[k] = jobs[j];
                j++, k++;
            }

            // if none are of job type D
            else if (jobs[i].jobType > jobs[j].jobType) {
                temp[k] = jobs[j];
                j++, k++;
            }
            else if (jobs[i].jobType < jobs[j].jobType) {
                temp[k] = jobs[i];
                i++, k++;
            }
        }
        // else sort by arrival time
        else if (jobs[i].arrivalTime <= jobs[j].arrivalTime) {
            temp[k] = jobs[i];
            i++, k++;
        }
        else {
            temp[k] = jobs[j];
            j++, k++;
        }
    }

    while (i <= mid) {                              //copying all elements from left subarray to temp as is
        temp[k] = jobs[i];
        i++, k++;
    }

    while (j <= high) {                             //copying all elements from right subarray to temp as is
        temp[k] = jobs[j];
        j++, k++;
    }

    for (let i = low; i <= high; i++) {
        jobs[i] = temp[i];
    }
}
function mergeSort(jobs, low, high) {
    if (low < high) {
        let mid = Math.floor((low + high) / 2);

        mergeSort(jobs, low, mid);
        mergeSort(jobs, mid + 1, high);

        merge(jobs, low, mid, high);
    }
}