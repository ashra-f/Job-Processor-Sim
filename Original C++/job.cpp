#include "job.h"

//Initialize static member
int Job::commulativeArrTimeA = 0;
int Job::commulativeArrTimeB = 0;
int Job::commulativeArrTimeC = 0;
int Job::commulativeArrTimeD = 0;

//Constructor
Job::Job(char type) : jobType(type) {
    if (jobType == 'A') {
        arrivalTime = (rand() % 3) + 4 + commulativeArrTimeA;   //Range: 4 - 6
                                                                //Adds commulative (assignment requirement)

        proccessTime = (rand() % 5) + 1;                        //Range: 1 - 5
        commulativeArrTimeA = arrivalTime;
    }
    else if (jobType == 'B') {
        arrivalTime = (rand() % 3) + 6 + commulativeArrTimeB;   //Range: 6 - 8

        proccessTime = (rand() % 9) + 2;                        //Range: 2 - 10
        commulativeArrTimeB = arrivalTime;
    }
    else if (jobType == 'C') {
        arrivalTime = (rand() % 11) + 8 + commulativeArrTimeC;  //Range: 8 - 18

        proccessTime = (rand() % 7) + 6;                        //Range: 6 - 12
        commulativeArrTimeC = arrivalTime;
    }
    else if (jobType == 'D') {
        arrivalTime = (rand() % 10) + 14 + commulativeArrTimeD; //Range: 14 - 24

        proccessTime = (rand() % 9) + 9;                        //Range: 9 - 17
        commulativeArrTimeD = arrivalTime;
    }
}
Job::Job() {
    jobType = ' ';
    arrivalTime = 0;
    proccessTime = 0;
}
