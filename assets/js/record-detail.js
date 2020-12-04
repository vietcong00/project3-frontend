// checkTokenWeb();
var btnAction =
    " <button class='btn btn-outline-danger btn-rounded'" +
    "onclick='removeRow(this);'><i class='fas fa-trash'></i></button>";

// $(document).ready(function () {
//     // get mistakeList to myFrom
//     $.ajax({
//         url: "http://" + ipAddress + "/mistake/mistakeList",
//         method: "GET",
//         beforeSend: function (xhr) {
//             var token = getCookie("token");
//             xhr.setRequestHeader("Authorization", "Bearer " + token);
//         },
//     }).done(function (data) {
//         var str = "";
//         for (var i = 1; i < data.mistakeList.length; i++) {
//             str +=
//                 "<option value='" +
//                 "'>" +
//                 "ID: " +
//                 data.mistakeList[i].idMistake +
//                 "-" +
//                 data.mistakeList[i].nameMistake +
//                 "</option>";
//         }
//         $("#group").append(str);
//     });
// });

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
    document.getElementById("maxMinusScore").disabled = false;

    // document.getElementById("statusDiv").style.display = "none";
    // document.getElementById("statusDiv").style.display = "none";
}

//thêm nhân viên
function addMistake() {
    var mistake = $("#mistake").val(),
        timeline = record.currentTime,
        maxMinusScore = $("#maxMinusScore").val(),
        minusScore = $("#minusScore").val(),
        comment = $("#comment").val(),
        lastUpdate = new Date();
    // var create_by_id_admin = getCookie("idUser");

    // thêm ở phía server
    // $.ajax({
    //     type: "POST",
    //     url: "http://" + ipAddress + "/user/saveUser",
    //     contentType: "application/json",
    //     data: JSON.stringify({
    //         mistake = mistake,
    //         timeline = timeline,
    //         minusScore = minusScore,
    //         comment = comment,
    //         lastUpdate = lastUpdate

    //     }),
    // beforeSend: function (xhr) {
    //     var token = getCookie("token");
    //     xhr.setRequestHeader("Authorization", "Bearer " + token);
    // },
    // success: function (data) {
    //     // alert(data.message + data.code);
    //     if (data.code == 200) {
    // thêm ở phía client
    var table = document.getElementById("dataTables-example");
    var idRow = table.rows.length;
    table = $("#dataTables-example").DataTable();

    table.row
        .add([
            idRow,
            mistake,
            " <a href='#'onclick='jumpToTimeLine("+timeline+");'>"+timeline+"</a>",
            maxMinusScore,
            minusScore,
            comment,
            lastUpdate,
            btnAction,
        ])
        .draw(false);

    closeNav();
    // } else {
    //     $.notify("lưu thất bại", {
    //         position: "top center",
    //         className: "error",
    //     });
    // }
    // },
    // });

}

// xóa bản ghi khi nhấn button xóa (onclick)
function removeRow(button) {
    var table = $("#dataTables-example").DataTable();
    //lấy ra hàng
    var rowDelete = table.row($(button).parents("td").parents("tr")).index();
    // lấy giá trị trong cột 0:id
    idDelete = table.row(rowDelete).data()[0];

    //và xóa luôn ở server
    if (confirm("Bạn chắc chắn muốn xóa bản ghi?")) {
        // xóa luôn Quyền ở phía server(Quyền xóa trước rồi mới xóa nhân viên !)
        // $.ajax({
        //     type: "DELETE",
        //     url: "http://" + ipAddress + "/user/deleteUser/" + idDelete,
        //     beforeSend: function (xhr) {
        //         var token = getCookie("token");
        //         xhr.setRequestHeader("Authorization", "Bearer " + token);
        //     },
        //     success: function (data) {
        //         // xóa luôn Quyền ở phía client
        //         //alert(data.message);
        //         if (data.code === "300") {
        //             $.notify(data.message, {
        //                 position: "top center",
        //                 className: "success",
        //             });
                    table.row($(button).parents("td").parents("tr")).remove().draw();
                // } else {
                //     $.notify(data.message, {
                //         position: "top center",
                //         className: "error",
                //     });
                // }
            // },
        // });
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

function jumpToTimeLine(timeLine){
    record.currentTime = timeLine;
    record.play();
}
