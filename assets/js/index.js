checkTokenWeb();
var dataIndex;
var today = new Date();
var nowMonth = today.getMonth();
var oldMistakeCount = [0, 0, 0, 0];
var oldScore = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var differentScore;
var differentMistakeCount;
$(document).ready(function () {
    var today = new Date();
    $(".currentMonth").append(today.getMonth() + 1);
    $(".currentYear").append(today.getFullYear());
    $(".lastMonth").append(today.getMonth());

    $.ajax({
        url: "http://" + ipAddress + "/chart/getDataForIndexChart",
        type: "POST",
        beforeSend: function (xhr) {
            var token = getCookie("token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
    }).done(function (data) {
        // $("#totalCustomerInCurrentMonth").append(data);
        console.log(data);
        dataIndex = data;
        countMistake();
        topEmployee();
    });

});


var today = new Date();
var nowMonth = today.getMonth();
var oldStatus = [0, 0, 0];
var oldSales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var differentSales;
var differentStatus;

function getCurrentMonth() {
    var d = new Date();
    var date = d.getDate();
    var month = date.getMonth() + 1;
}


setInterval(
    function ahih() {

        // số lượt chăm sóc khách hàng
        differentScore = false;
        for (var i = 0; i <= 11; i++) {
            if (oldScore[i] != dataIndex.countCustomerCare[i]) {
                differentScore = true;
                break;
            }
        }
        if (differentScore == true) {
            oldScore = dataIndex.countCustomerCare;
            document.getElementById("countCustomerCare").innerHTML = "<canvas class='chart' id='trafficflow'></canvas>";
            var ctx = document.getElementById("trafficflow");
            var myChart1 = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        backgroundColor: "rgba(48, 164, 255, 0.5)",
                        borderColor: "rgba(48, 164, 255, 0.8)",
                        data: dataIndex.countCustomerCare,
                        label: '',
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    title: {
                        display: false,
                        text: 'Chart'
                    },
                    legend: {
                        position: 'top',
                        display: false,
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Months'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: ''
                            }
                        }]
                    }
                }
            });
        }

        // thống kê điểm số cuộc gọi
        differentMistakeCount = false;
        for (var i = 0; i < oldMistakeCount.length; i++) {
            if (oldMistakeCount[i] != dataIndex.countScore[i]) {
                differentMistakeCount = true;
                break;
            }
        }
        if (differentMistakeCount == true) {
            oldMistakeCount = dataIndex.countScore;
            document.getElementById("thisIsPieChart").innerHTML = "<canvas class='chart' id='pieChart'></canvas>";
            var ctx = document.getElementById("pieChart");
            var pieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: dataIndex.countScoreName,
                    datasets: [{
                        backgroundColor: [
                            "#ffff00",
                            "#ff0000",
                            "#000066",
                            "#008000",
                        ],
                        data: dataIndex.countScore,
                    }]
                }
            });
            pieChart.draw();
        }


    }, 5000);

function countMistake() {
    // danh sách các lỗi hay mắc
    var str = "";
    for (var i = 1; i < dataIndex.mistakeName.length; i++) {
        str +=
            "<tr>" +
            "<td>" +
            i +
            "</td>" +
            "<td>" +
            " " +
            dataIndex.mistakeName[i] +
            "</td>" +
            "<td class='text-right'>" +
            dataIndex.countMistake[i] +
            "</td>" +
            "</tr>";
    }
    $("#productAmount").find("tbody").append(str);
}

function topEmployee(){
    // danh sach nhan vien diem cao
    // danh sách các lỗi hay mắc
    var str = "";
    for (var i = 0; i < dataIndex.scoreEmployee.length; i++) {
        str +=
            "<tr>" +
            "<td>" +
            i +
            "</td>" +
            "<td>" +
            " " +
            dataIndex.nameEmployee[i] +
            "</td>" +
            "<td class='text-right'>" +
            dataIndex.scoreEmployee[i] +
            "</td>" +
            "</tr>";
    }
    $("#topScoreEmployee").find("tbody").append(str);
}