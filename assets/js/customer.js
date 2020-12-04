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

var btnDetail =
    "<button class='btn btn-outline-success btn-rounded mr-1' " +
    " onclick='replaceToCustomerDetail(this);'><i class='fas fa-info-circle'></i></button>";

if (editFlag) {
    btnAction +=
        "<button class='btn btn-outline-info btn-rounded'" +
        " onclick='openNavToEdit(this);'><i class='fas fa-pen'></i></button>";
}
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
            if (pageActionList[i].page.urlPage == "customer.html") {
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
        btnAction += btnDetail;
        for (var i = 0; i < data.customerList.length; i++) {
            str +=
                "<tr>" +
                "<td>" +
                data.customerList[i].idCustomer +
                "</td>" +
                "<td>" +
                data.customerList[i].nameCustomer +
                "</td>" +
                "<td>" +
                data.customerList[i].phoneCustomer +
                "</td>" +
                "<td>" +
                data.customerList[i].addressCustomer +
                "</td>" +
                "<td>" +
                changeColor(data.customerList[i].statusCustomer) +
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
            birthday = $("#birthday").val(),
            phone = $("#phone").val(),
            peopleId = $("#peopleId").val(),
            dateRange = $("#dateRange").val(),
            isUsedBy = $("#isUsedBy").val(),
            address = $("#address").val(),
            nationality = $("#nationality").val(),
            activationDate = $("#activationDate").val(),
            activationPlace = $("#activationPlace").val(),
            note = $("#note").val(),
            status = $("#status").val();
        // thêm ở phía server
        $.ajax({
            type: "POST",
            url: "http://" + ipAddress + "/customer/saveCustomer",
            contentType: "application/json",
            data: JSON.stringify({
                nameCustomer: name,
                dateofbirthCustomer: birthday,
                phoneCustomer: phone,
                peopleidCustomer: peopleId,
                daterangeCustomer: dateRange,
                issuedbyCustomer: isUsedBy,
                addressCustomer: address,
                nationalityCustomer: nationality,
                activationdateCustomer: activationDate,
                activationplaceCustomer: activationPlace,
                noteCustomer: note,
                statusCustomer: status,
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
                            phone,
                            address,
                            status,
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
            birthday = $("#birthday").val(),
            phone = $("#phone").val(),
            peopleId = $("#peopleId").val(),
            dateRange = $("#dateRange").val(),
            isUsedBy = $("#isUsedBy").val(),
            address = $("#address").val(),
            nationality = $("#nationality").val(),
            activationDate = $("#activationDate").val(),
            activationPlace = $("#activationPlace").val(),
            note = $("#note").val(),
            status = $("#status").val();
        // sửa ở phía server
        console.log(phone);
        $.ajax({
            type: "POST",
            url: "http://" + ipAddress + "/customer/saveCustomer",
            contentType: "application/json",
            data: JSON.stringify({
                idCustomer: idEdit,
                nameCustomer: name,
                dateofbirthCustomer: birthday,
                phoneCustomer: phone,
                peopleidCustomer: peopleId,
                daterangeCustomer: dateRange,
                issuedbyCustomer: isUsedBy,
                addressCustomer: address,
                nationalityCustomer: nationality,
                activationdateCustomer: activationDate,
                activationplaceCustomer: activationPlace,
                noteCustomer: note,
                statusCustomer: status,
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
                        .data([idEdit, name, phone, address, status, btnAction])
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

// chuyển đến trang customerDetail
function replaceToCustomerDetail(button) {
    var table = $("#dataTables-example").DataTable();
    //lấy ra hàng
    var rowHistoryCare = table.row($(button).parents("td").parents("tr")).index();
    // lấy chỉ mục dòng
    //var rowNumber = row.rowIndex;
    // lấy giá trị trong cột 0:id
    idHistoryCare = table.row(rowHistoryCare).data()[0];

    createCookie("idCustomer", idHistoryCare, 30);
    window.location.assign("customerDetail.html");
}

// load thông tin từ hàng vào form khi nhấn icon sửa (hình bút !)
function selectedRowToInput() {
    var table = document.getElementById("dataTables-example");
    for (var i = 1; i < table.rows.length; i++) {
        table.rows[i].onclick = function () {
            // get the seected row index
            document.getElementById("customer_id").value = this.cells[0].innerHTML;
            document.getElementById("name").value = this.cells[1].innerHTML;
            document.getElementById("birthday").value = this.cells[2].innerHTML;
            document.getElementById("phone").value = this.cells[3].innerHTML;
            document.getElementById("peopleId").value = this.cells[4].innerHTML;
            document.getElementById("dateRange").value = this.cells[5].innerHTML;
            document.getElementById("isUsedBy").value = this.cells[6].innerHTML;
            document.getElementById("address").value = this.cells[7].innerHTML;
            document.getElementById("nationality").value = this.cells[8].innerHTML;
            document.getElementById("activationDate").value =this.cells[9].innerHTML;
            document.getElementById("activationPlace").value = this.cells[10].innerHTML;
            document.getElementById("note").value = this.cells[11].innerHTML;
            document.getElementById("status").value = this.cells[12].innerHTML;
        };
    }
}

// clear data form khi bật nút add user !
function removedRowToInput() {
    document.getElementById("name").value = "";
    document.getElementById("birthday").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("peopleId").value = "";
    document.getElementById("dateRange").value = "";
    document.getElementById("isUsedBy").value = "";
    document.getElementById("address").value = "";
    document.getElementById("nationality").value = "";
    document.getElementById("activationDate").value = "";
    document.getElementById("activationPlace").value = "";
    document.getElementById("note").value = "";
    document.getElementById("status").value = "";

}
// check the empty input
function checkEmptyInput() {
    var isEmpty = false,
        name = document.getElementById("name").value,
        phone = document.getElementById("phone").value,
        address = document.getElementById("address").value;
    if (name === "") {
        document.getElementById("nameEmpty").innerHTML = "*Chưa nhập tên !";
        isEmpty = true;
    } else {
        document.getElementById("nameEmpty").innerHTML = "";
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

    return isEmpty;
}

// hàm mở form
function openNav() {
    //hàm xóa sạch thông tin khi mở form thêm mới !
    removedRowToInput();
    document.getElementById("myForm").style.height = "92%";
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