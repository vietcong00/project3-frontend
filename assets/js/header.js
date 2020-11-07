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
            url: "http://" + ipAddress + "/user/logout",
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
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                document.cookie = "idUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                document.cookie = "pageActionList=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                document.cookie = "idGroup=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                document.cookie = "idCustomer=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                location.replace("login.html");
            },
            error: function (e) {
                console.log(e);
                location.replace("login.html");
            },
        });
    });
}