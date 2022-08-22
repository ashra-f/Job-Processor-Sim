/*
     * Author: Ashraf Hammoud, Jodi Joven
     * Creation Date: 04/09/22
     * Modification Date: 04/19/22
     * Purpose: Testing the optimal number of processors needed to process a set amount of job requests
*/

#include <iostream>
#include <fstream>
#include <vector>
#include "job.h"
#include "PriorityQueue.h"
#include "Processor.h"
#define TOTAL_RUNTIME 10000

int main(void)
{
    /* PART ONE: Generating the Data */
#pragma region PART ONE
    //Create file
    fstream myFile;

    //Create jobs array
    Job allJobs[TOTAL_NUM_OF_JOBS];

    //Create type A jobs and pass into array
    int i;
    for (i = 0; i < NUM_OF_A_JOBS; i++) {
        allJobs[i] = Job('A');
    }
    //Create type B jobs and pass into array
    for (; i < NUM_OF_B_JOBS + NUM_OF_A_JOBS; i++) {
        allJobs[i] = Job('B');
    }
    //Create type C jobs and pass into array
    for (; i < NUM_OF_C_JOBS + NUM_OF_A_JOBS + NUM_OF_B_JOBS; i++) {
        allJobs[i] = Job('C');
    }
    //Create type D jobs and pass into array
    for (; i < TOTAL_NUM_OF_JOBS; i++) {
        allJobs[i] = Job('D');
    }

    //Sort jobs by ascending arrival time using merge sort
    mergeSort(allJobs, 0, sizeof(allJobs) / sizeof(allJobs[0]) - 1);

    //Pass sorted data into file
    myFile.open("jobs.txt", fstream::out);
    if (myFile.is_open()) {
        for (i = 0; i < TOTAL_NUM_OF_JOBS; i++) {
            myFile << left << setw(10) << allJobs[i].jobType
                << setw(10) << allJobs[i].arrivalTime
                << allJobs[i].proccessTime << endl;
        }
        myFile.close();
    }
    else {
        cerr << "Error opening file.\n";
    }
#pragma endregion
   /* PART TWO: Processor Simulation */
#pragma region PART TWO
    int time = 0;

    //user inputs the number of processors
    cout << "How many processors would you like to use?" << endl;
    cout << "Your selection: ";
    int userProc;
    cin >> userProc;

    while (userProc <= 0) {
        cout << "Invalid number of processors, please try again: ";
        cin >> userProc;
    }

    //creating the log file
    ofstream logFile;
    logFile.open("log.txt");

    vector<Processor> Processors;
    int k;
    for (k = userProc; k >= 0; k--) {
        // add a processor to the vector
        Processor p;
        Processors.push_back(p);
    }

    Queue myQueue;              // creating the priority queue
    Job currProc,               // current job processor is working on
        newIncomingJob,         // new incoming job being evaluated
        interruptedJob;         // any job that gets interrupted
    int p = 0;                  // indicates the processor number
    bool isFirstAction = true;  // helps determine when to print a dash after "Time # :"

    /*CREATING COUNTING VARIABLES FOR LOG FILE & METRICS*/
    int totalCPUIdleTime = 0;
    int totalCPUProcTime = 0;
    int totalTimeJobsinQ = 0;
    int aCount = 0, bCount = 0, cCount = 0, dCount = 0;     // counting total number of jobs per type
    int jobsTypeADone = 0, jobsTypeBDone = 0, jobsTypeCDone = 0, jobsTypeDDone = 0;
    int totalQSize = 0;
    int maxJobsinQ = -1;

    //Running the simulation for 10,000 time units
    for (time = 1, i = 0; time <= TOTAL_RUNTIME; time++) {
        int displayProc = 0;

        //New job arrival
        while (allJobs[i].arrivalTime == time) {
            if (allJobs[i].jobType == 'A') {
                aCount++;
                allJobs[i].jobTypeCount = aCount;
            }
            else if (allJobs[i].jobType == 'B') {
                bCount++;
                allJobs[i].jobTypeCount = bCount;
            }
            else if (allJobs[i].jobType == 'C') {
                cCount++;
                allJobs[i].jobTypeCount = cCount;
            }
            else if (allJobs[i].jobType == 'D') {
                dCount++;
                allJobs[i].jobTypeCount = dCount;
            }

            allJobs[i].overallJobNum = i;
            myQueue.enqueue(allJobs[i]);
            allJobs[i].isNewJob = true;

            if (isFirstAction) {
               logFile << "Time " << time << ": Arrival: Overall Job:" << i + 1 << ", Job: " << allJobs[i].jobType
                    << ":" << allJobs[i].jobTypeCount << ", Processing Time " << allJobs[i].proccessTime << ";\n";
                isFirstAction = false;
            }
            else {
                logFile << "Time " << time << ":- Arrival: Overall Job:" << i + 1 << ", Job: " << allJobs[i].jobType
                    << ":" << allJobs[i].jobTypeCount << ", Processing Time " << allJobs[i].proccessTime << ";\n";
            }

            //checking if jobType == D (high priority). process immediately if true
            if (allJobs[i].jobType == 'D') {
                for (p = 0; p < userProc; p++) {
                    if (Processors[p].isAvailable) { //if processor is available, continue as normal
                        break;
                    }
                    else if (!Processors[p].isAvailable && p != userProc - 1) { //if processor isn't available, check next processor (until the last processor in the list)
                        continue;
                    }
                    else if (Processors[userProc].myJob.jobType != 'D') { //if all processors taken and job isn't high priority, interrupt it & replace
                        logFile << "Time " << time << ": High Priority Interruption; Job:" << Processors[p].myJob.overallJobNum << " is interrupted. Sending to front of queue." << endl;
                        Processors[p].myJob.beingProcessed = false;
                        interruptedJob = Processors[p].myJob;
                        myQueue.enqueue(interruptedJob);
                        allJobs[i].overallJobNum = i;
                        Processors[p].runTime = 0;
                        Processors[p].isAvailable = false;
                        allJobs[i].beingProcessed = true;
                        allJobs[i].isInterrupted = true;
                        Processors[p].linkJobtoProc(allJobs[i]);

                        for (int d = 0; d < myQueue.size(); d++) {
                            Job checkFront = myQueue.peek();
                            if (checkFront.jobType == interruptedJob.jobType && checkFront.arrivalTime == interruptedJob.arrivalTime) {
                                break;
                            }
                            else if (checkFront.jobType == 'D') {
                                myQueue.dequeue();
                            }
                            else {
                                Job temp = myQueue.peek();
                                myQueue.dequeue();
                                myQueue.enqueue(temp);
                            }

                            displayProc = p + 1;
                        }
                        logFile << "Time " << time << ": Begin Processing Job:" << Processors[p].myJob.overallJobNum << ", Job " << Processors[p].myJob.jobType << ":" << Processors[p].myJob.jobTypeCount << " in CPU " << displayProc << endl;
                    }
                    else { //if all processors are doing high priority jobs, send current d job to the front of the queue
                        for (int d = 0; d < myQueue.size(); d++) {
                            Job checkFront = myQueue.peek();
                            if (checkFront.jobType == allJobs[i].jobType && checkFront.arrivalTime == allJobs[i].arrivalTime) {
                                break;
                            }
                            else {
                                Job temp = myQueue.peek();
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
        for (p = 0; p < userProc; p++) {
            //Connect job to a processor if any are available
            if (!myQueue.isEmpty()) {
                currProc = myQueue.peek();
                if (Processors[p].isAvailable && !currProc.beingProcessed && !Processors[p].myJob.isInterrupted) {
                    displayProc = p + 1;
                    Processors[p].linkJobtoProc(currProc);
                    if (isFirstAction) {
                        logFile << "Time " << time << ": Begin Processing Job:" << Processors[p].myJob.overallJobNum + 1 << ", Job " << Processors[p].myJob.jobType << ":" << Processors[p].myJob.jobTypeCount << " in CPU " << displayProc << endl;
                        isFirstAction = false;
                    }
                    else {
                        logFile << "Time " << time << ":- Begin Processing Job:" << Processors[p].myJob.overallJobNum + 1 << ", Job " << Processors[p].myJob.jobType << ":" << Processors[p].myJob.jobTypeCount << " in CPU " << displayProc << endl;
                    }
                    Processors[p].isAvailable = false;
                    Processors[p].idleTime = 0;
                    Processors[p].myJob.beingProcessed = true;
                    Processors[p].myJob.isNewJob = true;
                    myQueue.dequeue();
                }
            }

            //Job Processing
            if (Processors[p].myJob.proccessTime != 0 && Processors[p].myJob.beingProcessed == true) {
                if (Processors[p].myJob.isNewJob) {
                    Processors[p].myJob.isNewJob = false;
                    continue;
                }
                displayProc = p + 1;
                Processors[p].myJob.proccessTime--;
                Processors[p].runTime++;
                totalCPUProcTime++;

                // Check if job is finished
                if (Processors[p].myJob.proccessTime == 0) {
                    if (isFirstAction) {
                        logFile << "Time " << time << ": Complete Processing Job:" << Processors[p].myJob.overallJobNum + 1 << ", Job " << Processors[p].myJob.jobType << ":" << Processors[p].myJob.jobTypeCount << endl;
                        isFirstAction = false;
                    }
                    else {
                        logFile << "Time " << time << ":- Complete Processing Job:" << Processors[p].myJob.overallJobNum + 1 << ", Job " << Processors[p].myJob.jobType << ":" << Processors[p].myJob.jobTypeCount << endl;
                    }
                    Processors[p].isAvailable = true;
                    Processors[p].runTime = 0;
                    Processors[p].myJob.beingProcessed = false;
                    Processors[p].myJob.isInterrupted = false;

                    if (Processors[p].myJob.jobType == 'A') {
                        jobsTypeADone++;
                    }
                    else if (Processors[p].myJob.jobType == 'B') {
                        jobsTypeBDone++;
                    }
                    else if (Processors[p].myJob.jobType == 'C') {
                        jobsTypeCDone++;
                    }
                    else if (Processors[p].myJob.jobType == 'D') {
                        jobsTypeDDone++;
                    }

                    p = -1;  // cycles thru processors again
                }
            }
            else {
                Processors[p].idleTime++;
                totalCPUIdleTime++;
            }
        }

        //Log file: queue status and processor idle/run times
        if (isFirstAction) {
            logFile << "Time " << time << ": Queue: ";
            isFirstAction = false;
        }
        else {
            logFile << "Time " << time << ":- Queue: ";
        }

        //Outputs current queue status 
        if (myQueue.isEmpty()) {
            logFile << "Empty; ";
        }
        else {
            logFile << myQueue.size() << "; ";
        }

        for (p = 0; p < userProc; p++) {
            displayProc = p + 1;
            if (Processors[p].runTime == 0 and Processors[p].isAvailable) {
                logFile << "CPU " << displayProc << " Idle Time:" << Processors[p].idleTime << "; ";
            }
            else {
                logFile << "CPU " << displayProc << " Run Time:" << Processors[p].runTime << "; ";
            }
        }
        logFile << endl;
        isFirstAction = true;

        //Metrics variables
        totalQSize += myQueue.size();
        if (myQueue.size() > maxJobsinQ) {
            maxJobsinQ = myQueue.size();
        }
        
        /*PRINTS METRICS*/
        if (time == 500 or time == 10000) {
            
            if (time == 500) {
                cout << "\n--INITIAL METRICS-- \n";
            }
            if (time == 10000) {
                cout << "\n--FINAL METRICS-- \n";
            }

            cout << "\n--METRICS-- \n";

            int jobsProcessing = 0;
            for (int i = 0; i < userProc; i++) {
                if (!Processors[i].isAvailable) {
                    jobsProcessing++;
                }
            }

            double avgQCount   = static_cast<double> (totalQSize) / time;         
            int overallJobsDone   = jobsTypeADone + jobsTypeBDone + jobsTypeCDone + jobsTypeDDone;
            int totalJobsinQ = myQueue.size() + overallJobsDone + jobsProcessing;              // total jobs that were in the queue throughout runtime (i.e, total num of jobs that arrived)
            double avgTimeJobsinQ = static_cast<double> (totalTimeJobsinQ) / totalJobsinQ;

            cout << "Number of processor(s) being used: " << userProc  << endl
                 << "Current queue size: "                << myQueue.size()                            << endl
                 << "Average queue size: "                << avgQCount                                 << endl
                 << "Maximum jobs in queue: "             << maxJobsinQ                                << endl
                 << "Total time jobs are in queue: "      << totalTimeJobsinQ << " time units"         << endl
                 << "Average time jobs are in queue: "    << avgTimeJobsinQ   << " time units"         << endl
                 << "Total number of A jobs arrived: "    << aCount                                    << endl
                 << "Total number of A jobs completed: "  << jobsTypeADone                             << endl
                 << "Total number of B jobs arrived: "    << bCount                                    << endl
                 << "Total number of B jobs completed: "  << jobsTypeBDone                             << endl
                 << "Total number of C jobs arrived: "    << cCount                                    << endl
                 << "Total number of C jobs completed: "  << jobsTypeCDone                             << endl
                 << "Total number of D jobs arrived: "    << dCount                                    << endl
                 << "Total number of D jobs completed: "  << jobsTypeDDone                             << endl
                 << "Total jobs completed: "              << overallJobsDone                           << endl
                 << "Total time CPU(s) were processing: " << totalCPUProcTime << " time units"         << endl
                 << "Total time CPU(s) were idle: "       << totalCPUIdleTime << " time units" << endl << endl;
        } 

    }

    logFile.close();
#pragma endregion

    return 0;
}