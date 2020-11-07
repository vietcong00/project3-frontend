checkTokenWeb();
var editFlag = false;
var deleteFlag = false;
var addFlag = false;
var resetPasswordFlag = false;
var btnAction = "";

$(document).ready(function () {
    //get all User except Admin
    var pageActionList = JSON.parse(getCookie("pageActionList"));

    $.ajax({
        url: "http://" + ipAddress + "/user/getAllUserExceptAdmin",
        method: "GET",
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
    }).done(function (data) {
        var str = "";

        for (var i = 0; i < pageActionList.length; i++) {
            if (pageActionList[i].page.url == "users.html") {
                for (var j = 0; j < pageActionList[i].actionList.length; j++) {
                    if (pageActionList[i].actionList[j].name == "add") {
                        addFlag = true;
                    }
                    if (pageActionList[i].actionList[j].name == "edit") {
                        editFlag = true;
                    }
                    if (pageActionList[i].actionList[j].name == "delete") {
                        deleteFlag = true;
                    }
                    if (pageActionList[i].actionList[j].name == "reset password") {
                        resetPasswordFlag = true;
                    }
                }
            }
        }
        if (editFlag) {
            btnAction +=
                "<button class='btn btn-outline-info btn-rounded'" +
                " onclick='openNavToEdit(this);'><i class='fas fa-pen'></i></button>";
        }
        if (deleteFlag) {
            btnAction += "";
        }
        if (resetPasswordFlag) {
            // btnAction += " <button class='btn btn-outline-success btn-rounded'" +
            //     "onclick='resetPassword(this);'><span class='fa-passwd-reset fa-stack'> <i class='fa fa-undo fa-sync-alt' style = 'width :33px; height: 30px'></i><i class='fas fa-lock fa-stack-1x'></i></span></button>";
            btnAction +=
                " <button class='btn btn-outline-success btn-rounded'" +
                "onclick='resetPassword(this);'><i class='fas fa-sync-alt'></i></button>";
        }
        if (!addFlag) {
            $("#btnAdd").hide();
        }
        for (var i = 0; i < data.userList.length; i++) {
            str +=
                "<tr>" +
                "<td>" +
                data.userList[i].idUser +
                "</td>" +
                "<td>" +
                data.userList[i].name +
                "</td>" +
                "<td>" +
                data.userList[i].email +
                "</td>" +
                "<td>" +
                data.userList[i].idGroup +
                "</td>" +
                "<td>" +
                data.userList[i].type +
                "</td>" +
                "<td>" +
                changeColor(data.userList[i].status) +
                "</td>" +
                "<td>" +
                data.userList[i].phone +
                "</td>" +
                "<td>" +
                data.userList[i].address +
                "</td>" +
                "<td>";
            str += btnAction + "</td> </tr>";
        }
        $("#dataTables-example").find("tbody").append(str);
        $("#dataTables-example").DataTable();
    });

    // get GroupList to myFrom
    $.ajax({
        url: "http://" + ipAddress + "/group/groupList",
        method: "GET",
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
    }).done(function (data) {
        var str = "";
        for (var i = 1; i < data.groupList.length; i++) {
            str +=
                "<option value='" +
                data.groupList[i].idGroup +
                "'>" +
                "ID: " +
                data.groupList[i].idGroup +
                "-" +
                data.groupList[i].groupName +
                "</option>";
        }
        $("#group").append(str);
    });

    // get RoleList to myFrom
    listRoleId = new Array();
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
                '<input type="checkbox" id="' +
                data.roleList[i].idRole +
                '" name="vehicle1" value="' +
                data.roleList[i].idRole +
                '">' +
                '<label for="vehicle1">' +
                "&nbsp;&nbsp;&nbsp;&nbsp;Tên quyền: " +
                data.roleList[i].name +
                "</label><br>";
            listRoleId[i - 1] = data.roleList[i].idRole;
        }
        $("#roleList").append(str);
    });
});

//thêm nhân viên
function addRow() {
    if (!checkEmptyInput()) {
        var name = $("#name").val(),
            email = $("#email").val(),
            password = $("#password").val(),
            group = $("#group").val(),
            type = $("#type").val(),
            // status = $("#status").val(),
            phone = $("#phone").val(),
            address = $("#address").val();
        var create_by_id_admin = getCookie("idUser");

        // thêm ở phía server
        $.ajax({
            type: "POST",
            url: "http://" + ipAddress + "/user/saveUser",
            contentType: "application/json",
            data: JSON.stringify({
                name: name,
                email: email,
                password: password,
                idGroup: group,
                type: type,
                status: "Đang hoạt động",
                phone: phone,
                address: address,
                createByIdAdmin: create_by_id_admin,
                // username: name,
            }),
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (data) {
                // alert(data.message + data.code);
                if (data.code == 200) {
                    // thêm ở phía client
                    var table = $("#dataTables-example").DataTable();
                    table.row
                        .add([
                            data.user.idUser,
                            name,
                            email,
                            group,
                            type,
                            changeColor(data.user.status),
                            phone,
                            address,
                            btnAction,
                        ])
                        .draw(false);
                    // sau khi thêm xong nhân viên thì thêm quyền luôn !

                    var listUserRole = new Array();
                    for (var i = 0; i < listRoleId.length; i++) {
                        if (document.getElementById(listRoleId[i]).checked == true) {
                            var userRole = {
                                idUser: data.user.idUser,
                                idRole: listRoleId[i],
                            };
                            listUserRole.push(userRole);
                        }
                    }
                    $.ajax({
                        type: "POST",
                        url: "http://" + ipAddress + "/role/saveUserRoleList",
                        contentType: "application/json",
                        data: JSON.stringify(listUserRole),
                        beforeSend: function (xhr) {
                            var token = getCookie("token");
                            xhr.setRequestHeader("Authorization", "Bearer " + token);
                        },
                        success: function (data) {
                            if ((data.code = 200)) {
                                $.notify("thêm thành công", {
                                    position: "top center",
                                    className: "success",
                                });
                            } else {
                                //  alert("lưu thất bại !");
                                $.notify("lưu thất bại", {
                                    position: "top center",
                                    className: "error",
                                });
                            }
                        },
                    });
                    closeNav();
                } else {
                    $.notify("lưu thất bại", {
                        position: "top center",
                        className: "error",
                    });
                }
            },
        });
    }
}

// xóa nhân viên khi nhấn button xóa (onclick)
function removeRow(button) {
    var table = $("#dataTables-example").DataTable();
    //lấy ra hàng
    var rowDelete = table.row($(button).parents("td").parents("tr")).index();
    // lấy giá trị trong cột 0:id
    idDelete = table.row(rowDelete).data()[0];

    //và xóa luôn ở server
    if (confirm("Bạn chắc chắn muốn xóa bản ghi?")) {
        // xóa luôn Quyền ở phía server(Quyền xóa trước rồi mới xóa nhân viên !)
        $.ajax({
            type: "DELETE",
            url: "http://" + ipAddress + "/user/deleteUser/" + idDelete,
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

var rowIndexEdit, idEdit;
//sửa nhân viên
function editRow() {
    if (!checkEmptyInput()) {
        var name = $("#name").val(),
            email = $("#email").val(),
            // password = $('#password').val(),
            group = $("#group").val(),
            type = $("#type").val(),
            status = $("#status").val(),
            phone = $("#phone").val(),
            address = $("#address").val();

        // sửa ở phía server
        $.ajax({
            type: "POST",
            url: "http://" + ipAddress + "/user/saveUser",
            contentType: "application/json",
            data: JSON.stringify({
                idUser: idEdit,
                name: name,
                idGroup: group,
                type: type,
                status: status,
                phone: phone,
                address: address,
            }),
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (data) {
                // alert(data.message);
                if (data.code == "200" || data.code == "200-2") {
                    // sửa lại bảng
                    // sửa = ở phía client
                    var table = $("#dataTables-example").DataTable();
                    table
                        .row(rowIndexEdit)
                        .data([
                            idEdit,
                            name,
                            email,
                            group,
                            type,
                            changeColor(status),
                            phone,
                            address,
                            btnAction,
                        ])
                        .draw();
                    // closeNav();
                    // sau khi sửa xong nhân viên thì sửa quyền luôn !
                    var listRoleIdChecked = new Array();
                    for (var i = 0; i < listRoleId.length; i++) {
                        if (document.getElementById(listRoleId[i]).checked == true) {
                            listRoleIdChecked[i] = listRoleId[i];
                        }
                    }
                    var listUserRole = new Array();
                    for (var i = 0; i < listRoleIdChecked.length; i++) {
                        if (listRoleIdChecked[i] != null) {
                            var userRole = {
                                idUser: idEdit,
                                idRole: listRoleIdChecked[i],
                            };
                            listUserRole.push(userRole);
                        }
                    }
                    $.ajax({
                        type: "POST",
                        url: "http://" + ipAddress + "/role/saveUserRoleList",
                        contentType: "application/json",
                        data: JSON.stringify(listUserRole),
                        beforeSend: function (xhr) {
                            var token = getCookie("token");
                            xhr.setRequestHeader("Authorization", "Bearer " + token);
                        },
                        success: function (data) {
                            if (data.code == "201") {
                                $.notify("sửa thành công !", {
                                    position: "top center",
                                    className: "success",
                                });
                            } else {
                                $.notify("lưu thất bại !", {
                                    position: "top center",
                                    className: "error",
                                });
                            }
                        },
                    });
                    closeNav();
                } else {
                    $.notify("lưu thất bại - kiểm tra lại thông tin !", {
                        position: "top center",
                        className: "error",
                    });
                }
            },
        });
    }
}

// reset mật khẩu nhân viên khi nhấn button reset (onclick)
function resetPassword(button) {
    var table = $("#dataTables-example").DataTable();
    //lấy ra hàng
    var rowReset = table.row($(button).parents("td").parents("tr")).index();
    // lấy giá trị trong cột 0:id
    idReset = table.row(rowReset).data()[0];

    //và xóa luôn ở server
    if (confirm("Bạn chắc chắn muốn reset mật khẩu của nhân viên này ?")) {
        // xóa luôn Quyền ở phía server(Quyền xóa trước rồi mới xóa nhân viên !)
        $.ajax({
            type: "Post",
            url: "http://" + ipAddress + "/user/resetpassword",
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            data: idReset,
            success: function (data) {
                // xóa luôn Quyền ở phía client
                $.notify(data.message, {
                    position: "top center",
                    className: "success",
                });
                if (data.code === "300") {
                    table.row($(button).parents("td").parents("tr")).remove().draw();
                }
            },
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
            document.getElementById("user_id").value = this.cells[0].innerHTML;
            document.getElementById("name").value = this.cells[1].innerHTML;
            document.getElementById("email").value = this.cells[2].innerHTML;
            document.getElementById("group").value = this.cells[3].innerHTML;
            document.getElementById("type").value = this.cells[4].innerHTML;
            document.getElementById("status").value = this.cells[5].textContent;
            getColorStatus(this.cells[5].textContent);
            document.getElementById("phone").value = this.cells[6].innerHTML;
            document.getElementById("address").value = this.cells[7].innerHTML;
        };
    }
}

// clear data form khi bật nút add user !
function removedRowToInput() {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("group").value = "";
    document.getElementById("type").value = "";
    document.getElementById("status").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("address").value = "";
    document.getElementById("password").disabled = false;
}
// check the empty input
function checkEmptyInput() {
    var isEmpty = false,
        name = document.getElementById("name").value,
        email = document.getElementById("email").value,
        password = document.getElementById("password").value,
        group = document.getElementById("group").value,
        type = document.getElementById("type").value,
        status = document.getElementById("status").value,
        phone = document.getElementById("phone").value,
        address = document.getElementById("address").value;

    // kiểm tra định dạng email,phone
    var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    var email_regex = /\S+\.\S+@\S+\.\S+/;

    if (name === "") {
        document.getElementById("nameEmpty").innerHTML = "*Chưa nhập tên !";
        isEmpty = true;
    } else {
        document.getElementById("nameEmpty").innerHTML = "";
    }

    if (email === "") {
        document.getElementById("emailEmpty").innerHTML = "*Chưa nhập email !";
        isEmpty = true;
    } else {
        document.getElementById("emailEmpty").innerHTML = "";
    }

    if (password === "") {
        document.getElementById("passwordEmpty").innerHTML =
            "*Chưa nhập mật khẩu !";
        isEmpty = true;
    } else {
        document.getElementById("passwordEmpty").innerHTML = "";
    }

    if (group === "") {
        document.getElementById("groupEmpty").innerHTML = "*Chưa chọn nhóm !";
        isEmpty = true;
    } else {
        document.getElementById("groupEmpty").innerHTML = "";
    }

    if (type === "") {
        document.getElementById("typeEmpty").innerHTML = "*Chưa chọn loại !";
        isEmpty = true;
    } else {
        document.getElementById("typeEmpty").innerHTML = "";
    }
    var countRole = 0;
    for (var i = 0; i < listRoleId.length; i++) {
        if (document.getElementById(listRoleId[i]).checked == true) {
            countRole++;
        }
    }
    // console.log(countRole);
    if (countRole == 0) {
        document.getElementById("roleEmpty").innerHTML = "*Chưa chọn vai trò !";
        isEmpty = true;
    } else {
        document.getElementById("roleEmpty").innerHTML = "";
    }

    if (phone === "") {
        document.getElementById("phoneEmpty").innerHTML =
            "*Chưa nhập số điện thoại !";
        isEmpty = true;
    } else {
        document.getElementById("phoneEmpty").innerHTML = "";
    }

    if (address === "") {
        document.getElementById("addressEmpty").innerHTML = "*Chưa nhập địa chỉ !";
        isEmpty = true;
    } else {
        document.getElementById("addressEmpty").innerHTML = "";
    }
    // kiểm tra định dạng email,phone
    var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    var email_regex = /\S+\.\S+@\S+\.\S+/;

    if (vnf_regex.test(phone) == false) {
        document.getElementById("phoneEmpty").innerHTML =
            "*Số điện thoại sai định dạng !";
        isEmpty = true;
    } else {
        document.getElementById("phoneEmpty").innerHTML = "";
    }
    if (email_regex.test(email) == false) {
        document.getElementById("emailEmpty").innerHTML = "*Email sai định dạng !";
        isEmpty = true;
    } else {
        document.getElementById("emailEmpty").innerHTML = "";
    }
    return isEmpty;
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
    document.getElementById("password").disabled = false;
    document.getElementById("email").disabled = false;
    document.getElementById("statusDiv").style.display = "none";
    document.getElementById("password").setAttribute("type", "text");
}

// hàm đóng form(dùng cho các nút X, thoát)
function closeNav() {
    document.getElementById("myForm").style.height = "0%";
    document.getElementById("overlay2").style.display = "none";

    document.getElementById("nameEmpty").innerHTML = "";
    document.getElementById("emailEmpty").innerHTML = "";
    document.getElementById("passwordEmpty").innerHTML = "";
    document.getElementById("addressEmpty").innerHTML = "";
    document.getElementById("phoneEmpty").innerHTML = "";
    document.getElementById("roleEmpty").innerHTML = "";
    document.getElementById("typeEmpty").innerHTML = "";
    document.getElementById("statusEmpty").innerHTML = "";
    document.getElementById("groupEmpty").innerHTML = "";

    for (var i = 0; i < listRoleId.length; i++) {
        document.getElementById(listRoleId[i]).checked = false;
    }
    document.getElementById("roleList").classList.remove("show");
}

// mở form để edit
function openNavToEdit(button) {
    document.getElementById("myForm").style.height = "90%";
    document.getElementById("overlay2").style.display = "block";
    // vô hiệu hóa nút thêm vì ta đang cần sửa !
    document.getElementById("editRow").style.display = "inline-block";
    document.getElementById("addRow").style.display = "none";
    //hàm đưa thông tin từ hàng vào form !
    document.getElementById("statusDiv").style.display = "block";

    selectedRowToInput();

    var table = $("#dataTables-example").DataTable();
    //lấy ra hàng
    rowIndexEdit = table.row($(button).parents("td").parents("tr")).index();
    // lấy chỉ mục dòng
    //var rowNumber = row.rowIndex;
    // lấy giá trị trong cột 0:id
    idEdit = table.row(rowIndexEdit).data()[0];

    //ẩn đi  những trường không cần sửa !
    document.getElementById("email").disabled = true;
    document.getElementById("password").disabled = true;
    document.getElementById("password").value = "******";
    document.getElementById("password").setAttribute("type", "password");
    document.getElementById("password").setAttribute("placeholder", "*******");

    for (var i = 0; i < listRoleId.length; i++) {
        document.getElementById(listRoleId[i]).checked = false;
    }
    //lấy list Role
    $.ajax({
        url: "http://" + ipAddress + "/role/getUserRoleList/" + idEdit,
        method: "POST",
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
    }).done(function (data) {
        if (data.code == "100") {
            if (data.userRoleList != null) {
                document.getElementById("roleList").classList.add("show");
                for (var i = 0; i < data.userRoleList.length; i++) {
                    if (data.userRoleList[i].idRole != 0) {
                        document.getElementById(data.userRoleList[i].idRole).checked = true;
                    }
                }
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

function changeColor(status) {
    var statusString = "";
    if (status == "Đang hoạt động") {
        statusString = "<p  style='color:green' class='status'>" + status + "</p>";
    } else if (status == "Không hoạt động") {
        statusString = "<p  style='color:red' class='status'>" + status + "</p>";
    } else if (status == null) {
        statusString = "<p>" + status + "</p>";
    }
    return statusString;
}

function changeStatus() {
    var status = document.getElementById("status").value;
    if (status == "Đang hoạt động") {
        document.getElementById("status").style.color = "green";
    } else if (status == "Không hoạt động") {
        document.getElementById("status").style.color = "red";
    }
}

function getColorStatus(data) {
    if (data == "Đang hoạt động") {
        document.getElementById("status").style.color = "green";
    } else if (data == "Không hoạt động") {
        document.getElementById("status").style.color = "red";
    }
}

function downloadExcel() {

    const a = document.createElement('a');
    var token = getCookie("token");
    url = "http://" + ipAddress + "/excel/download/users/" + token;
    a.style.display = 'none';
    a.href = url;
    a.click();
    a.remove();
}