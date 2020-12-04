$(document).ready(function () {
  showandhide();
});

function showandhide() {
  var pageActionList = JSON.parse(getCookie("pageActionList"));
  var str =
    "<li> <a href='index.html'><i class='fas fa-home'></i> Trang chủ</a> </li>";
  $("#sidebar ul").append(str);
  for (var i = 0; i < pageActionList.length; i++) {
    if (pageActionList[i].page.urlPage == "employee.html") {
      pageName = "Nhân viên";
      var str =
        "<li> <a href='" +
        pageActionList[i].page.urlPage +
        "'><i class='fas fa-user'></i> " +
        pageName +
        "</a> </li>";
      $("#sidebar ul").append(str);
    } else if (pageActionList[i].page.urlPage == "customer.html") {
      pageName = "Khách hàng";
      var str =
        "<li> <a href='" +
        pageActionList[i].page.urlPage +
        "'><i class='fas fa-users'></i> " +
        pageName +
        "</a> </li>";
      $("#sidebar ul").append(str);
    } else if (pageActionList[i].page.urlPage == "record.html") {
      pageName = "Đánh giá cuộc gọi";
      var str =
        "<li> <a href='" +
        pageActionList[i].page.urlPage +
        "'><i class='fas fa-marker'></i>" +
        pageName +
        "</a> </li>";
      $("#sidebar ul").append(str);
    } else if (pageActionList[i].page.urlPage == "score.html") {
      pageName = "Thống kê điểm";
      var str =
        "<li> <a href='" +
        pageActionList[i].page.urlPage +
        "'><i class='fas fa-list-alt'></i>" +
        pageName +
        "</a> </li>";
      $("#sidebar ul").append(str);
    } else if (pageActionList[i].page.urlPage == "customercare.html") {
      pageName = "Chăm sóc khách hàng";
      var str =
        "<li> <a href='" +
        pageActionList[i].page.urlPage +
        "'><i class='fas fa-headset'></i>" +
        pageName +
        "</a> </li>";
      $("#sidebar ul").append(str);
    }else if (pageActionList[i].page.urlPage == "service.html") {
      pageName = "Dịch vụ";
      var str =
        "<li> <a href='" +
        pageActionList[i].page.urlPage +
        "'><i class='fas fa-sim-card'></i>" +
        pageName +
        "</a> </li>";
      $("#sidebar ul").append(str);
    } else if (pageActionList[i].page.urlPage == "promotion.html") {
      pageName = "Khuyến mãi";
      var str =
        "<li> <a href='" +
        pageActionList[i].page.urlPage +
        "'><i class='fas fa-file-invoice-dollar'></i>" +
        pageName +
        "</a> </li>";
      $("#sidebar ul").append(str);
    }
  }

  // var str = "<li> <a href='index.html'><i class='fas fa-home'></i> Trang chủ</a> </li>";
  // $("#sidebar ul").append(str);
}
