function callAll(jsfiles) {
    var src = document.createElement("script");
    src.setAttribute("type", "text/javascript");
    src.setAttribute("src", jsfiles);
    document.getElementsByTagName("head")[0].appendChild(src);
}
callAll("index.js");
callAll("job.js");
callAll("modal.js");
callAll("processor.js");
callAll("queue.js");