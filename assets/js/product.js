checkTokenWeb();
var editFlag = false;
var deleteFlag = false;
var addFlag = false;
var btnAction = "";

$(document).ready(function () {
    //get all product
    var pageActionList = JSON.parse(getCookie("pageActionList"));
    $.ajax({
        url: "http://" + ipAddress + "/product/getAllProduct",
        method: "GET",
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
    }).done(function (data) {
        var str = "";

        for (var i = 0; i < pageActionList.length; i++) {
            if (pageActionList[i].page.url == "products.html") {
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
        for (var i = 0; i < data.productList.length; i++) {
            str +=
                "<tr>" +
                "<td>" +
                data.productList[i].idProduct +
                "</td>" +
                "<td>" +
                data.productList[i].name +
                "</td>" +
                "<td>" +
                formatCurrency(data.productList[i].price, ",") +
                "</td>" +
                "<td>" +
                data.productList[i].description +
                "</td>" +
                "<td>";
            str += btnAction + "</td> </tr>";
        }

        $("#dataTables-example").find("tbody").append(str);
        $("#dataTables-example").DataTable();
    });
});

//thêm sửa xóa frontend ở đây , sau sẽ có RestAPI ajax thì thêm code vào phần success ở ajax

//thêm san pham
function addRow() {
    if (!checkEmptyInput()) {
        var name = $("#name").val(),
            price = $("#price").val(),
            description = $("#description").val();
        price = price.replaceAll(",", "");
        price = price.replaceAll(".", "");
        // thêm ở phía server
        $.ajax({
            type: "POST",
            url: "http://" + ipAddress + "/product/saveProduct",
            contentType: "application/json",
            data: JSON.stringify({
                name: name,
                price: price,
                description: description,
            }),
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (data) {
                if (data.code == 201) {
                    // alert(data.message);
                    $.notify(data.message, {
                        position: "top center",
                        className: "error",
                    });
                } else if (data.code == 200) {
                    //alert(data.message);
                    $.notify(data.message, {
                        position: "top center",
                        className: "success",
                    });
                    // thêm ở phía client
                    var table = $("#dataTables-example").DataTable();
                    table.row
                        .add([
                            data.product.idProduct,
                            name,
                            formatCurrency(price),
                            description,
                            btnAction,
                        ])
                        .draw(false);
                    closeNav();
                }
            },
        });
    }
}

// xóa san pham khi nhấn button xóa (onclick)
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
            url: "http://" + ipAddress + "/product/deleteProduct/" + idDelete,
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (data) {
                // xóa luôn ở phía client
                if (data.code == 301) {
                    //  alert(data.message);
                    $.notify(data.message, {
                        position: "top center",
                        className: "error",
                    });
                } else if (data.code == 300) {
                    //  alert(data.message);
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
//sửa san pham
function editRow() {
    if (!checkEmptyInput()) {
        var name = $("#name").val(),
            price = $("#price").val(),
            description = $("#description").val();

        // sửa ở phía server
        $.ajax({
            type: "POST",
            url: "http://" + ipAddress + "/product/saveProduct",
            contentType: "application/json",
            data: JSON.stringify({
                idProduct: idEdit,
                name: name,
                price: price,
                description: description,
            }),
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (data) {
                if (data.code == 204) {
                    // alert(data.message);
                    $.notify(data.message, {
                        position: "top center",
                        className: "success",
                    });
                    // sửa lại bảng
                    // sửa = ở phía client
                    var table = $("#dataTables-example").DataTable();
                    table
                        .row(rowIndexEdit)
                        .data([idEdit, name, formatCurrency(price), description, btnAction])
                        .draw();
                    closeNav();
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
            document.getElementById("product_id").value = this.cells[0].innerHTML;
            document.getElementById("name").value = this.cells[1].innerHTML;
            document.getElementById("price").value = formatStringToCurrency(
                this.cells[2].innerHTML
            );
            document.getElementById("description").value = this.cells[3].innerHTML;
        };
    }
}

// clear data form khi bật nút add user !
function removedRowToInput() {
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("description").value = "";
}
// check the empty input
function checkEmptyInput() {
    var isEmpty = false,
        name = document.getElementById("name").value,
        price = document.getElementById("price").value,
        description = document.getElementById("description").value;
    if (name === "") {
        document.getElementById("nameEmpty").innerHTML = "*Chưa nhập tên !";
        isEmpty = true;
    } else {
        document.getElementById("nameEmpty").innerHTML = "";
    }
    if (price === "") {
        document.getElementById("priceEmpty").innerHTML = "*Chưa nhập giá !";
        isEmpty = true;
    } else {
        document.getElementById("priceEmpty").innerHTML = "";
    }
    if (description === "") {
        document.getElementById("descriptionEmpty").innerHTML =
            "*Chưa nhập mô tả !";
        isEmpty = true;
    } else {
        document.getElementById("descriptionEmpty").innerHTML = "";
    }
    var number = /(([0-9])\b)/g;
    if (number.test(price) == false) {
        document.getElementById("priceEmpty").innerHTML =
            "*Số tiền sai định dạng !";
        isEmpty = true;
    } else {
        document.getElementById("priceEmpty").innerHTML = "";
    }
    return isEmpty;
}

// hàm mở form
function openNav() {
    //hàm xóa sạch thông tin khi mở form thêm mới !
    removedRowToInput();
    document.getElementById("myForm").style.height = "80%";
    document.getElementById("overlay2").style.display = "block";
    // vô hiệu hóa nút sửa vì ta đang cần thêm !
    document.getElementById("editRow").style.display = "none";
    document.getElementById("addRow").style.display = "inline-block";
    document.getElementById("name").disabled = false;
}

// hàm đóng form(dùng cho các nút X, thoát)
function closeNav() {
    document.getElementById("myForm").style.height = "0%";
    document.getElementById("overlay2").style.display = "none";

    document.getElementById("nameEmpty").innerHTML = "";
    document.getElementById("priceEmpty").innerHTML = "";
    document.getElementById("descriptionEmpty").innerHTML = "";
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

    document.getElementById("name").disabled = true;
    //lấy list Role
    $.ajax({
        url: "http://" + ipAddress + "/product/getProductByIdForEdit/" + idEdit,
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
    document.getElementById("name").disabled = true;
}

function downloadExcel() {

    const a = document.createElement('a');
    var token = getCookie("token");
    url = "http://" + ipAddress + "/excel/download/products/" + token;
    a.style.display = 'none';
    a.href = url;
    a.click();
    a.remove();
}