$(document).ready(function () {
    //get all User except Admin
    document.getElementById("username").innerHTML = getCookie("username");
});

$(document).ready(function () {
    logOut();
});

function logOut() {
    $("#btnLogout").click(function () {
        $.ajax({
            url: "http://" + ipAddress + "/employee/logout",
            method: "GET",
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (data) {
                if (data.code != "000") {
                    //  alert(data.message);
                    $.notify(data.message, {
                        position: "top center",
                        className: "warn",
                    });
                }
                $.notify(data.message, {
                    position: "top center",
                    className: "warn",
                });
                // document.cookie = "idEmployee=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                // document.cookie = "pageActionList=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                // document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                // document.cookie = "idEmployeeDetail=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                deleteAllCookies();

                location.replace("login.html");
            },
            error: function (e) {
                console.log(e);
                location.replace("login.html");
            },
        });
    });
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
