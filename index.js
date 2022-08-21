let num_processors = 0;
const TOTAL_NUM_OF_JOBS = 5570;
const NUM_OF_A_JOBS = 2300;                      
const NUM_OF_B_JOBS = 1700;                     
const NUM_OF_C_JOBS = 950;                       
const NUM_OF_D_JOBS = 620;

const openModBtns = document.querySelectorAll("[data-modal-target]");
const closeModBtns = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");

openModBtns.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget);
        openMod(modal);
    })
})

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        closeMod(modal);
    })
})

closeModBtns.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeMod(modal);
    })
})

function openMod(modal) {
    if (modal == null)
        return;
    modal.classList.add('active');
    overlay.classList.add('active');
}

function closeMod(modal) {
    if (modal == null)
        return;
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

document.getElementById("generate_jobs_btn").onclick = function() {
    let all_jobs = createJobs();
    mergeSort(all_jobs, 0, all_jobs.length - 1);
    addJobs(all_jobs);
    document.getElementById("show_data_btn").style.visibility = "visible";
    document.getElementById("generate_jobs_btn").disabled = true;
}

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