checkTokenWeb();
// lấy ngày giờ hôm nay
var today = new Date();
var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date + " " + time;

var editFlag = false;
var deleteFlag = false;
var addFlag = false;
var historyCareFlag = false;
var btnAction = "";
var btnHistoryCare =
    "<button class='btn btn-outline-success btn-rounded mr-1' " +
    " onclick='replaceToCustomerHistoryCare(this);'><i class='fas fa-address-book'></i></button>";

$(document).ready(function () {
    //get all Customer
    var pageActionList = JSON.parse(getCookie("pageActionList"));

    $.ajax({
        url: "http://" + ipAddress + "/customer/getAllCustomer",
        method: "GET",
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
    }).done(function (data) {
        var str = "";

        for (var i = 0; i < pageActionList.length; i++) {
            if (pageActionList[i].page.url == "customer.html") {
                for (var j = 0; j < pageActionList[i].actionList.length; j++) {
                    if (pageActionList[i].actionList[j].name == "edit") {
                        editFlag = true;
                    }
                    if (pageActionList[i].actionList[j].name == "delete") {
                        deleteFlag = true;
                    }
                    if (pageActionList[i].actionList[j].name == "historycare") {
                        historyCareFlag = true;
                    }
                    if (pageActionList[i].actionList[j].name == "add") {
                        addFlag = true;
                    }
                }
            }
        }
        if (historyCareFlag) {
            btnAction += btnHistoryCare;
        }
        if (editFlag) {
            btnAction +=
                "<button class='btn btn-outline-info btn-rounded'" +
                " onclick='openNavToEdit(this);'><i class='fas fa-pen'></i></button>";
        }
        if (deleteFlag) {
            // btnAction +=
            //     " <button class='btn btn-outline-danger btn-rounded'" +
            //     "onclick='removeRow(this);'><i class='fas fa-trash'></i></button>";
            btnAction += "";
        }
        if (!addFlag) {
            $("#btnAdd").hide();
        }
        for (var i = 0; i < data.customerList.length; i++) {
            str +=
                "<tr>" +
                "<td>" +
                data.customerList[i].idCustomer +
                "</td>" +
                "<td>" +
                data.customerList[i].name +
                "</td>" +
                "<td>" +
                data.customerList[i].email +
                "</td>" +
                "<td>" +
                data.customerList[i].phone +
                "</td>" +
                "<td>" +
                data.customerList[i].address +
                "</td>" +
                "<td>";
            str += btnAction + "</td> </tr>";
        }

        $("#dataTables-example").find("tbody").append(str);
        $("#dataTables-example").DataTable();
    });
});

//thêm sửa xóa frontend ở đây , sau sẽ có RestAPI ajax thì thêm code vào phần success ở ajax

//thêm khach hang
function addRow() {
    if (!checkEmptyInput()) {
        var name = $("#name").val(),
            email = $("#email").val(),
            phone = $("#phone").val(),
            address = $("#address").val();
        var create_by_id_user = getCookie("idUser");
        // thêm ở phía server
        $.ajax({
            type: "POST",
            url: "http://" + ipAddress + "/customer/saveCustomer",
            contentType: "application/json",
            data: JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                address: address,
                createByIdUser: create_by_id_user,
                createTime: dateTime,
            }),
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (data) {
                if (data.code == 201) {
                    $.notify(data.message, {
                        position: "top center",
                        className: "error",
                    });
                }
                if (data.code == 202) {
                    $.notify(data.message, {
                        position: "top center",
                        className: "error",
                    });
                }
                if (data.code == 203) {
                    $.notify(data.message, {
                        position: "top center",
                        className: "error",
                    });
                }
                if (data.code == 204) {
                    $.notify(data.message, {
                        position: "top center",
                        className: "error",
                    });
                } else if (data.code == 200) {
                    $.notify(data.message, {
                        position: "top center",
                        className: "success",
                    });

                    // thêm ở phía client
                    var table = $("#dataTables-example").DataTable();
                    table.row
                        .add([
                            data.customer.idCustomer,
                            name,
                            email,
                            phone,
                            address,
                            btnAction,
                        ])
                        .draw(false);
                    closeNav();
                }
            },
        });
    }
}

// xóa khách hàng khi nhấn button xóa (onclick)
function removeRow(button) {
    var table = $("#dataTables-example").DataTable();
    //lấy ra hàng
    var rowDelete = table.row($(button).parents("td").parents("tr")).index();
    // lấy chỉ mục dòng
    //var rowNumber = row.rowIndex;
    // lấy giá trị trong cột 0:id
    idDelete = table.row(rowDelete).data()[0];

    //và xóa luôn ở server
    if (confirm("Bạn chắc chắn muốn xóa bản ghi?")) {
        $.ajax({
            type: "DELETE",
            url: "http://" + ipAddress + "/customer/deleteCustomer/" + idDelete,
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (data) {
                // xóa luôn ở phía client
                if (data.code == 301) {
                    // alert(data.message);
                    $.notify(data.message, {
                        position: "top center",
                        className: "error",
                    });
                } else if (data.code == 300) {
                    //   alert(data.message);
                    $.notify(data.message, {
                        position: "top center",
                        className: "success",
                    });
                    table.row($(button).parents("td").parents("tr")).remove().draw();
                }
            },
        });
    }
}

var rowIndexEdit, idEdit;
//sửa khách hàng
$("body").on("click", "#editRow", function () {
    var table = $("#dataTables-example").DataTable();
    if (!checkEmptyInput()) {
        var name = $("#name").val(),
            email = $("#email").val(),
            phone = $("#phone").val(),
            address = $("#address").val();
        var create_by_id_user = getCookie("idUser");
        // sửa ở phía server

        $.ajax({
            type: "POST",
            url: "http://" + ipAddress + "/customer/saveCustomer",
            contentType: "application/json",
            data: JSON.stringify({
                idCustomer: idEdit,
                name: name,
                email: email,
                phone: phone,
                address: address,
                createByIdUser: create_by_id_user,
                createTime: dateTime,
            }),
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (data) {
                if (data.code == 200) {
                    //  alert(data.message);
                    $.notify(data.message, {
                        position: "top center",
                        className: "success",
                    });
                    // sửa lại bảng
                    // sửa = ở phía client

                    table
                        .row(rowIndexEdit)
                        .data([idEdit, name, email, phone, address, btnAction])
                        .draw();
                    closeNav();
                } else {
                    //  alert(data.message);
                    $.notify(data.message, {
                        position: "top center",
                        className: "error",
                    });
                }
            },
        });
    }
});

// ---------------------------------------------------------------------------------------------------------------------
// các hàm phục vụ cho việc check dữ liệu, clear dữ liệu khi bật FormData,
// đóng mở form ,dán dữ liệu từ hàng vào form,................ ở đây nhé !
// ---------------------------------------------------------------------------------------------------------------------

// chuyển đến trang customerHistoryCare
function replaceToCustomerHistoryCare(button) {
    var table = $("#dataTables-example").DataTable();
    //lấy ra hàng
    var rowHistoryCare = table.row($(button).parents("td").parents("tr")).index();
    // lấy chỉ mục dòng
    //var rowNumber = row.rowIndex;
    // lấy giá trị trong cột 0:id
    idHistoryCare = table.row(rowHistoryCare).data()[0];

    createCookie("idCustomer", idHistoryCare, 30);
    window.location.assign("mycustomerhistorycare.html");
}

// load thông tin từ hàng vào form khi nhấn icon sửa (hình bút !)
function selectedRowToInput() {
    var table = document.getElementById("dataTables-example");
    for (var i = 1; i < table.rows.length; i++) {
        table.rows[i].onclick = function () {
            // get the seected row index
            document.getElementById("customer_id").value = this.cells[0].innerHTML;
            document.getElementById("name").value = this.cells[1].innerHTML;
            document.getElementById("email").value = this.cells[2].innerHTML;
            document.getElementById("phone").value = this.cells[3].innerHTML;
            document.getElementById("address").value = this.cells[4].innerHTML;
        };
    }
}

// clear data form khi bật nút add user !
function removedRowToInput() {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("address").value = "";
}
// check the empty input
function checkEmptyInput() {
    var isEmpty = false,
        name = document.getElementById("name").value,
        email = document.getElementById("email").value,
        phone = document.getElementById("phone").value,
        address = document.getElementById("address").value;
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
    document.getElementById("myForm").style.height = "60%";
    document.getElementById("overlay2").style.display = "block";
    // vô hiệu hóa nút sửa vì ta đang cần thêm !
    document.getElementById("editRow").style.display = "none";
    document.getElementById("addRow").style.display = "inline-block";
}

// hàm đóng form(dùng cho các nút X, thoát)
function closeNav() {
    document.getElementById("myForm").style.height = "0%";
    document.getElementById("overlay2").style.display = "none";

    document.getElementById("nameEmpty").innerHTML = "";
    document.getElementById("emailEmpty").innerHTML = "";
    document.getElementById("phoneEmpty").innerHTML = "";
    document.getElementById("addressEmpty").innerHTML = "";
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


    //lấy list Role
    $.ajax({
        url: "http://" + ipAddress + "/customer/getCustomerByIdForEdit/" + idEdit,
        method: "POST",
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
    }).done(function (data) {
        if (data.code == "101") {
            $.notify(data.message, {
                position: "top center",
                className: "error",
            });
            closeNav();
            table.row($(button).parents("td").parents("tr")).remove().draw();
        }
    });
}

function downloadExcel() {

    const a = document.createElement('a');
    var token = getCookie("token");
    url = "http://" + ipAddress + "/excel/download/customers/" + token;
    a.style.display = 'none';
    a.href = url;
    a.click();
    a.remove();
}