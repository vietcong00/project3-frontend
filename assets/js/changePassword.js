checkTokenWeb();
$(document).ready(function () {
    changePassword();
});

function changePassword() {
    $("#btnSave").click(function () {
        var newPassword = $("#newPassword").val();
        var confirm = $("#confirmPassword").val();
        if (newPassword != confirm) {
            alert("Confirm Error !!!");
        } else {
            var configPassword = {
                oldPassword: $("#oldPassword").val(),
                newPassword: $("#newPassword").val(),
            };
            console.table(configPassword);
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "http://" + ipAddress + "/user/changepassword",
                dataType: "json",
                data: JSON.stringify(configPassword),
                beforeSend: function (xhr) {
                    var token = getCookie("token");
                    xhr.setRequestHeader("Authorization", "Bearer " + token);
                },
                success: function (data) {
                    if (data.code == "000") {
                        $.notify("Đổi mật khẩu thành công ! Vui lòng đăng nhập lại !", {
                            position: "top center",
                            className: "success",
                        });
                        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                        document.cookie = "idUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                        document.cookie =
                            "pageActionList=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                        document.cookie =
                            "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                        location.replace("login.html");
                    } else {
                        $.notify(data.message, {
                            position: "top center",
                            className: "success",
                        });
                    }
                },
                error: function (e) { },
            });
        }
    });
}