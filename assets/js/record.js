checkTokenWeb();
var openRightFlag = true;

function getDate(today) {
    today = new Date(today);
    return today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
}

function getTime(today) {
    today = new Date(today);
    return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
}
var tableNotComment = 'dataTables-not-commented';
var tableComment = "dataTables-commented";


var btnDetailNotCommented =
    "<button class='btn btn-outline-success btn-rounded mr-1' " +
    " onclick='replaceToRecordDetail(this,tableNotComment);'><i class='fas fa-marker'></i></button>";


var btnDetailCommented =
    "<button class='btn btn-outline-success btn-rounded mr-1' " +
    " onclick='replaceToRecordDetail(this,tableComment);'><i class='fas fa-marker'></i></button>" +
    "<button class='btn btn-outline-success btn-rounded mr-1' " +
    " onclick='openDetail(this);'><i class='fas fa-comment-alt'></i></button>";;

$(document).ready(function () {
    //get all record
    var pageActionList = JSON.parse(getCookie("pageActionList"));

    $.ajax({
        url: "http://" + ipAddress + "/record/getAllRecord",
        method: "GET",
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
    }).done(function (data) {
        var strCommented = "";
        var strNotCommented = "";

        for (var i = 0; i < pageActionList.length; i++) {
            if (pageActionList[i].page.urlPage == "record.html") {
                for (var j = 0; j < pageActionList[i].actionList.length; j++) {
                    if (pageActionList[i].actionList[j].nameAction == "delete") {
                        deleteFlag = true;
                    }
                    if (pageActionList[i].actionList[j].nameAction == "add") {
                        addFlag = true;
                    }
                }
            }
        }

        for (var i = 0; i < data.recordList.length; i++) {
            if (data.recordList[i].statusRecord == "Not Commented") {
                strNotCommented +=
                    "<tr>" +
                    "<td>" +
                    data.recordList[i].idRecord +
                    "</td>" +
                    "<td>" +
                    data.recordList[i].idEmployee +
                    "</td>" +
                    "<td>" +
                    data.recordList[i].phoneCustomer +
                    "</td>" +
                    "<td>" +
                    getDate(data.recordList[i].creatDateRecord) +
                    "</td>" +
                    "<td>" +
                    getTime(data.recordList[i].createTimeRecord) +
                    "</td>" +
                    "<td>" +
                    getTime(data.recordList[i].endTimeRecord) +
                    "</td>" +
                    "<td>" +
                    data.recordList[i].descriptionRecord +
                    "</td>" +
                    "<td>";
                strNotCommented += btnDetailNotCommented + "</td> </tr>";
            } else {
                strCommented +=
                    "<tr>" +
                    "<td>" +
                    data.recordList[i].idRecord +
                    "</td>" +
                    "<td>" +
                    data.recordList[i].idEmployee +
                    "</td>" +
                    "<td>" +
                    data.recordList[i].phoneCustomer +
                    "</td>" +
                    "<td>" +
                    getDate(data.recordList[i].creatDateRecord) +
                    "</td>" +
                    "<td>" +
                    getTime(data.recordList[i].createTimeRecord) +
                    "</td>" +
                    "<td>" +
                    getTime(data.recordList[i].endTimeRecord) +
                    "</td>" +
                    "<td>" +
                    data.recordList[i].lastTimeCommentRecord +
                    "</td>" +
                    "<td>" +
                    data.recordList[i].lastIdSupervisor +
                    "</td>" +
                    "<td>" +
                    data.recordList[i].scoreRecord +
                    "</td>" +
                    "<td>";
                strCommented += btnDetailCommented + "</td> </tr>";
            }

        }

        $("#dataTables-not-commented").find("tbody").append(strNotCommented);
        $("#dataTables-not-commented").DataTable();

        $("#dataTables-commented").find("tbody").append(strCommented);
        $("#dataTables-commented").DataTable();
    });
});


// ---------------------------------------------------------------------------------------------------------------------
// các hàm phục vụ cho việc check dữ liệu, clear dữ liệu khi bật FormData,
// đóng mở form ,dán dữ liệu từ hàng vào form,................ ở đây nhé !
// ---------------------------------------------------------------------------------------------------------------------

// chuyển đến trang RecordDetail
function replaceToRecordDetail(button, tableName) {
    var table = $("#" + tableName).DataTable();
    //lấy ra hàng
    var rowRecord = table.row($(button).parents("td").parents("tr")).index();
    idRecord = table.row(rowRecord).data()[0];

    $.ajax({
        url: "http://" + ipAddress + "/record/getRecordDetail/" + idRecord,
        method: "POST",
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
    }).done(function (data) {
        console.log(data);
        if (data.code == "102") {
            $.notify(data.message, {
                position: "top center",
                className: "error",
            });
            // window.location.assign("record.html");
        } else if (data.code == "000") {
            createCookie("idRecord", idRecord, 30);
            window.location.assign("record-detail.html");
        }
    }).fail(function (e) {
        console.log(e);
    });

}


function openDetail(button) {
    console.log("AHIHI");
    var table = $("#dataTables-commented").DataTable();
    var rowRecord = table.row($(button).parents("td").parents("tr")).index();
    idRecord = table.row(rowRecord).data()[0];
    console.log(idRecord);
    $.ajax({
        url: "http://" + ipAddress + "/record/getRecordDetailSidebar/" + idRecord,
        method: "POST",
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
    }).done(function (data) {
        if (data.code == "101") {

            closeNav();
            // row0.remove().draw();
            $("#dataTables-example").DataTable();
            // table.row(rowIndexEdit).remove().draw();
        } else if (data.code == "000") {
            if (openRightFlag == true) {
                document.getElementById("sidebar-right").style.width = "55%";
                document.getElementById("sidebar-left").style.margin = "0% 1% 0% 0%";
                document.getElementById("sidebar-right").style.display = "block";
                document.getElementById("sidebar-left").style.width = "44%";
                document.getElementById("sidebar-left").style.transition = "0.3s";

                // var table = $("#dataTables-commented").DataTable();
                // rowRecord = table.row($(this)).index();
                // idRecord = table.row(rowIndexEdit).data()[0];
                // for (var i = 0; i < dataDeal.transactionWebList.length; i++) {
                //     if (idEdit == dataDeal.transactionWebList[i].transaction.idDeal) {
                //         dealInfor = dataDeal.transactionWebList[i];
                //         console.log(dataDeal.transactionWebList[i]);
                //         dealInforIndex = i;
                //         break;
                //     }
                // }
                // ẩn cột

                show_hide_table("hide");
                // console.log(dealInfor);
                var mistakeStr = "";
                console.log(data.mistakeList);

                for (var i = 0; i < data.mistakeList.length; i++) {
                    mistakeStr += "Mã lỗi: " + data.mistakeList[i].idMistake + ";  Tên lỗi: " + data.mistakeList[i].nameMistake + ";  Điểm trừ: " + data.mistakeList[i].minusMistake + "\n";
                }
                document.getElementById("description").value = data.record.descriptionRecord;
                document.getElementById("lastTimeComment").value = data.record.lastTimeCommentRecord;
                document.getElementById("lastIdSupervisor").value = data.record.lastIdSupervisor;
                document.getElementById("score").value = data.record.scoreRecord;
                document.getElementById("lastComment").value = mistakeStr;


            }
        }
    }).fail(function (e) {
        console.log(e);
    });
    openRightFlag = true;
}

function show_hide_table(data) {
    if (data == "hide") {
        // ẩn cột hành động
        $("td:nth-child(10)").hide();
        $("th:nth-child(10)").hide();
        // ẩn cột bắt đầu
        $("td:nth-child(5)").hide();
        $("th:nth-child(5)").hide();
        // ẩn cột kết thúc
        $("td:nth-child(6)").hide();
        $("th:nth-child(6)").hide();
        // ẩn cột đnahs giá cuối
        $("td:nth-child(7)").hide();
        $("th:nth-child(7)").hide();
        // ẩn cột người đánh giá cuối
        $("td:nth-child(8)").hide();
        $("th:nth-child(8)").hide();
        // ẩn cột điểm
        $("td:nth-child(9)").hide();
        $("th:nth-child(9)").hide();


    } else if (data == "show") {
        // show cột hành động
        $("td:nth-child(10)").show();
        $("th:nth-child(10)").show();
        // show cột bắt đầu
        $("td:nth-child(5)").show();
        $("th:nth-child(5)").show();
        // show cột kết thúc
        $("td:nth-child(6)").show();
        $("th:nth-child(6)").show();
        // show cột đnahs giá cuối
        $("td:nth-child(7)").show();
        $("th:nth-child(7)").show();
        // show cột người đánh giá cuối
        $("td:nth-child(8)").show();
        $("th:nth-child(8)").show();
        // show cột điểm
        $("td:nth-child(9)").show();
        $("th:nth-child(9)").show();

    }
}

function closeForm() {
    document.getElementById("sidebar-right").style.width = "0%";
    document.getElementById("sidebar-right").style.display = "none";
    document.getElementById("sidebar-left").style.width = "100%";
    document.getElementById("sidebar-left").style.transition = "0.5s";

    // hiện lại cột
    show_hide_table("show");
}