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
        $.ajax({
            url: "http://" + ipAddress + "/index/getDataForChart",
            method: "GET",
            datatype: 'json',
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
        }).done(function (data) {
            // console.log(nowMonth);
            // console.table(data.sales);
            differentSales = false;
            revenue = 0;
            // console.table(data.sales);
            for (var i = 0; i <= 11; i++) {
                if (oldSales[i] != data.sales[i]) {
                    differentSales = true;
                    break;
                }
                // revenue += data.sales[i];
            }
            revenue = data.sales[nowMonth];
            document.getElementById("revenue").innerHTML = formatCurrencyVietNam(revenue);

            if (differentSales == true) {
                oldSales = data.sales;
                document.getElementById("thisIsTrafficFlow").innerHTML = "<canvas class='chart' id='trafficflow'></canvas>";
                var ctx = document.getElementById("trafficflow");
                var myChart1 = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        datasets: [{
                            backgroundColor: "rgba(48, 164, 255, 0.5)",
                            borderColor: "rgba(48, 164, 255, 0.8)",
                            data: data.sales,
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

            differentStatus = false;
            for (var i = 0; i < oldStatus.length; i++) {
                if (oldStatus[i] != data.status[i]) {
                    differentStatus = true;
                    break;
                }
            }
            totalTransaction = data.status[0] + data.status[1];
            document.getElementById("totalTransaction").innerHTML = totalTransaction;
            if (differentStatus == true) {
                oldStatus = data.status;
                document.getElementById("thisIsPieChart").innerHTML = "<canvas class='chart' id='pieChart'></canvas>";
                var ctx = document.getElementById("pieChart");
                var pieChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: ["Đã thanh toán", "Chờ thanh toán", "Đã hủy",],
                        datasets: [{
                            backgroundColor: [
                                "#2ecc71",
                                "#3498db",
                                "#e74c3c",
                            ],
                            data: data.status,
                        }]
                    }
                });
                pieChart.draw();
            }

        });

    }, 1000);