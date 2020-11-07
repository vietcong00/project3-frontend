var today = new Date();
var date =
    today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date + " " + time;

function getYear() {
    return today.getFullYear();
}

function getMonth() {
    return today.getMonth() + 1;
}

function getDay() {
    return today.getDate();
}

function getHour() {
    return today.getHours();
}

function getMinute() {
    return today.getMinutes();
}

function getSecond() {
    return today.getSeconds();
}

function getDate() {
    return date;
}

function getTime() {
    return time;
}

function getDateTime() {
    return dateTime;
}

function monthToString(i) {
    if (i < 0) {
        i += 12;
    }
    if (i == 1) {
        return "Jan";
    }
    if (i == 2) {
        return "Feb";
    }
    if (i == 3) {
        return "Mar";
    }
    if (i == 4) {
        return "Apr";
    }
    if (i == 5) {
        return "May";
    }
    if (i == 6) {
        return "Jun";
    }
    if (i == 7) {
        return "Jul";
    }
    if (i == 8) {
        return "Aug";
    }
    if (i == 9) {
        return "Sep";
    }
    if (i == 10) {
        return "Oct";
    }
    if (i == 11) {
        return "Nov";
    }
    if (i == 0) {
        return "Dec";
    }
}