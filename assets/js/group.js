checkTokenWeb();
//thêm sửa xóa frontend ở đây , sau sẽ có RestAPI ajax thì thêm code vào phần success ở ajax\
var editFlag = false;
var deleteFlag = false;
var addFlag = false;
var btnAction = "";
var idUser = getCookie("idUser");
var idGroup = getCookie("idGroup");
var createTime = Date.now();

$(document).ready(function () {
    var pageActionList = JSON.parse(getCookie("pageActionList"));

    $.ajax({
        url: "http://" + ipAddress + "/user/getUserGroupInfo",
        method: "POST",
        data: idUser,
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
    }).done(function (data) {
        str = "";

        for (var i = 0; i < pageActionList.length; i++) {
            if (pageActionList[i].page.url == "group.html") {
                for (var j = 0; j < pageActionList[i].actionList.length; j++) {
                    if (pageActionList[i].actionList[j].name == "edit") {
                        editFlag = true;
                    }
                    if (pageActionList[i].actionList[j].name == "delete") {
                        deleteFlag = true;
                    }
                    if (pageActionList[i].actionList[j].name == "add") {
                        addFlag = true;
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
                data.userList[i].type +
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
        $("#dataTables-example").find("tbody").prepend(str);
        $("#dataTables-example").DataTable();
    });
});

//thêm nhân viên
function addRow() {
    if (!checkEmptyInput()) {
        var name = $("#name").val(),
            email = $("#emailGroup").val(),
            password = $("#password").val(),
            type = $("#type").val(),
            phone = $("#phone").val(),
            address = $("#address").val(),
            idGroup = getCookie("idGroup");

        $.ajax({
            type: "POST",
            url: "http://" + ipAddress + "/user/saveUser",
            contentType: "application/json",
            data: JSON.stringify({
                name: name,
                email: email,
                password: password,
                idGroup: idGroup,
                type: type,
                phone: phone,
                address: address,
                createByIdAdmin: 1,
                createTime: createTime,
                username: name + "noob",
            }),
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (data) {
                if (data.code == 200) {
                    // thêm ở phía client
                    var table = $("#dataTables-example").DataTable();
                    table.row
                        .add([
                            data.user.idUser,
                            name,
                            email,
                            type,
                            phone,
                            address,
                            btnAction,
                        ])
                        .draw(false);
                    // sau khi thêm xong nhân viên thì thêm quyền luôn !

                    var listUserRole = new Array();
                    var userRole = {
                        idUser: data.user.idUser,
                        idRole: 3,
                    };
                    listUserRole.push(userRole);

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
                            if ((data.code == 200)) {
                                $.notify(data.message, {
                                    position: "top center",
                                    className: "success",
                                });
                            } else {
                                // alert("lưu thất bại !");
                                $.notify("lưu thất bại !", {
                                    position: "top center",
                                    className: "error",
                                });
                            }
                        },
                    });
                    closeNav();
                } else {
                    $.notify(data.message, {
                        position: "top center",
                        className: "error",
                    });
                }
            },
            error: function (e) { },
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
            url: "http://" + ipAddress + "/role/deleteUserRole/" + idDelete,
            success: function (data) {
                if (data.code == 201) {
                    $.notify(data.message, {
                        position: "top center",
                        className: "error",
                    });
                } else {
                    // alert(data.message);
                    $.notify(data.message, {
                        position: "top center",
                        className: "success",
                    });
                    // xóa luôn nhân viên ở phía server !
                    $.ajax({
                        type: "DELETE",
                        url: "http://" + ipAddress + "/user/deleteUser/" + idDelete,
                        beforeSend: function (xhr) {
                            var token = getCookie("token");
                            xhr.setRequestHeader("Authorization", "Bearer " + token);
                        },
                        success: function (data) {
                            // xóa luôn NV ở phía client
                            if (data.code == 301) {
                                //  alert(data.message);
                                $.notify(data.message, {
                                    position: "top center",
                                    className: "error",
                                });
                            } else if (data.code == 300) {
                                table
                                    .row($(button).parents("td").parents("tr"))
                                    .remove()
                                    .draw();
                            }
                        },
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
            email = $("#emailGroup").val(),
            //   password = $("#password").val(),
            type = $("#type").val(),
            phone = $("#phone").val(),
            address = $("#address").val(),
            idGroup = getCookie("idGroup");
        // sửa ở phía server
        $.ajax({
            type: "POST",
            url: "http://" + ipAddress + "/user/saveUser",
            contentType: "application/json",
            data: JSON.stringify({
                idUser: idEdit,
                name: name,
                // email: email,
                // password: password,
                type: type,
                phone: phone,
                address: address,
                idGroup: idGroup,
                createTime: createTime,
                // createByIdAdmin: create_by_id_admin
            }),
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (data) {
                if (data.code == 200 || data.code == "200-2") {
                    $.notify("Sửa thành công", {
                        position: "top center",
                        className: "success",
                    });
                    // sửa lại bảng
                    // sửa = ở phía client
                    var table = $("#dataTables-example").DataTable();
                    table
                        .row(rowIndexEdit)
                        .data([idEdit, name, email, type, phone, address, btnAction])
                        .draw();
                    // closeNav();
                } else {
                    $.notify("Sửa thất bại - lỗi trùng !", {
                        position: "top center",
                        className: "error",
                    });
                }
            },
        });
        // sửa quyền ở đây !
        // var id_role = $('#role').val();
        // $.ajax({
        //     type: "POST",
        //     url: "http://"+ipAddress+"/role/saveUserRole",
        //     contentType: 'application/json',
        //     data: JSON.stringify({
        //         idUser: idEdit,
        //         idRole: id_role
        //     }),
        //     success: function (data) {
        //         if (data.code === "200-2") {
        //             console.log(data.message);
        //         } else {
        //             console.log(data.message);
        //         }
        //     },
        // });
        closeNav();
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
            document.getElementById("emailGroup").value = this.cells[2].innerHTML;
            document.getElementById("type").value = this.cells[3].innerHTML;
            document.getElementById("phone").value = this.cells[4].innerHTML;
            document.getElementById("address").value = this.cells[5].innerHTML;
        };
    }
}

// clear data form khi bật nút add user !
function removedRowToInput() {
    document.getElementById("name").value = "";
    document.getElementById("emailGroup").value = "";
    document.getElementById("password").value = "";
    document.getElementById("type").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("address").value = "";
}
// check the empty input
function checkEmptyInput() {
    var isEmpty = false,
        name = document.getElementById("name").value,
        email = document.getElementById("emailGroup").value,
        password = document.getElementById("password").value,
        type = document.getElementById("type").value,
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

    if (type === "") {
        document.getElementById("typeEmpty").innerHTML = "*Chưa chọn vai trò !";
        isEmpty = true;
    } else {
        document.getElementById("typeEmpty").innerHTML = "";
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
    document.getElementById("emailGroup").disabled = false;
    // document.getElementById("statusDiv").style.display = "none";
    document.getElementById("password").setAttribute("type", "text");
}

// hàm đóng form(dùng cho các nút X, thoát)
function closeNav() {
    document.getElementById("myForm").style.height = "0%";
    document.getElementById("overlay2").style.display = "none";
}

// mở form để edit
function openNavToEdit(button) {
    document.getElementById("myForm").style.height = "90%";
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

    //ẩn đi  những trường không cần sửa !
    document.getElementById("emailGroup").disabled = true;
    document.getElementById("password").disabled = true;
    document.getElementById("password").value = "******";
    document.getElementById("password").setAttribute("type", "password");
    document.getElementById("password").setAttribute("placeholder", "*******");
}