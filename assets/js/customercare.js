checkTokenWeb();
// lấy ngày giờ hôm nay
var today = new Date();
var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date + " " + time;

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


// ---------------------------------------------------------------------------------------------------------------------
// các hàm phục vụ cho việc check dữ liệu, clear dữ liệu khi bật FormData,
// đóng mở form ,dán dữ liệu từ hàng vào form,................ ở đây nhé !
// ---------------------------------------------------------------------------------------------------------------------


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


// const constraints = {
//     video: true,
//   };

//   const video = document.querySelector("video");

//   navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
//     video.srcObject = stream;
//   });

function getUserMedia(constraints) {
    // if Promise-based API is available, use it
    if (navigator.mediaDevices) {
        return navigator.mediaDevices.getUserMedia(constraints);
    }

    // otherwise try falling back to old, possibly prefixed API...
    var legacyApi = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (legacyApi) {
        // ...and promisify it
        return new Promise(function (resolve, reject) {
            legacyApi.bind(navigator)(constraints, resolve, reject);
        });
    }
}

function getStream(type) {
    if (!navigator.mediaDevices && !navigator.getUserMedia && !navigator.webkitGetUserMedia &&
        !navigator.mozGetUserMedia && !navigator.msGetUserMedia) {
        alert('User Media API not supported.');
        return;
    }

    var constraints = {};
    constraints[type] = true;

    getUserMedia(constraints)
        .then(function (stream) {
            var mediaControl = document.querySelector(type);

            if ('srcObject' in mediaControl) {
                mediaControl.srcObject = stream;
            } else if (navigator.mozGetUserMedia) {
                mediaControl.mozSrcObject = stream;
            } else {
                mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
            }

            mediaControl.play();
        })
        .catch(function (err) {
            alert('Error: ' + err);
        });
}