let num_processors = 0;

document.getElementById("generate_jobs_btn").onclick = function() {
    document.getElementById("num_of_processors").style.visibility = "visible";

    let all_jobs = createJobs();
    mergeSort(all_jobs, 0, all_jobs.length - 1);
    addJobs(all_jobs);
    document.getElementById("show_data_btn").style.visibility = "visible";
    document.getElementById("generate_jobs_btn").disabled = true;
}