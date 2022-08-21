//File: job.h
#pragma once

#include <iostream>
#include <iomanip>                              //Used for setw and left
#include <fstream>
#define NUM_OF_A_JOBS 2300                      
#define NUM_OF_B_JOBS 1700                      
#define NUM_OF_C_JOBS 950                        
#define NUM_OF_D_JOBS 620                       

using namespace std;

const int TOTAL_NUM_OF_JOBS = NUM_OF_A_JOBS + NUM_OF_B_JOBS + NUM_OF_C_JOBS + NUM_OF_D_JOBS;

struct Job {
    char jobType;                               //Type of job
    int overallJobNum = 0;                      //Overall job number throughout the simulation
    int arrivalTime = 0;                        //Time since the last job of type A
    int proccessTime = 0;                       //Time to process job
    int jobTypeCount = 0;                       //Overall count of specific job (for printing to log file)
    bool beingProcessed = false;                //If the job is being processed or not
    bool isInterrupted = false;                 //If the job has been interrupted or not
    bool isNewJob;
    Job* nextJob = nullptr;
    Job* prevJob = nullptr;

    static int commulativeArrTimeA;             //Arrival time should be cumulative within each job
    static int commulativeArrTimeB;
    static int commulativeArrTimeC;
    static int commulativeArrTimeD;

    Job(char type);                             //Constructors
    Job();
};

void mergeSort(Job jobs[], int low, int high);
