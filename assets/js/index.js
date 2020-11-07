checkTokenWeb();
$(document).ready(function () {
    var today = new Date();
    $(".currentMonth").append(today.getMonth() + 1);
    $(".currentYear").append(today.getFullYear());
    $(".lastMonth").append(today.getMonth());
    $.ajax({
        url: "http://" + ipAddress + "/customer/getTotalHistoryCareInCurrentMonth",
        method: "GET",
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
    }).done(function (data) {
        $("#numberHistoryCare").append(data);
    });
    $.ajax({
        url: "http://" + ipAddress + "/customer/getTotalCustomerInCurrentMonth",
        method: "GET",
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
    }).done(function (data) {

        $("#totalCustomerInCurrentMonth").append(data);
    });

    getUsersWithMostRevenueLastMonth();
    getProductWithAmountLastMonth();
});

function getUsersWithMostRevenueLastMonth() {
    $.ajax({
        type: "GET",
        url: "http://" + ipAddress + "/user/getUsersWithMostRevenueLastMonth",
        dataType: "json",
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function (data) {
            console.log(data);
            if (data.code == "200") {
                console.log(data.personalRevenueList.length);

                for (var i = 0; i < data.personalRevenueList.length; i++) {
                    var str =
                        "<tr>" +
                        "<td>" +
                        "<i class=''></i>" +
                        data.personalRevenueList[i].user.name +
                        "</td>" +
                        "<td class='text-right'>" +
                        formatCurrency(data.personalRevenueList[i].revenue) +
                        " vnđ" +
                        "</td></tr>";

                    $("#revenueByUser").append(str);
                }
            }
        },
        error: function (error) {
            console.log(error);
        },
    });
}

function getProductWithAmountLastMonth() {
    $.ajax({
        url: "http://" + ipAddress + "/index/productSoldTheMost",
        method: "GET",
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
    }).done(function (data) {
        console.log(data);
        var str = "";
        for (var i = 0; i < data.productAmounts.length; i++) {
            str +=
                "<tr>" +
                "<td><i class='fas fa-book-open'></i>" +
                " " +
                data.productAmounts[i].product.name +
                "</td>" +
                "<td class='text-right'>" +
                data.productAmounts[i].amount +
                "</td>" +
                "</tr>";
        }
        $("#productAmount").find("tbody").append(str);
    });
}