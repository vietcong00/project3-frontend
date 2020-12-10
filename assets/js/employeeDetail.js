checkTokenWeb();

var idEmployeeDetail = getCookie("idEmployeeDetail");
var nameEmployeeDetail = getCookie("nameEmployeeDetail");


var today = new Date();
var nowMonth = today.getMonth();
var oldMistakeCount = [0, 0, 0, 0];
var oldScore = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var differentScore;
var differentMistakeCount;

function getCurrentMonth() {
    var d = new Date();
    var date = d.getDate();
    var month = date.getMonth() + 1;
}

var today = new Date();
$(".currentMonth").append(today.getMonth() + 1);
$(".currentYear").append(today.getFullYear());
$(".lastMonth").append(today.getMonth());

document.getElementById("employeeName").innerHTML=nameEmployeeDetail;

setInterval(
    function ahih() {
        $.ajax({
            type: "POST",
            url: "http://" + ipAddress + "/chart/getDataForEmployeeChart/" + idEmployeeDetail,
            beforeSend: function (xhr) {
                var token = getCookie("token");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
        }).done(function (data) {
            // console.log(nowMonth);
            // console.table(data.score);
            differentScore = false;
            console.table(data.score);
            for (var i = 0; i <= 11; i++) {
                if (oldScore[i] != data.score[i]) {
                    differentScore = true;
                    break;
                }
                // revenue += data.score[i];
            }
            score = data.score[nowMonth];

            if (differentScore == true) {
                oldScore = data.score;
                document.getElementById("thisIsTrafficFlow").innerHTML = "<canvas class='chart' id='trafficflow'></canvas>";
                var ctx = document.getElementById("trafficflow");
                var myChart1 = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        datasets: [{
                            backgroundColor: "rgba(48, 164, 255, 0.5)",
                            borderColor: "rgba(48, 164, 255, 0.8)",
                            data: data.score,
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

            differentMistakeCount = false;
            for (var i = 0; i < oldMistakeCount.length; i++) {
                if (oldMistakeCount[i] != data.mistakeCount[i]) {
                    differentMistakeCount = true;
                    break;
                }
            }
            // totalTransaction = data.mistakeCount[0] + data.mistakeCount[1];
            document.getElementById("score").innerHTML = ": "+score;
            document.getElementById("rank").innerHTML = data.rank;
            document.getElementById("totalGoodJobInCurrentMonth").innerHTML = data.mistakeCount[0];
            document.getElementById("totalBadInCurrentMonth").innerHTML = data.bad;
            document.getElementById("numberHistoryCare").innerHTML = data.total;


            if (differentMistakeCount == true) {
                oldMistakeCount = data.mistakeCount;
                document.getElementById("thisIsPieChart").innerHTML = "<canvas class='chart' id='pieChart'></canvas>";
                var ctx = document.getElementById("pieChart");
                var pieChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: data.mistakeName,
                        datasets: [{
                            backgroundColor: [
                                "#ffff00",
                                "#ff0000",
                                "#000066",
                                "#008000",
                            ],
                            data: data.mistakeCount,
                        }]
                    }
                });
                pieChart.draw();
            }

        });

    }, 5000);