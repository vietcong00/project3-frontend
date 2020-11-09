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
    } else if (pageActionList[i].page.urlPage == "mark.html") {
      pageName = "Chấm điểm";
      var str =
        "<li> <a href='" +
        pageActionList[i].page.urlPage +
        "'><i class='fas fa-marker'></i>" +
        pageName +
        "</a> </li>";
      $("#sidebar ul").append(str);
    } else if (pageActionList[i].page.urlPage == "score.html") {
      pageName = "Điểm đánh giá";
      var str =
        "<li> <a href='" +
        pageActionList[i].page.urlPage +
        "'><i class='fas fa-user-shield'></i> " +
        pageName +
        "</a> </li>";
      $("#sidebar ul").append(str);
    } else if (pageActionList[i].page.urlPage == "service.html") {
      pageName = "Dịch vụ";
      var str =
        "<li> <a href='" +
        pageActionList[i].page.urlPage +
        "'><i class='fas fa-book-open'></i> " +
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
