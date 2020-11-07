checkTokenWeb();
var userCreate = getCookie("username");
var customerId = getCookie("idCustomer");
var addFlag = false;
console.log(customerId);
//show history care
$(document).ready(function () {
    var pageActionList = JSON.parse(getCookie("pageActionList"));
    for (var i = 0; i < pageActionList.length; i++) {
        if (pageActionList[i].page.url == "mycustomerhistorycare.html") {
            for (var j = 0; j < pageActionList[i].actionList.length; j++) {
                if (pageActionList[i].actionList[j].name == "add") {
                    addFlag = true;
                }
            }
        }
    }
    if (addFlag) {
        $("#btn-add-phien").append(
            " <a href='#' class='btn btn-sm btn-primary float-left' id='btnAdd' onclick='openNav();'>Thêm phiên <i class='fas fa-file-alt'></i></a>"
        );
    }
    $.ajax({
        url: "http://" + ipAddress + "/customer/getHistoryCareList",
        method: "POST",
        data: customerId,
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
    }).done(function (data) {
        console.log(data);

        var str = "";
        for (var i = data.historyCares.length - 1; i >= 0; i--) {
            var joinDate = data.customer.createTime
                .replace(".000+00:00", "")
                .replace("T", " ");
            var concernLevel = data.historyCares[i].concernLevel;
            if (concernLevel == "Good") {
                concernLevel = "<buttton class='btn btn-warning'>Good</button>";
            } else if (concernLevel == "Excellent") {
                concernLevel =
                    "<button type='button' class='btn btn-danger'>Excellent</button>";
            } else if (concernLevel == "Average") {
                concernLevel = "<buttton class='btn btn-info'>Average</button>";
            } else if (concernLevel == "Poor") {
                concernLevel = "<buttton class='btn btn-dark'>Poor</button>";
            }
            var startTime = data.historyCares[i].startTime;

            var endTime = data.historyCares[i].endTime;

            str =
                "<div class='bg-light mx-2 '>" +
                "<div class='border rounded text-light text-center mt-4 showHistoryCareDetail' style='background: rgb(72, 93, 138); height: 30px' id='btnShowHistoryCareDetail'>" +
                "<div class = 'row'>" +
                "<div class='col-4 border-right'>Start: " +
                startTime +
                "</div>" +
                "<div class='col-4'>End: " +
                endTime +
                "</div>" +
                "<div class='col-4 border-left'>Created by : " +
                data.historyCares[i].userName +
                "</div>" +
                "</div>" +
                "</div>" +
                "<div class='border border-dark rounded text-center tableHistoryCare'; id='tableHistoryCare'>" +
                "<div class='row' style ='height: 40px'>" +
                "<div class='col-4 border-right'>ID: " +
                data.historyCares[i].id +
                "</div>" +
                "<div class='col-4'>Method: " +
                data.historyCares[i].method +
                "</div>" +
                "<div class='col-4 border-left'>Action: " +
                data.historyCares[i].action +
                "</div>" +
                "</div>" +
                "<div class='row'style ='height: 40px'>" +
                "<div class='col-4 border-right border-top'> Purpose: " +
                data.historyCares[i].purpose +
                "</div>" +
                "<div class='col-4  border-top'> Product Name: " +
                data.historyCares[i].productName +
                "</div>" +
                "<div class='col-4 border-left border-top'>Concern level: " +
                concernLevel +
                "</div>" +
                "</div>" +
                "<div class='row border-top py-3 px-5'>Note: " +
                data.historyCares[i].note +
                " </div>" +
                " </div>";
            $("#listHistoryCare").append(str);
        }
        var customerInfo =
            "<div class ='font-weight-bold h5 mb-3'>" +
            data.customer.name +
            "</div>" +
            "<div class =' border-bottom mb-1'>Phone : " +
            data.customer.phone +
            "</div>" +
            "<div class ='border-bottom mb-1'>Address : " +
            data.customer.address +
            "</div>" +
            "<div class ='border-bottom mb-1'>Email : " +
            data.customer.email +
            "</div>" +
            "<div class ='border-bottom'>Join Date : " +
            joinDate +
            "</div>";
        $("#customerInfo").append(customerInfo);
    });
});

// show nhắc nhở
$(document).ready(function () {
    $.ajax({
        url: "http://" + ipAddress + "/customer/getWorkReminderList",
        method: "POST",
        data: customerId,
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
    }).done(function (data) {
        console.log(data);
        var listWorkReminder = "";
        for (var i = 0; i < data.workReminderList.length; i++) {
            var createTimes = data.workReminderList[i].createTime;
            createTimes = createTimes;
            if (data.workReminderList[i].done == 0) {
                listWorkReminder =
                    "<div class='card mt-2' style='width: 100%'>" +
                    "<div class='card-header text-center' style='background: rgb(243, 187, 65)' >" +
                    data.workReminderList[i].title +
                    " </div>" +
                    " <ul class='list-group list-group-flush ulTeam'>" +
                    "<li class='list-group-item id'>Id: " +
                    data.workReminderList[i].idReminder +
                    "</li>" +
                    "<li class='list-group-item'>Ngày tạo: " +
                    createTimes +
                    " <li class='list-group-item'>Người tạo: " +
                    data.workReminderList[i].userName +
                    "<li class='list-group-item'>Nội dung: " +
                    data.workReminderList[i].content +
                    "</li>" +
                    "<li class='list-group-item text-center'>" +
                    "<a class='accept'>" +
                    "<button class='btn btn-outline-success rounded-circle mr-5' id='accept'>" +
                    "<i class='fas fa-check-circle'></i>" +
                    "</button>" +
                    "</a>" +
                    "<a class='reject'>" +
                    "<button class='btn btn-outline-danger rounded-circle'>" +
                    " <i class='fas fa-trash'></i>" +
                    "</button>" +
                    "</a>" +
                    "</li></ul></div></div>";
                $("#noteArea").prepend(listWorkReminder);
            } else {
                listWorkReminder =
                    "<div class='card mt-2' style='width: 100%'>" +
                    "<div class='card-header text-center' style='background: rgb(23, 189, 17)' >" +
                    data.workReminderList[i].title +
                    " </div>" +
                    " <ul class='list-group list-group-flush ulTeam'>" +
                    "<li class='list-group-item id'>Id: " +
                    data.workReminderList[i].idReminder +
                    "</li>" +
                    "<li class='list-group-item'>Ngày tạo: " +
                    createTimes +
                    " <li class='list-group-item'>Người tạo: " +
                    data.workReminderList[i].userName +
                    "<li class='list-group-item'>Nội dung: " +
                    data.workReminderList[i].content +
                    "</li>" +
                    "<li class='list-group-item text-center'>" +
                    "<a class='reject'>" +
                    "<button class='btn  btn-outline-danger rounded-circle'>" +
                    " <i class='fas fa-trash'></i>" +
                    "</button>" +
                    "</a>" +
                    "</li></ul></div></div>";
                $("#noteArea").append(listWorkReminder);
            }
        }
    });
});

// lấy ngày giờ hôm nay
var today = new Date();
var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date + " " + time;

// clear data form khi bật nút add user !
function removedRowToInput() {
    document.getElementById("startTime").value = "";
    document.getElementById("endTime").value = "";
    document.getElementById("method").value = "";
    document.getElementById("purpose").value = "";
    document.getElementById("concernLevel").value = "";
    document.getElementById("note").value = "";
    document.getElementById("productName").value = "";
    document.getElementById("action").value = "";
    document.getElementById("detail").value = "";
    document.getElementById("title").value = "";
}

// hàm mở form
function openNav() {
    //hàm xóa sạch thông tin khi mở form thêm mới !
    removedRowToInput();
    document.getElementById("myForm").style.height = "90%";
    document.getElementById("overlay2").style.display = "block";
    // vô hiệu hóa nút sửa vì ta đang cần thêm !
    document.getElementById("editRow").style.display = "none";
    document.getElementById("addRow").style.display = "inline-block";
}

function openNavAddNote() {
    //hàm xóa sạch thông tin khi mở form thêm mới !
    removedRowToInput();
    document.getElementById("myFormNote").style.height = "40%";
    document.getElementById("overlay2").style.display = "block";
    document.getElementById("addRow").style.display = "inline-block";
}

// hàm đóng form(dùng cho các nút X, thoát)
function closeNav() {
    document.getElementById("myForm").style.height = "0%";
    document.getElementById("overlay2").style.display = "none";


    // document.getElementById("nameEmpty").innerHTML = "";
    // document.getElementById("emailEmpty").innerHTML = "";
    // document.getElementById("phoneEmpty").innerHTML = "";
    // document.getElementById("addressEmpty").innerHTML = "";
}

function closeNavNote() {
    document.getElementById("myFormNote").style.height = "0%";
    document.getElementById("overlay2").style.display = "none";
}

function isEmptyInput() {
    var isEmpty = false;
    var startTime = $("#startTime").val();
    var endTime = $("#endTime").val();
    var method = $("#method").val();
    var purpose = $("#purpose").val();
    var concernLevel = $("#concernLevel").val();
    var note = $("#note").val();
    var productName = $("#productName").val();
    var action = $("#action").val();
    if (startTime == "") {
        alert("Please enter start time!");
        isEmpty = true;
    } else if (endTime == "") {
        alert("Please enter end time!");
        isEmpty = true;
    } else if (method == "") {
        alert("Please enter method!");
        isEmpty = true;
    } else if (purpose == "") {
        alert("Please enter purpose!");
        isEmpty = true;
    } else if (concernLevel == "") {
        alert("Please enter the customer's concern level!");
        isEmpty = true;
    } else if (note == "") {
        alert("Please note something!");
        isEmpty = true;
    } else if (productName == "") {
        alert("Please enter product's name");
        isEmpty = true;
    } else if (action == "") {
        alert("Please enter action");
        isEmpty = true;
    }
    return isEmpty;
}

//thêm nhắc nhở công việc
function addRowNote() {
    var createTimes = dateTime;
    console.log(createTimes);
    var titles = $("#title").val();
    console.log(title);
    var detail = $("#detail").val();
    var workReminder = {
        title: titles,
        userName: userCreate,
        idCustomer: customerId,
        content: detail,
        createTime: createTimes,
        done: 0,
    };
    $.ajax({
        url: "http://" + ipAddress + "/customer/addNewWorkReminder",
        method: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(workReminder),
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function (data) {
            $.notify(data.message, {
                position: "top center",
                className: "success",
            });
            $("#noteArea").prepend(
                "<div class='card mt-2' style='width: 100%'>" +
                "<div class='card-header text-center' style='background: rgb(243, 187, 65)' >" +
                data.workReminder.title +
                " </div>" +
                " <ul class='list-group list-group-flush ulTeam'>" +
                "<li class='list-group-item id'>Id: " +
                data.workReminder.idReminder +
                "</li>" +
                "<li class='list-group-item'>Ngày tạo: " +
                createTimes +
                " <li class='list-group-item'>Người tạo: " +
                data.workReminder.userName +
                "<li class='list-group-item'>Nội dung: " +
                data.workReminder.content +
                "</li>" +
                "<li class='list-group-item text-center'>" +
                "<a class='accept'>" +
                "<button class='btn btn-outline-success rounded-circle mr-5' id='accept'>" +
                "<i class='fas fa-check-circle'></i>" +
                "</button>" +
                "</a>" +
                "<a class='reject'>" +
                "<button class='btn btn-outline-danger rounded-circle'>" +
                " <i class='fas fa-trash'></i>" +
                "</button>" +
                "</a>" +
                "</li></ul></div></div>"
            );
            closeNavNote();
        },
        error: function (error) {
            $.notify(data.message, {
                position: "top center",
                className: "error",
            });
        },
    });
}

// đánh dấu nhắc nhở đã hoàn thành
// function changeColor() {
//   document.body.style.background = "rgb(23, 189, 17)";
// }
$(document).ready(function () {
    $("body").on("click", ".accept", function () {
        console.log("click ok");
        var res = $(this).closest(".ulTeam").text();
        var first = res.indexOf(" ");
        var last = res.indexOf("N");
        var id = res.slice(first, last);
        var that = this;
        console.log(id);

        $.ajax({
            url: "http://" + ipAddress + "/customer/tickWorkReminder",
            method: "POST",
            data: id,
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
        }).done(function (data) {
            console.log(data);
            if (data.code == "1912") {
                $(that).closest("ul").prev().css("background", "rgb(23, 189, 17)");
                $(that).hide();
                $(that).closest(".card").appendTo($(".noteArea"));
                $.notify(data.message, {
                    position: "top center",
                    className: "success",
                });
            } else {
                $.notify(data.message, {
                    position: "top center",
                    className: "error",
                });
            }
        });
    });
});

// xóa nhắc nhở
$(document).ready(function () {
    $("body").on("click", ".reject", function () {
        var res = $(this).closest(".ulTeam").text();
        var first = res.indexOf(" ");
        var last = res.indexOf("N");
        console.log(first);
        console.log(last);
        var id = res.slice(first, last);
        var that = this;
        console.log(id);
        $.ajax({
            url: "http://" + ipAddress + "/customer/deleteWorkReminder",
            method: "POST",
            data: id,
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
        }).done(function (data) {
            console.log(data);
            if (data.code == "200") {
                $(that).closest(".card").hide("slow");
                $.notify(data.message, {
                    position: "top center",
                    className: "success",
                });
            } else {
                $.notify(data.message, {
                    position: "top center",
                    className: "error",
                });
            }
        });
    });
});

//xóa all nhắc nhở
$(document).ready(function () {
    $("#deleteAllReminde").click(function () {
        $.notify("Chức năng hiện không khả dụng!", {
            position: "top center",
            className: "error",
        });
    });
});

//thêm lich su cham soc khach hang
function addNewHistoryCare() {
    if (!isEmptyInput()) {
        if (!isEmptyInput()) {
            var startTime = $("#startTime").val();
            console.log(startTime);
            var endTime = $("#endTime").val();
            console.log(endTime);
            var method = $("#method").val();
            console.log(method);
            var purpose = $("#purpose").val();
            console.log(purpose);
            var concernLevel = $("#concernLevel").val();
            console.log(concernLevel);
            var note = $("#note").val();
            console.log(note);
            var productName = $("#productName").val();
            console.log(productName);
            var action = $("#action").val();
            console.log(action);
            var historyCare = {
                userName: userCreate,
                idCustomer: customerId,
                startTime: startTime,
                endTime: endTime,
                method: method,
                purpose: purpose,
                concernLevel: concernLevel,
                note: note,
                productName: productName,
                action: action,
            };
            $.ajax({
                url: "http://" + ipAddress + "/customer/addNewHistoryCare",
                method: "POST",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(historyCare),
                beforeSend: function (xhr) {
                    var token = getCookie("token");
                    xhr.setRequestHeader("Authorization", "Bearer " + token);
                },
                success: function (data) {
                    if (data.code == "200") {
                        $.notify(data.message, {
                            position: "top center",
                            className: "success",
                        });
                        var concernLevel = data.historyCare.concernLevel;
                        console.log(concernLevel);
                        if (concernLevel == "Good") {
                            concernLevel = "<buttton class='btn btn-warning'>Good</button>";
                        } else if (concernLevel == "Excellent") {
                            concernLevel =
                                "<buttton class='btn btn-danger'>Excellent</button>";
                        } else if (concernLevel == "Average") {
                            concernLevel = "<buttton class='btn btn-info'>Average</button>";
                        } else if (concernLevel == "Poor") {
                            concernLevel = "<buttton class='btn btn-dark'>Poor</button>";
                        }
                        var str =
                            "<div class='bg-light mx-2 '>" +
                            "<div class='border rounded text-light text-center mt-4 showHistoryCareDetail' style='background: rgb(72, 93, 138); height: 30px' id='btnShowHistoryCareDetail'>" +
                            "<div class = 'row'>" +
                            "<div class='col-4 border-right'>Start: " +
                            startTime +
                            "</div>" +
                            "<div class='col-4'>End: " +
                            endTime +
                            "</div>" +
                            "<div class='col-4 border-left'>Created by : " +
                            data.user.username +
                            "</div>" +
                            "</div>" +
                            "</div>" +
                            "<div class='border border-dark rounded text-center tableHistoryCare'; id='tableHistoryCare'>" +
                            "<div class='row' style ='height: 40px'>" +
                            "<div class='col-4 border-right'>ID: " +
                            data.historyCare.id +
                            "</div>" +
                            "<div class='col-4'>Method: " +
                            data.historyCare.method +
                            "</div>" +
                            "<div class='col-4 border-left'>Action: " +
                            data.historyCare.action +
                            "</div>" +
                            "</div>" +
                            "<div class='row'style ='height: 40px'>" +
                            "<div class='col-4 border-right border-top'> Purpose: " +
                            data.historyCare.purpose +
                            "</div>" +
                            "<div class='col-4  border-top'> Product Name: " +
                            data.historyCare.productName +
                            "</div>" +
                            "<div class='col-4 border-left border-top'>Concern level: " +
                            concernLevel +
                            "</div>" +
                            "</div>" +
                            "<div class='row border-top py-3 px-5'>Note: " +
                            data.historyCare.note +
                            " </div>" +
                            " </div>";
                        $("#listHistoryCare").prepend(str);
                        closeNav();
                    } else {
                        $.notify(data.message, {
                            position: "top center",
                            className: "error",
                        });
                    }
                },
                errror(error) {
                    console.log(JSON.stringify(historyCare));
                    console.log(error);
                },
            });
        }
    }
}
//scroll bar
$(document).ready(function () {
    $("#dataTables-example-historycare").DataTable({
        // scrollY: true,
    });
});
// ẩn hiện history care detail
$(document).ready(function () {
    $("body").on("click", ".showHistoryCareDetail", function () {
        $(this).next(".tableHistoryCare").slideToggle("slow");
    });
});