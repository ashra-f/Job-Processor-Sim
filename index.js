let num_processors = 0;
let all_jobs;
let processors;
let dataBlock_metrics = document.getElementById("metrics");
let dataBlock_runtime = document.getElementById("runtime");

const TOTAL_RUNTIME = 100;

document.getElementById("generate_jobs_btn").onclick = function() {
    document.getElementById("num_of_processors").style.visibility = "visible";

    all_jobs = createJobs();
    mergeSort(all_jobs, 0, all_jobs.length - 1);
    addJobs(all_jobs);
    document.getElementById("show_data_btn").style.visibility = "visible";
    document.getElementById("generate_jobs_btn").disabled = true;
}

document.getElementById("process_count_btn").onclick = function() {
    num_processors = document.getElementById("process_count").value;
    document.getElementById("process_count_btn").style.visibility = "collapse";
    document.getElementById("num_of_processors").style.visibility = "collapse";

    // create n number of processors --> add into vector
    processors = new Array(num_processors);
    for (let i = num_processors; i >= 0; i--) {
        processors[i] = new Processor;
    }

    let myQueue = new Queue();          // creating the priority queue
    let currProc,                       // current job processor is working on
        newIncomingJob,                 // new incoming job being evaluated
        interruptedJob;                 // any job that gets interrupted
    let p = 0;                          // indicates the processor number
    let isFirstAction = true;           // helps determine when to print a dash after "Time # :"

/*CREATING COUNTING VARIABLES FOR LOG FILE & METRICS*/
    let totalCPUIdleTime = 0;
    let totalCPUProcTime = 0;
    let totalTimeJobsinQ = 0;
    let aCount = 0, bCount = 0, cCount = 0, dCount = 0;     // counting total number of jobs per type
    let jobsTypeADone = 0, jobsTypeBDone = 0, jobsTypeCDone = 0, jobsTypeDDone = 0;
    let totalQSize = 0;
    let maxJobsinQ = -1;

    //Running the simulation for 50 time units
    for (let time = 1, i = 0; time <= TOTAL_RUNTIME; time++) {
        let displayProc = 0;
        
        //New job arrival
        while (all_jobs[i].arrivalTime == time) {
            if (all_jobs[i].jobType == 'A') {
                aCount++;
                all_jobs[i].jobTypeCount = aCount;
            }
            else if (all_jobs[i].jobType == 'B') {
                bCount++;
                all_jobs[i].jobTypeCount = bCount;
            }
            else if (all_jobs[i].jobType == 'C') {
                cCount++;
                all_jobs[i].jobTypeCount = cCount;
            }
            else if (all_jobs[i].jobType == 'D') {
                dCount++;
                all_jobs[i].jobTypeCount = dCount;
            }

            all_jobs[i].overallJobNum = i;
            myQueue.enqueue(all_jobs[i]);
            all_jobs[i].isNewJob = true;

            if (isFirstAction) {
                let x = i + 1;
               dataBlock_runtime.innerHTML += "Time " + time + ": Arrival: Overall Job:" + x + ", Job: " + all_jobs[i].jobType
                    + ":" + all_jobs[i].jobTypeCount + ", Processing Time " + all_jobs[i].processTime + ";" + "<br>";
                isFirstAction = false;
            }
            else {
                let x = i + 1;
                dataBlock_runtime.innerHTML += "Time " + time + ":- Arrival: Overall Job:" + x + ", Job: " + all_jobs[i].jobType
                    + ":" + all_jobs[i].jobTypeCount + ", Processing Time " + all_jobs[i].processTime + ";" + "<br>";
            }

            //checking if jobType == D (high priority). process immediately if true
            if (all_jobs[i].jobType == 'D') {
                for (p = 0; p < num_processors; p++) {
                    if (processors[p].isAvailable) { //if processor is available, continue as normal
                        break;
                    }
                    else if (!processors[p].isAvailable && p != num_processors - 1) { //if processor isn't available, check next processor (until the last processor in the list)
                        continue;
                    }
                    else if (processors[num_processors].myJob.jobType != 'D') { //if all processors taken and job isn't high priority, interrupt it & replace
                        dataBlock_runtime.innerHTML += "Time " + time + ": High Priority Interruption; Job:" + processors[p].myJob.overallJobNum + " is interrupted. Sending to front of queue.<br>";
                        processors[p].myJob.beingProcessed = false;
                        interruptedJob = processors[p].myJob;
                        myQueue.enqueue(interruptedJob);
                        all_jobs[i].overallJobNum = i;
                        processors[p].runTime = 0;
                        processors[p].isAvailable = false;
                        all_jobs[i].beingProcessed = true;
                        all_jobs[i].isInterrupted = true;
                        processors[p].linkJobtoProc(all_jobs[i]);

                        for (let d = 0; d < myQueue.size(); d++) {
                            checkFront = myQueue.peek();
                            if (checkFront.jobType == interruptedJob.jobType && checkFront.arrivalTime == interruptedJob.arrivalTime) {
                                break;
                            }
                            else if (checkFront.jobType == 'D') {
                                myQueue.dequeue();
                            }
                            else {
                                temp = myQueue.peek();
                                myQueue.dequeue();
                                myQueue.enqueue(temp);
                            }

                            displayProc = p + 1;
                        }
                        dataBlock_runtime.innerHTML += "Time " + time + ": Begin Processing Job:" + processors[p].myJob.overallJobNum + ", Job " + processors[p].myJob.jobType + ":" + processors[p].myJob.jobTypeCount + " in CPU " + displayProc + "<br>";
                    }
                    else { //if all processors are doing high priority jobs, send current d job to the front of the queue
                        for (let d = 0; d < myQueue.size(); d++) {
                            checkFront = myQueue.peek();
                            if (checkFront.jobType == all_jobs[i].jobType && checkFront.arrivalTime == all_jobs[i].arrivalTime) {
                                break;
                            }
                            else {
                                temp = myQueue.peek();
                                myQueue.dequeue();
                                myQueue.enqueue(temp);
                            }
                        }
                    }
                }
            }
            i++;
        }

        //Connects job to processor and/or Processes job
        for (p = 0; p < num_processors; p++) {
            //Connect job to a processor if any are available
            if (!myQueue.isEmpty()) {
                currProc = myQueue.peek();
                if (processors[p].isAvailable && !currProc.beingProcessed && !processors[p].myJob.isInterrupted) {
                    displayProc = p + 1;
                    processors[p].linkJobtoProc(currProc);
                    if (isFirstAction) {
                        dataBlock_runtime.innerHTML += "Time " + time + ": Begin Processing Job:" + (processors[p].myJob.overallJobNum + 1) + ", Job " + processors[p].myJob.jobType + ":" + processors[p].myJob.jobTypeCount + " in CPU " + displayProc + "<br>";
                        isFirstAction = false;
                    }
                    else {
                        dataBlock_runtime.innerHTML += "Time " + time + ":- Begin Processing Job:" + (processors[p].myJob.overallJobNum + 1) + ", Job " + processors[p].myJob.jobType + ":" + processors[p].myJob.jobTypeCount + " in CPU " + displayProc + "<br>";
                    }
                    processors[p].isAvailable = false;
                    processors[p].idleTime = 0;
                    processors[p].myJob.beingProcessed = true;
                    processors[p].myJob.isNewJob = true;
                    myQueue.dequeue();
                }
            }

            //Job Processing
            if (processors[p].myJob.processTime != 0 && processors[p].myJob.beingProcessed == true) {
                if (processors[p].myJob.isNewJob) {
                    processors[p].myJob.isNewJob = false;
                    continue;
                }
                displayProc = p + 1;
                processors[p].myJob.processTime--;
                processors[p].runTime++;
                totalCPUProcTime++;

                // Check if job is finished
                if (processors[p].myJob.processTime == 0) {
                    if (isFirstAction) {
                        dataBlock_runtime.innerHTML += "Time " + time + ": Complete Processing Job:" + (processors[p].myJob.overallJobNum + 1) + ", Job " + processors[p].myJob.jobType + ":" + processors[p].myJob.jobTypeCount + "<br>";
                        isFirstAction = false;
                    }
                    else {
                        dataBlock_runtime.innerHTML += "Time " + time + ":- Complete Processing Job:" + (processors[p].myJob.overallJobNum + 1) + ", Job " + processors[p].myJob.jobType + ":" + processors[p].myJob.jobTypeCount + "<br>";
                    }
                    processors[p].isAvailable = true;
                    processors[p].runTime = 0;
                    processors[p].myJob.beingProcessed = false;
                    processors[p].myJob.isInterrupted = false;

                    if (processors[p].myJob.jobType == 'A') {
                        jobsTypeADone++;
                    }
                    else if (processors[p].myJob.jobType == 'B') {
                        jobsTypeBDone++;
                    }
                    else if (processors[p].myJob.jobType == 'C') {
                        jobsTypeCDone++;
                    }
                    else if (processors[p].myJob.jobType == 'D') {
                        jobsTypeDDone++;
                    }

                    p = -1;  // cycles thru processors again
                }
            }
            else {
                processors[p].idleTime++;
                totalCPUIdleTime++;
            }
        }

        //Log file: queue status and processor idle/run times
        if (isFirstAction) {
            dataBlock_runtime.innerHTML += "Time " + time + ": Queue: ";
            isFirstAction = false;
        }
        else {
            dataBlock_runtime.innerHTML += "Time " + time + ":- Queue: ";
        }

        //Outputs current queue status 
        if (myQueue.isEmpty()) {
            dataBlock_runtime.innerHTML += "Empty; ";
        }
        else {
            dataBlock_runtime.innerHTML += myQueue.size() + "; ";
        }

        for (let p = 0; p < num_processors; p++) {
            displayProc = p + 1;
            if (processors[p].runTime == 0 && processors[p].isAvailable) {
                dataBlock_runtime.innerHTML += "CPU " + displayProc + " Idle Time:" + processors[p].idleTime + "; ";
            }
            else {
                dataBlock_runtime.innerHTML += "CPU " + displayProc + " Run Time:" + processors[p].runTime + "; ";
            }
        }
        dataBlock_runtime.innerHTML += "<br>";
        isFirstAction = true;

        //Metrics variables
        totalQSize += myQueue.size();
        if (myQueue.size() > maxJobsinQ) {
            maxJobsinQ = myQueue.size();
        }
        
        /*PRINTS METRICS*/
        if (time == TOTAL_RUNTIME / 2 || time == TOTAL_RUNTIME) {
            
            if (time == TOTAL_RUNTIME / 2) {
                dataBlock_metrics.innerHTML += "--INITIAL METRICS-- ";
            }
            if (time == TOTAL_RUNTIME) {
                dataBlock_metrics.innerHTML += "--FINAL METRICS-- ";
            }

            let jobsProcessing = 0;
            for (let i = 0; i < num_processors; i++) {
                if (!processors[i].isAvailable) {
                    jobsProcessing++;
                }
            }

            avgQCount   = totalQSize / time;         
            overallJobsDone   = jobsTypeADone + jobsTypeBDone + jobsTypeCDone + jobsTypeDDone;
            totalJobsinQ = myQueue.size() + overallJobsDone + jobsProcessing;              // total jobs that were in the queue throughout runtime (i.e, total num of jobs that arrived)
            avgTimeJobsinQ = totalTimeJobsinQ / totalJobsinQ;

            dataBlock_metrics.innerHTML += "<br>" + "Number of processor(s) being used: "   + num_processors              + "<br>"
                        + "Current queue size: "                + myQueue.size()                         + "<br>"   
                        + "Average queue size: "                + avgQCount                              + "<br>"  
                        + "Maximum jobs in queue: "             + maxJobsinQ                             + "<br>"  
                        + "Total time jobs are in queue: "      + totalTimeJobsinQ + " time units"       + "<br>" 
                        + "Average time jobs are in queue: "    + avgTimeJobsinQ   + " time units"       + "<br>" 
                        + "Total number of A jobs arrived: "    + aCount                                 + "<br>"  
                        + "Total number of A jobs completed: "  + jobsTypeADone                          + "<br>"  
                        + "Total number of B jobs arrived: "    + bCount                                 + "<br>"  
                        + "Total number of B jobs completed: "  + jobsTypeBDone                          + "<br>"  
                        + "Total number of C jobs arrived: "    + cCount                                 + "<br>"  
                        + "Total number of C jobs completed: "  + jobsTypeCDone                          + "<br>"  
                        + "Total number of D jobs arrived: "    + dCount                                 + "<br>"  
                        + "Total number of D jobs completed: "  + jobsTypeDDone                          + "<br>"  
                        + "Total jobs completed: "              + overallJobsDone                        + "<br>"  
                        + "Total time CPU(s) were processing: " + totalCPUProcTime + " time units"       + "<br>" 
                        + "Total time CPU(s) were idle: "       + totalCPUIdleTime + " time units"      + "<br><br>";
        } 
    }
}