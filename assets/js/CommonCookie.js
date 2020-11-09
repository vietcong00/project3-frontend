function checkTokenWeb() {
    var token = getCookie("token");
    if (token == "") {
        $.notify("Bạn chưa đăng nhập!", {
            position: "top center",
            className: "error",
        });
        setTimeout(function () {
            location.replace("login.html");
        }, 500);
    } else {
        $.ajax({
            url: "http://" + ipAddress + "/user/checkTokenWeb",
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
        }).done(function (data) {
            if (data.code == "999") {
                $.notify("Bạn chưa đăng nhập!", {
                    position: "top center",
                    className: "error",
                });
                setTimeout(function () {
                    location.replace("login.html");
                }, 500);
            }
        });
    }
}

function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function getDateTimeNow() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;
    return dateTime;
}

function formatDate(data) {
    var dataNew = new Date(data);
    var date = dataNew.getDate() + '/' + (dataNew.getMonth() + 1) + '/' + dataNew.getFullYear();
    var time = dataNew.getHours() + ":" + dataNew.getMinutes() + ":" + dataNew.getSeconds();
    var dateTime = date + ' ' + time;
    return dateTime;
}