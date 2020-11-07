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


function formatCurrency(n, separate = ",") {
    var s = n.toString();
    var len = s.length;
    var ret = "";
    for (var i = 1; i <= len; i++) {
        ret = s[(len - i)] + ret;
        if (i % 3 === 0 && i < len) {
            ret = separate + ret;
        }
    }
    return ret;
}

function cutCurrency(n, start, end, separate = ".") {
    var s = n.toString();
    var len = s.length;
    var ret = "";
    for (var i = start; i <= end; i++) {
        ret = s[(len - i)] + ret;
        if (i % 3 === 0 && i < len) {
            ret = separate + ret;
        }
    }
    // console.log(n);
    // console.log(ret);

    return ret;
}

function formatCurrencyVietNam(n) {
    var s = n.toString();
    var len = s.length;
    var ret
    if (len >= 7 && len <= 9) {
        ret = cutCurrency(n, 7, len) + " Triệu";
    } else if (len >= 10 && len <= 12) {
        ret = cutCurrency(n, 7, len) + " Tỷ";
    } else {
        ret = cutCurrency(n, 10, len) + " Nghìn Tỷ";
    }
    return ret;
}

function formatStringToCurrency(priceString, separate = ",") {
    var price = "";
    for (var i = 1; i < priceString.length; i++) {
        price += priceString[i - 1];
        if (priceString[i] == separate) {
            i++;
            continue;
        }
    }
    price += priceString[priceString.length - 1];
    return price;
}



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