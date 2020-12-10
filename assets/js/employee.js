checkTokenWeb();
var editFlag = false;
var deleteFlag = false;
var addFlag = false;
var resetPasswordFlag = false;
var btnAction =
    "<button class='btn btn-outline-info btn-rounded'" +
    " onclick='openNavToEdit(this);'><i class='fas fa-pen'></i></button>" +
    "<button class='btn btn-outline-success btn-rounded mr-1' " +
    "onclick='replaceToEmployeeDetail(this);'><i class='fas fa-comment-alt'></i></button>";


$(document).ready(function () {
    //get all User except Admin
    var pageActionList = JSON.parse(getCookie("pageActionList"));

    $.ajax({
        url: "http://" + ipAddress + "/employee/getAllEmployee",
        method: "GET",
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
    }).done(function (data) {
        var str = "";

        for (var i = 0; i < pageActionList.length; i++) {
            if (pageActionList[i].page.urlPage == "employee.html") {
                for (var j = 0; j < pageActionList[i].actionList.length; j++) {
                    if (pageActionList[i].actionList[j].nameAction == "add") {
                        addFlag = true;
                    }
                    if (pageActionList[i].actionList[j].nameAction == "edit") {
                        editFlag = true;
                    }
                    if (pageActionList[i].actionList[j].nameAction == "delete") {
                        deleteFlag = true;
                    }
                    if (pageActionList[i].actionList[j].nameAction == "reset password") {
                        resetPasswordFlag = true;
                    }
                }
            }
        }
        // if (editFlag) {
        //     btnAction +=
        //         "<button class='btn btn-outline-info btn-rounded'" +
        //         " onclick='openNavToEdit(this);'><i class='fas fa-pen'></i></button>";
        // }
        // if (deleteFlag) {
        //     btnAction += "";
        // }
        // if (resetPasswordFlag) {
        //     // btnAction += " <button class='btn btn-outline-success btn-rounded'" +
        //     //     "onclick='resetPassword(this);'><span class='fa-passwd-reset fa-stack'> <i class='fa fa-undo fa-sync-alt' style = 'width :33px; height: 30px'></i><i class='fas fa-lock fa-stack-1x'></i></span></button>";
        //     btnAction +=
        //         " <button class='btn btn-outline-success btn-rounded'" +
        //         "onclick='resetPassword(this);'><i class='fas fa-sync-alt'></i></button>"+
        //         "<button class='btn btn-outline-success btn-rounded mr-1' " +
        //         "onclick='openDetail(this);'><i class='fas fa-comment-alt'></i></button>";

        // }
        // if (!addFlag) {
        //     $("#btnAdd").hide();
        // }

        for (var i = 0; i < data.employeeList.length; i++) {
            str +=
                "<tr>" +
                "<td>" +
                data.employeeList[i].idEmployee +
                "</td>" +
                "<td>" +
                data.employeeList[i].nameEmployee +
                "</td>" +
                "<td>" +
                data.employeeList[i].usernameEmployee +
                "</td>" +
                "<td>" +
                data.employeeList[i].emailEmployee +
                "</td>" +
                "<td>" +
                data.employeeList[i].phoneEmployee +
                "</td>" +
                "<td>" +
                data.employeeList[i].dateofbirthEmployee +
                "</td>" +
                "<td>" +
                data.employeeList[i].addressEmployee +
                "</td>" +
                "<td>" +
                data.employeeList[i].positionEmployee +
                "</td>" +
                "<td>" +
                changeColor(data.employeeList[i].statusEmployee) +
                "</td>" +
                "<td>";
            str += btnAction + "</td> </tr>";
        }
        $("#dataTables-example").find("tbody").append(str);
        $("#dataTables-example").DataTable();
    });
});

//thêm nhân viên
function addRow() {
    if (!checkEmptyInput()) {
        var name = $("#name").val(),
            userName = $("#userName").val(),
            dateofbirth = $("#dateofbirth").val(),
            email = $("#email").val(),
            password = $("#password").val(),
            phone = $("#phone").val(),
            address = $("#address").val(),
            position = $("#position").val();
        console.log(name);
        console.log(userName);
        // thêm ở phía server
        $.ajax({
            type: "POST",
            url: "http://" + ipAddress + "/employee/saveEmployee",
            contentType: "application/json",
            data: JSON.stringify({
                idEmployee: -1,
                nameEmployee: name,
                usernameEmployee: userName,
                dateofbirthEmployee: dateofbirth,
                emailEmployee: email,
                passwordEmployee: password,
                phoneEmployee: phone,
                addressEmployee: address,
                positionEmployee: position,
                statusEmployee: "Đang hoạt động",
            }),
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (data) {
                // alert(data.message + data.code);
                // console.log(data);
                $.notify(data.message, {
                    position: "top center",
                    className: "success",
                });
                if (data.code == 200) {
                    // thêm ở phía client
                    var table = $("#dataTables-example").DataTable();
                    table.row
                        .add([
                            data.employee.idEmployee,
                            name,
                            userName,
                            email,
                            phone,
                            dateofbirth,
                            address,
                            position,
                            changeColor("Đang hoạt động"),
                            btnAction
                        ])
                        .draw(false);

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
}

// xóa nhân viên khi nhấn button xóa (onclick)
function removeRow(button) {
    var table = $("#dataTables-example").DataTable();
    //lấy ra hàng
    var rowDelete = table.row($(button).parents("td").parents("tr")).index();
    // lấy giá trị trong cột 0:id
    idDelete = table.row(rowDelete).data()[0];
    h
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

var rowEmployee, idEmployee;
//sửa nhân viên
function editRow() {
    // var table = $("#dataTables-example").DataTable();
    // var rowEmployee = table.row($(button).parents("td").parents("tr")).index();
    // idEmployee = table.row(rowEmployee).data()[0];
    // console.log(idEmployee);
    if (!checkEmptyInput()) {
        var name = $("#name").val(),
            userName = $("#userName").val(),
            dateofbirth = $("#dateofbirth").val(),
            email = $("#email").val(),
            phone = $("#phone").val(),
            address = $("#address").val(),
            position = $("#position").val(),
            status = $("#status").val();

        // sửa ở phía server
        $.ajax({
            type: "POST",
            url: "http://" + ipAddress + "/employee/saveEmployee",
            contentType: "application/json",
            data: JSON.stringify({
                idEmployee: idEmployee,
                nameEmployee: name,
                emailEmployee: email,
                dateofbirthEmployee: dateofbirth,
                phoneEmployee: phone,
                addressEmployee: address,
                positionEmployee: position,
                statusEmployee: "Đang hoạt động",
            }),
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (data) {

                $.notify(data.message, {
                    position: "top center",
                    className: "success",
                });
                if (data.code == "000" || data.code == "200-2") {
                    // sửa lại bảng
                    // sửa = ở phía client
                    var table = $("#dataTables-example").DataTable();
                    table
                        .row(rowEmployee)
                        .data([
                            idEmployee,
                            name,
                            userName,
                            email,
                            dateofbirth,
                            position,
                            changeColor(status),
                            phone,
                            address,
                            btnAction,
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
            document.getElementById("name").value = this.cells[1].innerHTML;
            document.getElementById("userName").value = this.cells[2].innerHTML;
            document.getElementById("email").value = this.cells[3].innerHTML;
            document.getElementById("phone").value = this.cells[4].innerHTML;
            document.getElementById("dateofbirth").value = this.cells[5].innerHTML;
            document.getElementById("address").value = this.cells[6].innerHTML;
            document.getElementById("position").value = this.cells[7].innerHTML;
            document.getElementById("status").value = this.cells[8].textContent;
            getColorStatus(this.cells[7].textContent);
        };
    }
}

// clear data form khi bật nút add user !
function removedRowToInput() {
    document.getElementById("name").value = "";
    // document.getElementById("userName").value = "ahihi";
    document.getElementById("userName").value = "";

    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("dateofbirth").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("position").value = "";
    document.getElementById("status").value = "";
    document.getElementById("address").value = "";
    document.getElementById("password").disabled = false;
}
// check the empty input
function checkEmptyInput() {
    var isEmpty = false,
        name = document.getElementById("name").value,
        email = document.getElementById("email").value,
        password = document.getElementById("password").value,
        // position = document.getElementById("position").value,
        // status = document.getElementById("status").value,
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

    if (position === "") {
        document.getElementById("positionEmpty").innerHTML = "*Chưa chọn vị trí !";
        isEmpty = true;
    } else {
        document.getElementById("positionEmpty").innerHTML = "";
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
    document.getElementById("userName").disabled = false;
    document.getElementById("statusDiv").style.display = "none";
    // document.getElementById("positionDiv").style.display = "none";
    document.getElementById("password").setAttribute("type", "text");
}

// hàm đóng form(dùng cho các nút X, thoát)
function closeNav() {
    document.getElementById("myForm").style.height = "0%";
    document.getElementById("overlay2").style.display = "none";
    document.getElementById("nameEmpty").innerHTML = "";
    document.getElementById("usernameEmpty").innerHTML = "";
    document.getElementById("emailEmpty").innerHTML = "";
    document.getElementById("passwordEmpty").innerHTML = "";
    document.getElementById("dateofbirthEmpty").innerHTML = "";
    document.getElementById("addressEmpty").innerHTML = "";
    document.getElementById("phoneEmpty").innerHTML = "";
    document.getElementById("positionEmpty").innerHTML = "";
    document.getElementById("statusEmpty").innerHTML = "";

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
    // document.getElementById("positionDiv").style.display = "block";


    selectedRowToInput();

    var table = $("#dataTables-example").DataTable();
    //lấy ra hàng
    rowEmployee = table.row($(button).parents("td").parents("tr")).index();
    // lấy chỉ mục dòng
    //var rowNumber = row.rowIndex;
    // lấy giá trị trong cột 0:id
    idEmployee = table.row(rowEmployee).data()[0];

    //ẩn đi  những trường không cần sửa !
    document.getElementById("email").disabled = true;
    document.getElementById("password").disabled = true;
    document.getElementById("userName").disabled = true;
    document.getElementById("password").value = "******";
    document.getElementById("password").setAttribute("type", "password");
    document.getElementById("password").setAttribute("placeholder", "*******");

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

// chuyển đến trang RecordDetail
function replaceToEmployeeDetail(button) {
    var table = $("#dataTables-example").DataTable();
    var rowEmployee = table.row($(button).parents("td").parents("tr")).index();
    var idEmployee = table.row(rowEmployee).data()[0];
    var nameEmployee = table.row(rowEmployee).data()[1];
    createCookie("idEmployeeDetail", idEmployee, 30);
    createCookie("nameEmployeeDetail", nameEmployee, 30);

    window.location.assign("employeeDetail.html");
}