//File: helperFunctions.cpp
#include <climits>      //INT_MAX
#include "job.h"

using namespace std;

void merge(Job jobs[], int low, int mid, int high) {
    int i = low;                                                                    // starting index for left sub array
    int j = mid + 1;                                                                // starting index for right sub array
    int k = low;                                                                    // starting index for temp array

    Job temp[TOTAL_NUM_OF_JOBS];

    while (i <= mid && j <= high) {                                                 // check if indices are within boundary
        // sort by arrival time and job type
        if (jobs[i].arrivalTime == jobs[j].arrivalTime and jobs[i].jobType != jobs[j].jobType) {
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

    for (int i = low; i <= high; i++) {
        jobs[i] = temp[i];
    }
}
void mergeSort(Job jobs[], int low, int high) {
    if (low < high) {
        int mid = (low + high) / 2;

        mergeSort(jobs, low, mid);
        mergeSort(jobs, mid + 1, high);

        merge(jobs, low, mid, high);
    }

    return;
}
