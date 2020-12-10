checkTokenWeb();
var idRecord = getCookie("idRecord");
var idEmployee = getCookie("idEmployee");

var mistakeList;

function getDate(today) {
    today = new Date(today);
    return today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
}

function getTime(today) {
    today = new Date(today);
    return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
}
var btnAction =
    " <button class='btn btn-outline-danger btn-rounded'" +
    "onclick='removeRow(this);'><i class='fas fa-trash'></i></button>";

$(document).ready(function () {
    document.getElementById("record").innerHTML =
        "<source src='' type='audio/mpeg'>";

    // var table = $("#dataTables-example").DataTable();
    // var rowRecord = table.row($(button).parents("td").parents("tr")).index();
    // idRecord = table.row(rowRecord).data()[0];
    // console.log(idRecord);
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
            window.location.assign("record.html");
        } else if (data.code == "000") {

            document.getElementById("record").innerHTML =
                "<source src='" + data.record.linkRecord + "' type='audio/mpeg'>";
            // console.log(data.mistakeList);
            // $("#totalScore").val()=data.record.scoreRecord;
            document.getElementById("totalScore").value = data.record.scoreRecord;
            var str = "";
            for (var i = 0; i < data.mistakeList.length; i++) {
                str +=
                    "<tr>" +
                    "<td>" +
                    data.recordMistakeList[i].idRecordMistake +
                    "</td>" +
                    "<td>" +
                    data.mistakeList[i].nameMistake +
                    "</td>" +
                    "<td>" +
                    convertTimeLine(data.recordMistakeList[i].timelineRecord) +
                    "</td>" +
                    "<td>" +
                    data.mistakeList[i].minusMistake +
                    "</td>" +
                    "<td>" +
                    data.recordMistakeList[i].minus +
                    "</td>" +
                    "<td>" +
                    data.recordMistakeList[i].comment +
                    "</td>" +
                    "<td>" +
                    getDate(data.recordMistakeList[i].createDate) + " " + getTime(data.recordMistakeList[i].createDate) +
                    "</td>" +
                    "<td>" +
                    data.recordMistakeList[i].idSupervisor +
                    "</td>" +
                    "<td>";
                str += btnAction + "</td> </tr>";
            }
            $("#dataTables-example").find("tbody").append(str);
            $("#dataTables-example").DataTable();
            isGoodJob()
        }
    }).fail(function (e) {
        console.log(e);
    });

    // get Mistake List to myFrom
    $.ajax({
        url: "http://" + ipAddress + "/mistake/getAllMistake",
        method: "GET",
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
    }).done(function (data) {
        mistakeList = data;
        // console.table(data)
        var str = "";
        for (var i = 0; i < data.mistakeList.length; i++) {
            str +=
                "<option value='" +
                data.mistakeList[i].idMistake +
                "'>" +
                "ID: " + data.mistakeList[i].idMistake + " - " + data.mistakeList[i].nameMistake +
                "</option>";
        }
        $("#mistake").append(str);
    });

});

var record = document.getElementById("record");

function getMistake() {
    record.pause();
    //hàm xóa sạch thông tin khi mở form thêm mới !
    removedRowToInput();
    document.getElementById("myForm").style.height = "90%";
    document.getElementById("overlay2").style.display = "block";
    // vô hiệu hóa nút sửa vì ta đang cần thêm !
    document.getElementById("editMistake").style.display = "none";
    document.getElementById("addMistake").style.display = "inline-block";
    document.getElementById("maxMinusScore").disabled = true;

    // document.getElementById("statusDiv").style.display = "none";
    // document.getElementById("statusDiv").style.display = "none";
}

//thêm lỗi
function addMistake() {
    var idMistake = $("#mistake").val(),
        timeline = record.currentTime,
        maxMinusScore = $("#maxMinusScore").val(),
        minusScore = $("#minusScore").val(),
        comment = $("#comment").val(),
        createDate = new Date()
    // var create_by_id_admin = getCookie("idUser");
    var table = $("#dataTables-example").DataTable();
    var length = parseInt(table.column(0).data().length);
    if (length == 0) {
        var idRow = 1;
    } else {
        var idRow = parseInt(table.row(length - 1).data()[0]) + 1;
    }
    // thêm ở phía server
    $.ajax({
        type: "POST",
        url: "http://" + ipAddress + "/record/saveRecord",
        contentType: "application/json",
        data: JSON.stringify({
            idRecord: idRecord,
            idMistake: idMistake,
            timelineRecord: timeline,
            minus: minusScore,
            comment: comment,
            createDate: createDate,
            idSupervisor: idEmployee
        }),
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function (data) {


            if (data.code == 200) {
                $.notify(data.message, {
                    position: "top center",
                    className: "success",
                });
                // thêm ở phía client
                // var table = document.getElementById("dataTables-example");
                // var idRow = table.rows.length;
                table = $("#dataTables-example").DataTable();
                for (var i = 0; i < mistakeList.mistakeList.length; i++) {
                    if (mistakeList.mistakeList[i].idMistake == $("#mistake").val()) {
                        mistake = mistakeList.mistakeList[i].nameMistake;
                        break;
                    }
                }
                console.table(data.recordMistakeList[0]);
                table.row
                    .add([
                        data.recordMistakeList[0].idRecordMistake,
                        mistake,
                        convertTimeLine(timeline),
                        maxMinusScore,
                        minusScore,
                        comment,
                        getDate(createDate) + " " + getTime(createDate),
                        idEmployee,
                        btnAction,
                    ])
                    .draw(false);

                var totalScore = document.getElementById("totalScore").value;
                totalScore -= minusScore;
                document.getElementById("totalScore").value = totalScore;
                isGoodJob();
                closeNav();
            } else {
                $.notify(data.message, {
                    position: "top center",
                    className: "error",
                });
            }
        },
    });

}

// xóa bản ghi khi nhấn button xóa (onclick)
function removeRow(button) {
    var lastModify = new Date();
    var table = $("#dataTables-example").DataTable();
    //lấy ra hàng
    var rowDelete = table.row($(button).parents("td").parents("tr")).index();
    // lấy giá trị trong cột 0:id
    idDelete = table.row(rowDelete).data()[0];
    var minusScore = table.row(rowDelete).data()[4];
    //và xóa luôn ở server
    if (confirm("Bạn chắc chắn muốn xóa bản ghi?")) {
        // xóa luôn Quyền ở phía server(Quyền xóa trước rồi mới xóa nhân viên !)
        $.ajax({
            type: "POST",
            url: "http://" + ipAddress + "/record/deleteRecordMistake",
            contentType: "application/json",
            data: JSON.stringify({
                idRecordMistake: idDelete,
                lastModify: lastModify,
                idSupervisor: idEmployee
            }),
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (data) {
                // xóa luôn Quyền ở phía client
                //alert(data.message);
                if (data.code === "300") {
                    $.notify(data.message, {
                        position: "top center",
                        className: "success",
                    });
                    table.row($(button).parents("td").parents("tr")).remove().draw();
                    var totalScore = document.getElementById("totalScore").value;
                    // var totalScore = parseInt(totalScoreString)+minusScore;
                    document.getElementById("totalScore").value = parseInt(totalScore) + parseInt(minusScore);
                    isGoodJob();
                    document.getElementById("mistake-btn").style.display = "inline";

                } else {
                    $.notify(data.message, {
                        position: "top center",
                        className: "error",
                    });
                }
            },
        });
    }
}


// hàm đóng form(dùng cho các nút X, thoát)
function closeNav() {
    document.getElementById("myForm").style.height = "0%";
    document.getElementById("overlay2").style.display = "none";

    document.getElementById("mistakeEmpty").innerHTML = "";
    document.getElementById("maxMinusScoreEmpty").innerHTML = "";
    document.getElementById("minusScoreEmpty").innerHTML = "";
    document.getElementById("commentEmpty").innerHTML = "";

}

// clear data form khi bật nút add user !
function removedRowToInput() {
    document.getElementById("mistake").value = "";
    document.getElementById("maxMinusScore").value = "";
    document.getElementById("minusScore").value = "";
    document.getElementById("comment").value = "";

}

function jumpToTimeLine(timeLine) {
    record.currentTime = timeLine;
    record.play();
}

function convertTimeLine(timeLine) {
    return " <a href='#'onclick='jumpToTimeLine(" + timeLine + ");'>" + timeLine + "</a>"
}

function changeMistake() {
    for (var i = 0; i < mistakeList.mistakeList.length; i++) {
        if (mistakeList.mistakeList[i].idMistake == $("#mistake").val()) {
            document.getElementById("maxMinusScore").value = mistakeList.mistakeList[i].minusMistake;
            break;
        }
    }
}

function choseMinus() {
    var minus = document.getElementById("minusScore").value;
    var maxMinus = document.getElementById("maxMinusScore").value;

    if (minus > maxMinus) {
        $.notify("Không thể trừ số điểm lớn hơn " + maxMinus, {
            position: "top center",
            className: "error",
        });
    }

}

function isGoodJob() {
    var table = $("#dataTables-example").DataTable();
    if (table.column(0).data().length > 0) {
        document.getElementById("mistake-btn").style.display = "inline";
        document.getElementById("goodJob-btn").style.display = "none";
    } else {
        document.getElementById("goodJob-btn").style.display = "inline";
    }

}

function goodJob() {
    table = $("#dataTables-example").DataTable();
    createDate = new Date()
    console.log(idEmployee);
    $.ajax({
        type: "POST",
        url: "http://" + ipAddress + "/record/saveRecord",
        contentType: "application/json",
        data: JSON.stringify({
            idRecord: idRecord,
            idMistake: 0,
            timelineRecord: 0,
            minus: 0,
            comment: "Hoàn hảo",
            createDate: createDate,
            idSupervisor: idEmployee
        }),
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function (data) {
            console
            if (data.code == 200) {
                // thêm ở phía client

                table.row
                    .add([
                        data.recordMistakeList[0].idRecordMistake,
                        "Không có",
                        "",
                        0,
                        0,
                        "Hoàn hảo",
                        getDate(createDate) + " " + getTime(createDate),
                        idEmployee,
                        btnAction,
                    ])
                    .draw(false);
                // console.log(idEmployee);
                document.getElementById("mistake-btn").style.display = "none";
                document.getElementById("goodJob-btn").style.display = "none";

            } else {
                $.notify("lưu thất bại", {
                    position: "top center",
                    className: "error",
                });
            }
        },
    });


}