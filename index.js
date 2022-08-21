let num_processors = 0;

document.getElementById("generate_jobs_btn").onclick = function() {
    document.getElementById("num_of_processors").style.visibility = "visible";

    let all_jobs = createJobs();
    mergeSort(all_jobs, 0, all_jobs.length - 1);
    addJobs(all_jobs);
    document.getElementById("show_data_btn").style.visibility = "visible";
    document.getElementById("generate_jobs_btn").disabled = true;
}

document.getElementById("process_count_btn").onclick = function() {
    num_processors = document.getElementById("process_count").value;
    document.getElementById("process_count_btn").disabled = true;

    // create n number of processors --> add into vector
    let processors = new Array(num_processors);
    for (let i = 0; i < num_processors; i++) {
        processors[i] = new Processor;
    }
}