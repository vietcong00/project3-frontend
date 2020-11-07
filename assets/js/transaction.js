checkTokenWeb();
var editFlag = false;
var addFlag = false;
var openRightFlag = true;
var dataDeal;
var rowIndexEdit, idEdit;
var dealInfor, dealInforIndex;

$(document).ready(function () {
    var pageActionList = JSON.parse(getCookie("pageActionList"));
    // lấy toàn bộ transaction
    $.ajax({
        url: "http://" + ipAddress + "/transaction/getAllTransaction",
        method: "GET",
        datatype: "json",
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
    }).done(function (data) {
        dataDeal = data;
        // console.log(dataDeal.transactionWebList[0].transaction);
        for (var i = 0; i < pageActionList.length; i++) {
            if (pageActionList[i].page.url == "transaction.html") {
                for (var j = 0; j < pageActionList[i].actionList.length; j++) {
                    if (pageActionList[i].actionList[j].name == "add") {
                        addFlag = true;
                    }
                    if (pageActionList[i].actionList[j].name == "edit") {
                        editFlag = true;
                    }
                }
            }
        }
        if (!editFlag) {
            $("#btnEdit").hide();
        }
        if (!addFlag) {
            $("#btnAdd").hide();
        }

        var str = "";
        console.log(data);
        for (var i = 0; i < data.transactionWebList.length; i++) {
            str +=
                "<tr>" +
                "<td>" +
                data.transactionWebList[i].transaction.idDeal +
                "</td>" +
                "<td>" +
                data.transactionWebList[i].customer.name +
                "</td>" +
                "<td>" +
                data.transactionWebList[i].userName +
                "</td>" +
                "<td>" +
                data.transactionWebList[i].product.name +
                "</td>" +
                "<td>" +
                formatDate(data.transactionWebList[i].transaction.transactionTime) +
                "</td>" +
                "<td>" +
                changeColor(data.transactionWebList[i].transaction.status) +
                "</td>" +
                // "<td>" +
                // "<button id='deletebtn'  class='btn btn-outline-danger btn-rounded'" +
                // "onclick='removeRow(this);'><i class='fas fa-trash'></i></button>" +
                // "</td>" +
                "</tr>";
        }
        $("#dataTables-example").find("tbody").append(str);
        show_hide_table("hide");
        show_hide_table("show");
        openForm();
        $("#dataTables-example").DataTable();
        // get CustomerList to FromRight
        var str = "",
            strFormRight = "";
        for (var i = 0; i < data.customerList.length; i++) {
            str +=
                "<option value='" +
                data.customerList[i].idCustomer +
                "'>" +
                data.customerList[i].name +
                "- SĐT: " +
                data.customerList[i].phone +
                "- Địa chỉ: " +
                data.customerList[i].address +
                "</option>";
        }
        $("#id_customer").append(str);
        // get productList to myFrom
        str = "";
        for (var i = 0; i < data.productList.length; i++) {
            str +=
                "<option value='" +
                data.productList[i].idProduct +
                "'>" +
                data.productList[i].name +
                "</option>";
        }

        $("#id_product").append(str);
    });
});

function changeStatus() {
    var status = document.getElementById("trangthai").value;
    if (status == "Đã thanh toán") {
        document.getElementById("trangthai").style.color = "green";
    }
    if (status == "Đang thanh toán") {
        document.getElementById("trangthai").style.color = "blue";
    }
    if (status == "Đã hủy") {
        document.getElementById("trangthai").style.color = "red";
    }
}

function openForm() {
    $("#dataTables-example tbody").on("click", "tr", function () {
        var table = $("#dataTables-example").DataTable();
        //lấy ra hàng
        rowIndexEdit = table.row($(this)).index();
        var row0 = table.row(rowIndexEdit);

        idEdit = table.row(rowIndexEdit).data()[0];
        $.ajax({
            url: "http://" + ipAddress + "/transaction/getTransactionByIdForEdit/" + idEdit,
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
                row0.remove().draw();
                $("#dataTables-example").DataTable();
                // table.row(rowIndexEdit).remove().draw();
            } else if (data.code == "102") {
                console.log(rowIndexEdit);
                if (openRightFlag == true) {
                    document.getElementById("sidebar-right").style.width = "55%";
                    document.getElementById("sidebar-left").style.margin = "0% 1% 0% 0%";
                    document.getElementById("sidebar-right").style.display = "block";
                    document.getElementById("sidebar-left").style.width = "44%";
                    document.getElementById("sidebar-left").style.transition = "0.3s";

                    var table = $("#dataTables-example").DataTable();
                    // rowIndexEdit = table.row($(this)).index();
                    // idEdit = table.row(rowIndexEdit).data()[0];
                    // console.log(row);
                    for (var i = 0; i < dataDeal.transactionWebList.length; i++) {
                        if (idEdit == dataDeal.transactionWebList[i].transaction.idDeal) {
                            dealInfor = dataDeal.transactionWebList[i];
                            console.log(dataDeal.transactionWebList[i]);
                            dealInforIndex = i;
                            break;
                        }
                    }
                    // ẩn cột

                    show_hide_table("hide");
                    console.log(dealInfor);
                    document.getElementById("magiaodich").value =
                        dealInfor.transaction.idDeal;
                    document.getElementById("thoigiangiaodich").value = formatDate(
                        dealInfor.transaction.transactionTime
                    );
                    document.getElementById("trangthai").value = dealInfor.transaction.status;
                    document.getElementById("khachhang").value =
                        dealInfor.customer.name + " - " + dealInfor.customer.phone;
                    document.getElementById("diachi").value = dealInfor.customer.address;
                    document.getElementById("nhanvienchamsoc").value =
                        dealInfor.userName + " - " + dealInfor.userEmail;
                    document.getElementById("ghichu").innerHTML = dealInfor.transaction.note;
                    document.getElementById("sanpham").innerHTML = dealInfor.product.name;
                    document.getElementById("motasanpham").innerHTML =
                        dealInfor.product.description;
                    document.getElementById("giatien").innerHTML =
                        formatCurrency(dealInfor.product.price) + "VNĐ";

                    // lấy màu cho trạng thái
                    getColorStatus(document.getElementById("trangthai").value);
                    // disable các trường không đc sửa !
                    document.getElementById("magiaodich").disabled = "true";
                    document.getElementById("thoigiangiaodich").disabled = "true";
                    document.getElementById("diachi").disabled = "true";
                    document.getElementById("khachhang").disabled = "true";
                    document.getElementById("nhanvienchamsoc").disabled = "true";
                }
            }
        });
        openRightFlag = true;
    });
}

function closeForm() {
    document.getElementById("sidebar-right").style.width = "0%";
    document.getElementById("sidebar-right").style.display = "none";
    document.getElementById("sidebar-left").style.width = "100%";
    document.getElementById("sidebar-left").style.transition = "0.5s";

    // hiện lại cột
    show_hide_table("show");
}

//thêm sửa xóa frontend ở đây , sau sẽ có RestAPI ajax thì thêm code vào phần success ở ajax
//thêm giao dich
function addRow() {
    if (!checkEmptyInput()) {
        var id_customer = $("#id_customer").val(),
            id_user = $("#id_user").val(),
            id_product = $("#id_product").val(),
            status = $("#status").val();
        note = $("#note").val();
        var create_by_id_user = getCookie("idUser");
        // thêm ở phía server
        // thêm ở phía server
        $.ajax({
            type: "POST",
            url: "http://" + ipAddress + "/transaction/saveTransaction",
            contentType: "application/json",
            data: JSON.stringify({
                idCustomer: id_customer,
                idUser: id_user,
                idProduct: id_product,
                status: status,
                note: note,
            }),
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (data) {
                //alert(data.message);
                if (data.code == 200) {
                    $.notify(data.message, {
                        position: "top center",
                        className: "success",
                    });
                    // thêm ở phía client
                    var table = $("#dataTables-example").DataTable();

                    var customer, user, product;
                    for (var i = 0; i < dataDeal.customerList.length; i++) {
                        if (id_customer == dataDeal.customerList[i].idCustomer) {
                            customer = dataDeal.customerList[i];
                            break;
                        }
                    }

                    // var userName;
                    for (var i = 0; i < dataDeal.userList.length; i++) {
                        if (id_user == dataDeal.userList[i].idUser) {
                            user = dataDeal.userList[i];
                            break;
                        }
                    }

                    // var productName;
                    for (var i = 0; i < dataDeal.productList.length; i++) {
                        if (id_product == dataDeal.productList[i].idProduct) {
                            product = dataDeal.productList[i];
                            break;
                        }
                    }
                    console.log(data);

                    table.row
                        .add([
                            data.transactionWeb.transaction.idDeal,
                            customer.name,
                            user.name,
                            product.name,
                            getDateTimeNow(),
                            changeColor(status),
                            // " <button class='btn btn-outline-danger btn-rounded'" +
                            // "onclick='removeRow(this);'><i class='fas fa-trash'></i></button>"
                        ])
                        .draw(false);
                    dataDeal.transactionWebList.push(data.transactionWeb);
                    openForm();
                    $("#dataTables-example").DataTable();
                    closeNav();
                    closeForm();
                }
            },
        });
    }
}

//sửa giao dịch
function editRow() {
    //    magiaodich,trangthai,khachhang,nhanvienchamsoc,ghichu,sanpham
    var id_deal = $("#magiaodich").val(),
        note = $("#ghichu").val(),
        status = $("#trangthai").val();
    $.ajax({
        type: "POST",
        url: "http://" + ipAddress + "/transaction/saveTransaction",
        contentType: "application/json",
        data: JSON.stringify({
            idDeal: id_deal,
            status: status,
            note: note,
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

            console.log(dataDeal);

            // console.log(customer);
            var table = $("#dataTables-example").DataTable();
            table
                .row(rowIndexEdit)
                .data([
                    idEdit,
                    dealInfor.customer.name,
                    dealInfor.userName,
                    dealInfor.product.name,
                    getDateTimeNow(),
                    changeColor(status),
                    // " <button class='btn btn-outline-danger btn-rounded'" +
                    // "onclick='removeRow(this);'><i class='fas fa-trash'></i></button>"
                ])
                .draw();
            dataDeal.transactionWebList[dealInforIndex].transaction.status = status;
            dataDeal.transactionWebList[dealInforIndex].transaction.note = note;
            show_hide_table("show");
            closeForm();
            // changeColor(status);
        },
    });
}

function changeColor(status) {
    var statusString = "";
    if (status == "Đã thanh toán") {
        statusString = "<p  style='color:green' class='status'>" + status + "</p>";
    } else if (status == "Đang thanh toán") {
        statusString = "<p  style='color:blue' class='status'>" + status + "</p>";
    } else if (status == "Đã hủy") {
        statusString = "<p style='color:red' class='status'>" + status + "</p>";
    } else if (status == null) {
        statusString = "<p>" + status + "</p>";
    }
    return statusString;
}

// xóa giao dịch khi nhấn button xóa (onclick)
function removeRow(button) {
    openRightFlag = false;

    var table = $("#dataTables-example").DataTable();
    //lấy ra hàng
    var rowDelete = table.row($(button).parents("td").parents("tr")).index();
    // lấy chỉ mục dòng
    //var rowNumber = row.rowIndex;
    // lấy giá trị trong cột 0:id
    idDelete = table.row(rowDelete).data()[0];
    console.log("chỉ mục hàng = " + rowDelete);
    console.log("chỉ mục cột id = " + idDelete);

    if (confirm("Bạn có chắc muốn xóa giao dịch này không ?")) {
        // xóa luôn quyền ở phía server !
        $.ajax({
            type: "DELETE",
            url: "http://" + ipAddress + "/transaction/deleteTransaction/" + idDelete,
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (data) {
                // xóa luôn Quyền ở phía client
                //  alert(data.message);
                if (data.code == "000") {
                    $.notify(data.message, {
                        position: "top center",
                        className: "success",
                    });
                    table.row($(button).parents("td").parents("tr")).remove().draw();
                    closeForm();
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
            document.getElementById("id_deal").value = this.cells[0].innerHTML;
            document.getElementById("id_customer").value = this.cells[1].innerHTML;
            document.getElementById("id_user").value = this.cells[2].innerHTML;
            document.getElementById("id_product").value = this.cells[3].innerHTML;
            document.getElementById("status").value = this.cells[4].innerHTML;
        };
    }
}

// clear data form khi bật nút add user !
function removedRowToInput() {
    document.getElementById("id_customer").value = "";
    document.getElementById("id_user").value = "";
    document.getElementById("id_product").value = "";
    document.getElementById("status").value = "";
    document.getElementById("note").value = "";
}
// check the empty input
function checkEmptyInput() {
    var isEmpty = false,
        id_customer = document.getElementById("id_customer").value,
        id_user = document.getElementById("id_user").value,
        id_product = document.getElementById("id_product").value,
        transaction_time = document.getElementById("status").value;

    if (id_customer === "") {
        document.getElementById("id_customerEmpty").innerHTML =
            "*Chưa nhập Khách hàng !";
        isEmpty = true;
    } else {
        document.getElementById("id_customerEmpty").innerHTML = "";
    }
    if (id_user === "") {
        document.getElementById("id_userEmpty").innerHTML =
            "*Chưa nhập nhân viên !";
        isEmpty = true;
    } else {
        document.getElementById("id_userEmpty").innerHTML = "";
    }
    if (id_product === "") {
        document.getElementById("id_productEmpty").innerHTML =
            "*Chưa nhập sản phẩm !";
        isEmpty = true;
    } else {
        document.getElementById("id_productEmpty").innerHTML = "";
    }
    if (transaction_time === "") {
        document.getElementById("statusEmpty").innerHTML = "*Chưa nhập thời gian !";
        isEmpty = true;
    } else {
        document.getElementById("statusEmpty").innerHTML = "";
    }
    return isEmpty;
}

// hàm mở form
function openNav() {
    //hàm xóa sạch thông tin khi mở form thêm mới !
    removedRowToInput();
    document.getElementById("myForm").style.height = "75%";
    document.getElementById("overlay2").style.display = "block";
    // vô hiệu hóa nút sửa vì ta đang cần thêm !
    document.getElementById("id_user").value = getCookie("idUser");
    document.getElementById("id_user").disabled = true;
}

// hàm đóng form(dùng cho các nút X, thoát)
function closeNav() {
    document.getElementById("myForm").style.height = "0%";
    document.getElementById("overlay2").style.display = "none";
    document.getElementById("id_customerEmpty").innerHTML = "";
    document.getElementById("id_userEmpty").innerHTML = "";
    document.getElementById("id_productEmpty").innerHTML = "";
    document.getElementById("statusEmpty").innerHTML = "";
}

function show_hide_table(data) {
    if (data == "hide") {
        // ẩn cột time
        $("td:nth-child(4)").hide();
        $("th:nth-child(4)").hide();
        // ẩn cột trạng thái
        $("td:nth-child(5)").hide();
        $("th:nth-child(5)").hide();
        // ẩn cột sản phẩm
        $("td:nth-child(6)").hide();
        $("th:nth-child(6)").hide();
        // ẩn cột hành động
        $("td:nth-child(7)").hide();
        $("th:nth-child(7)").hide();

        $("#dataTables-example_paginate").click(function () {
            // ẩn cột time
            $("td:nth-child(4)").hide();
            $("th:nth-child(4)").hide();
            // ẩn cột trạng thái
            $("td:nth-child(5)").hide();
            $("th:nth-child(5)").hide();
            // ẩn cột sản phẩm
            $("td:nth-child(6)").hide();
            $("th:nth-child(6)").hide();
            // ẩn cột hành động
            $("td:nth-child(7)").hide();
            $("th:nth-child(7)").hide();
        });
    } else if (data == "show") {
        // show cột time
        $("td:nth-child(4)").show();
        $("th:nth-child(4)").show();
        // show cột trạng thái
        $("td:nth-child(5)").show();
        $("th:nth-child(5)").show();
        // show cột sản phẩm
        $("td:nth-child(6)").show();
        $("th:nth-child(6)").show();
        // show cột hành động
        $("td:nth-child(7)").show();
        $("th:nth-child(7)").show();

        $("#dataTables-example_paginate").click(function () {
            // show cột time
            $("td:nth-child(4)").show();
            $("th:nth-child(4)").show();
            // show cột trạng thái
            $("td:nth-child(5)").show();
            $("th:nth-child(5)").show();
            // show cột sản phẩm
            $("td:nth-child(6)").show();
            $("th:nth-child(6)").show();
            // show cột hành động
            $("td:nth-child(7)").show();
            $("th:nth-child(7)").show();
        });
    }
}

function getColorStatus(data) {
    if (data == "Đang thanh toán") {
        document.getElementById("trangthai").style.color = "#0000FF";
    } else if (data == "Đã thanh toán") {
        document.getElementById("trangthai").style.color = "#5fbf00";
    } else {
        document.getElementById("trangthai").style.color = "red";
    }
}

function downloadExcel() {

    const a = document.createElement('a');
    var token = getCookie("token");
    url = "http://" + ipAddress + "/excel/download/transections/" + token;
    a.style.display = 'none';
    a.href = url;
    a.click();
    a.remove();
}