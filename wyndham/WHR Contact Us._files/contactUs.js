$(document).ready(function () {
    // FETCHING DATA FROM JSON FILE
    $.getJSON("../NotificationData/Notification.json",
        function (data) {
            var alert = '';
            var divid = 0;
            var noNotificationsToDisplay = '<div class="center-noData">No notifications available to display at this point in time.</div>';
            // ITERATING THROUGH OBJECTS
            $.each(data, function (key, value) {
                divid++;
                //CONSTRUCTION OF ROWS HAVING
                // DATA FROM JSON OBJECT
                alert += '<div class="accordion"  id="accordionExample">';
                alert += '<div class="card">';
                alert += '<div class="card-header" id="heading' + divid + '">';
                alert += '<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse' + divid + '" aria-expanded="true" aria-controls="collapse' + divid + '">' + value.NotificationHeader + '</button></div > ';
                alert += '<div id="collapse' + divid + '" class="collapse" aria-labelledby="heading' + divid + '" data-parent="#accordionExample"><div class="card-body"  >' + value.NotificationBody + '</div></div></div>';
            });
            if (divid > 0) {
                $('#alertCount').append(divid);
                //INSERTING ROWS INTO TABLE
                $('#divtab').append(alert);
            }
            else {
                $('#alertCount').hide();
                $('#divtab').append(noNotificationsToDisplay);
            }
        });
    $('.hamburgerIcon').click(function () {
        $('.hamburgerIcon').toggleClass('active');
        if ($('#myLinks').css('display') == 'none') {
            $('#myLinks').show('.5s');
        }
        else if ($('#myLinks').css('display') == 'block') {
            $('#myLinks').hide('.5s');
        }
    })
});

//for hamgurber menu
$(window).resize(function () {
    if ($(window).width() >= 767) {
        var x = document.getElementById("myLinks");
        if (x.style.display === "block") {
            x.style.display = "none";
        }
        $('.hamburgerIcon').removeClass('active');
    }
});

function launchCallMe() {
    alert("This feature will be enabled shortly.");
}

function launchRemoteSession() {
    window.open("https://htcs.wyndham.com");
}

function launchDeploymentOrderForm() {
    window.open("https://forms.monday.com/forms/b7092c6e66dd7487a2ca980296775611");
}
