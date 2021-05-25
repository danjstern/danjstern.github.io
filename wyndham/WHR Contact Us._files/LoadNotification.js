$(document).ready(function () {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../js/contactUs.js?val=" + Math.random();
    document.head.appendChild(script);
})