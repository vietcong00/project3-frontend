checkTokenWeb();
$(document).ready(function () {
    // get RoleList to myFrom
    $.ajax({
        url: "http://" + ipAddress + "/role/roleList",
        method: "GET",
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
    }).done(function (data) {
        var str = "";
        for (var i = 1; i < data.roleList.length; i++) {
            str +=
                "<tr>" +
                "<td>" +
                data.roleList[i].idRole +
                "</td>" +
                "<td>" +
                data.roleList[i].name +
                "</td>" +
                "<td>" +
                "<button class='btn btn-outline-info btn-rounded'" +
                " onclick='openNavToEdit(this);'><i class='fas fa-pen'></i></button>" +
                " <button class='btn btn-outline-danger btn-rounded'" +
                "onclick='removeRow(this);'><i class='fas fa-trash'></i></button>" +
                "</td>";
            ("</tr>");
        }
        $("#dataTables-example").find("tbody").append(str);
        $("#dataTables-example").DataTable();
    });
});

//thêm sửa xóa frontend ở đây , sau sẽ có RestAPI ajax thì thêm code vào phần success ở ajax

//thêm Quyền
var role_page_action = new Array(50);

function addRow() {
    saveRow(-1);
}

var rowIndexEdit, idEdit;

function editRow() {
    saveRow(idEdit);
}

// xóa Role khi nhấn button xóa (onclick)

function removeRow(button) {
    var table = $("#dataTables-example").DataTable();
    //lấy ra Role

    var rowDelete = table.row($(button).parents("td").parents("tr")).index();
    // lấy giá trị trong cột 0:id
    idDelete = table.row(rowDelete).data()[0];

    // lấy giá trị trong cột 0:id
    idDelete = table.row(rowDelete).data()[0];

    if (
        confirm(
            "CẢNH BÁO: Những người dùng có quyền này sẽ không thể truy cập vào bất cứ trang nào ! \nBạn có chắc muốn xóa quyền này không ?"
        )
    ) {
        // xóa luôn quyền ở phía server !
        $.ajax({
            type: "DELETE",
            url: "http://" + ipAddress + "/role/deleteRole/" + idDelete,
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (data) {
                // xóa luôn Quyền ở phía client

                if (data.code == "000") {
                    $.notify(data.message, {
                        position: "top center",
                        className: "success",
                    });
                    table.row($(button).parents("td").parents("tr")).remove().draw();
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

function createRPAList(id_role) {
    var formSwitch = document.getElementById("formSwitch");
    var pageAction = formSwitch.getElementsByClassName("pageAction");
    var rolePageActionList = new Array();

    for (var i = 0; i < pageAction.length; i++) {
        var idPage = pageAction[i].getElementsByClassName("pageSwitch")[0].value;
        if (pageAction[i].getElementsByClassName("pageSwitch")[0].checked == true) {
            var rolePageAction = {
                idRole: id_role,
                idPage: idPage,
                idAction: 4,
            };
            rolePageActionList.push(rolePageAction);
        }
        var actionSwitch = pageAction[i].getElementsByClassName("actionSwitch");
        for (j = 0; j < actionSwitch.length; j++) {
            var idAction = actionSwitch[j].value;
            if (actionSwitch[j].checked == true) {
                var rolePageAction = {
                    idRole: id_role,
                    idPage: idPage,
                    idAction: idAction,
                };
                rolePageActionList.push(rolePageAction);
            }
        }
    }
    return rolePageActionList;
}

// save rolePageAction
function saveRow(idEdit) {
    if (!checkEmptyInput()) {
        var name = $("#name").val();
        var id_role = idEdit;
        var rolePageActionList = createRPAList(id_role);
        var role = {
            idRole: idEdit,
            name: name,
        };
        $.ajax({
            type: "POST",
            url: "http://" + ipAddress + "/role/saveRole",
            contentType: "application/json",
            data: JSON.stringify({
                role: role,
                rolePageActionList: rolePageActionList,
            }),
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (data) {
                //alert(data.message);
                if (data.code == "000") {
                    $.notify(data.message, {
                        position: "top center",
                        className: "success",
                    });
                    // sửa ở phía client
                    var table = $("#dataTables-example").DataTable();
                    table
                        .row(rowIndexEdit)
                        .data([
                            data.role.idRole,
                            name,
                            "<button class='btn btn-outline-info btn-rounded'" +
                            " onclick='openNavToEdit(this);'><i class='fas fa-pen'></i></button>" +
                            " <button class='btn btn-outline-danger btn-rounded'" +
                            "onclick='removeRow(this);'><i class='fas fa-trash'></i></button>",
                        ])
                        .draw();
                    closeNav();
                } else {
                    $.notify(data.message, {
                        position: "top center",
                        className: "error",
                    });
                }
            },
        });
    } else {
        $.notify("vui lòng điền đủ thông tin ! ", {
            position: "top center",
            className: "error",
        });
    }
}
// ---------------------------------------------------------------------------------------------------------------------
// các hàm phục vụ cho việc check dữ liệu, clear dữ liệu khi bật FormData,
// đóng mở form ,dán dữ liệu từ hàng vào form,................ ở đây nhé !
// ---------------------------------------------------------------------------------------------------------------------

// load thông tin từ hàng vào form khi nhấn icon sửa (hình bút !)
function selectedRowToInput() {
    var table = document.getElementById("dataTables-example");
    for (var i = 1; i < table.rows.length; i++) {
        table.rows[i].onclick = function () {
            // get the seected row index
            document.getElementById("role_id").value = this.cells[0].innerHTML;
            document.getElementById("name").value = this.cells[1].innerHTML;
        };
    }
}

// clear data form khi bật nút add user !
function removedRowToInput() {
    document.getElementById("name").value = "";
}

// clear các switch khi mở form infor
function clearSwitch() {
    var formSwitch = document.getElementById("formSwitch");
    var pageAction = formSwitch.getElementsByClassName("pageAction");

    for (var i = 0; i < pageAction.length; i++) {
        pageAction[i].getElementsByClassName("pageSwitch")[0].checked = false;
        var actionSwitch = pageAction[i].getElementsByClassName("actionSwitch");
        for (j = 0; j < actionSwitch.length; j++) {
            actionSwitch[j].checked = false;
        }
    }
}

// check the empty input
function checkEmptyInput() {
    var isEmpty = true,
        name = document.getElementById("name").value;

    if (name === "") {
        document.getElementById("nameEmpty").innerHTML = "*Chưa nhập tên !";
        isEmpty = true;
    } else {
        document.getElementById("nameEmpty").innerHTML = "";
    }
    var formSwitch = document.getElementById("formSwitch");
    var pageAction = formSwitch.getElementsByClassName("pageAction");

    for (var i = 0; i < pageAction.length; i++) {
        if (pageAction[i].getElementsByClassName("pageSwitch")[0].checked == true) {
            isEmpty = false;
            break;
        }
    }
    return isEmpty;
}

// hàm mở form
function openNav() {
    //hàm xóa sạch thông tin khi mở form thêm mới !
    removedRowToInput();
    clearSwitch();

    document.getElementById("myForm").style.height = "auto";
    document.getElementById("overlay2").style.display = "block";
    // vô hiệu hóa nút sửa vì ta đang cần thêm !
    document.getElementById("editRow").style.display = "none";
    document.getElementById("addRow").style.display = "inline-block";

    document.getElementById("nhomcuatoi").classList.remove("show");
    document.getElementById("khachhang").classList.remove("show");
    document.getElementById("giaodich").classList.remove("show");
    document.getElementById("sanpham").classList.remove("show");
    document.getElementById("chamsoc").classList.remove("show");
    document.getElementById("nhanvien").classList.remove("show");
}

// hàm đóng form(dùng cho các nút X, thoát)
function closeNav() {
    document.getElementById("myForm").style.height = "0%";
    document.getElementById("overlay2").style.display = "none";
}

// mở form để edit
function openNavToEdit(button) {
    document.getElementById("myForm").style.height = "auto";
    document.getElementById("overlay2").style.display = "block";
    // vô hiệu hóa nút thêm vì ta đang cần sửa !
    document.getElementById("editRow").style.display = "inline-block";
    document.getElementById("addRow").style.display = "none";
    //hàm đưa thông tin từ hàng vào form !
    selectedRowToInput();

    var table = $("#dataTables-example").DataTable();
    //lấy ra hàng
    rowIndexEdit = table.row($(button).parents("td").parents("tr")).index();
    // lấy chỉ mục dòng
    //var rowNumber = row.rowIndex;
    // lấy giá trị trong cột 0:id
    idEdit = table.row(rowIndexEdit).data()[0];

    $.ajax({
        url: "http://" + ipAddress + "/role/getRolePageAction/" + idEdit,
        method: "GET",
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
    }).done(function (data) {
        console.log(data.code);
        if (data.code == 100) {
            clearSwitch();
            var formSwitch = document.getElementById("formSwitch");
            var pageAction = formSwitch.getElementsByClassName("pageAction");
            if (data.rolePageActionList != null) {
                for (var i = 0; i < data.rolePageActionList.length; i++) {
                    for (var j = 0; j < pageAction.length; j++) {
                        if (
                            data.rolePageActionList[i].idPage ==
                            pageAction[j].getElementsByClassName("pageSwitch")[0].value
                        ) {
                            pageAction[j].getElementsByClassName(
                                "pageSwitch"
                            )[0].checked = true;
                            var actionSwitch = pageAction[j].getElementsByClassName(
                                "actionSwitch"
                            );
                            for (k = 0; k < actionSwitch.length; k++) {
                                if (
                                    data.rolePageActionList[i].idAction == actionSwitch[k].value
                                ) {
                                    actionSwitch[k].checked = true;
                                }
                            }
                        }
                    }
                }
            }
            if (document.getElementById("switchGroup").checked == true) {
                document.getElementById("nhomcuatoi").classList.add("show");
            } else {
                document.getElementById("nhomcuatoi").classList.remove("show");
            }
            if (document.getElementById("switchCustomer").checked == true) {
                document.getElementById("khachhang").classList.add("show");
            } else {
                document.getElementById("khachhang").classList.remove("show");
            }
            if (document.getElementById("switchTransaction").checked == true) {
                document.getElementById("giaodich").classList.add("show");
            } else {
                document.getElementById("giaodich").classList.remove("show");
            }
            if (document.getElementById("switchProduct").checked == true) {
                document.getElementById("sanpham").classList.add("show");
            } else {
                document.getElementById("sanpham").classList.remove("show");
            }
            if (document.getElementById("switchHistoryCare").checked == true) {
                document.getElementById("chamsoc").classList.add("show");
            } else {
                document.getElementById("chamsoc").classList.remove("show");

            }
            if (document.getElementById("switchUser").checked == true) {
                document.getElementById("nhanvien").classList.add("show");
            } else {
                document.getElementById("nhanvien").classList.remove("show");

            }
        } else {
            $.notify(data.message, {
                position: "top center",
                className: "error",
            });
            closeNav();
            table.row($(button).parents("td").parents("tr")).remove().draw();
        }
    });


}