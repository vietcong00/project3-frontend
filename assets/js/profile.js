checkTokenWeb();
$(document).ready(function () {
    //get all User except Admin
    $.ajax({
        type: "POST",
        url: "http://" + ipAddress + "/user/getUserProfile",
        dataType: "json",
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function (data) {
            if (data.code == "200") {
                document.getElementById("name").value = data.user.name;
                document.getElementById("email").value = data.user.email;
                document.getElementById("group").value = data.group.groupName;
                document.getElementById("type").value = data.user.type;
                document.getElementById("phone").value = data.user.phone;
                document.getElementById("address").value = data.user.address;
            }
        },
        error: function (error) { },
    });
});

function enable(id) {
    document.getElementById(id).disabled = false;
}

function checkEmptyInput() {
    var isEmpty = false,
        name = document.getElementById("name").value,
        phone = document.getElementById("phone").value,
        address = document.getElementById("address").value;
    // kiểm tra định dạng phone
    var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;

    if (name === "") {
        alert("Tên đang trống");
        isEmpty = true;
    } else if (phone === "") {
        alert("Số điện thoại trống");
        isEmpty = true;
    } else if (address === "") {
        alert("Địa chỉ đang trống");
        isEmpty = true;
    } else if (vnf_regex.test(phone) == false) {
        alert("Số điện thoại sai định dạng !");
        isEmpty = true;
    }
    return isEmpty;
}

function editUserProfile() {
    if (!checkEmptyInput())
        var user = {
            name: $("#name").val(),
            phone: $("#phone").val(),
            address: $("#address").val(),
        };
    $.ajax({
        type: "POST",
        url: "http://" + ipAddress + "/user/editUserProfile",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(user),
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function (data) {
            if (data.code == "200") {
                // alert(" update success");
                $.notify(" update success", {
                    position: "top center",
                    className: "success",
                });
            }
        },
        error: function (error) {
            console.log(error);
        },
    });
}