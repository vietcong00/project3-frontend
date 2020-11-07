$(document).ready(function () {
  showandhide();
});

function showandhide() {
  var pageActionList = JSON.parse(getCookie("pageActionList"));
  var str =
    "<li> <a href='index.html'><i class='fas fa-home'></i> Trang chủ</a> </li>";
  $("#sidebar ul").append(str);
  for (var i = 0; i < pageActionList.length; i++) {
    if (pageActionList[i].page.url == "users.html") {
      pageName = "Nhân viên";
      var str =
        "<li> <a href='" +
        pageActionList[i].page.url +
        "'><i class='fas fa-user'></i> " +
        pageName +
        "</a> </li>";
      $("#sidebar ul").append(str);
    } else if (pageActionList[i].page.url == "group.html") {
      pageName = "Nhóm của tôi";
      var str =
        "<li> <a href='" +
        pageActionList[i].page.url +
        "'><i class='fas fa-user-friends'></i> " +
        pageName +
        "</a> </li>";
      $("#sidebar ul").append(str);
    } else if (pageActionList[i].page.url == "customer.html") {
      pageName = "Khách hàng";
      var str =
        "<li> <a href='" +
        pageActionList[i].page.url +
        "'><i class='fas fa-users'></i> " +
        pageName +
        "</a> </li>";
      $("#sidebar ul").append(str);
    } else if (pageActionList[i].page.url == "settings.html") {
      pageName = "Cài đặt";
      var str =
        "<li> <a href='" +
        pageActionList[i].page.url +
        "'><i class='fas fa-cogs'></i>" +
        pageName +
        "</a> </li>";
      $("#sidebar ul").append(str);
    } else if (pageActionList[i].page.url == "roles.html") {
      pageName = "Quản lý vai trò";
      var str =
        "<li> <a href='" +
        pageActionList[i].page.url +
        "'><i class='fas fa-user-shield'></i> " +
        pageName +
        "</a> </li>";
      $("#sidebar ul").append(str);
    } else if (pageActionList[i].page.url == "products.html") {
      pageName = "Quản lý sản phẩm";
      var str =
        "<li> <a href='" +
        pageActionList[i].page.url +
        "'><i class='fas fa-book-open'></i> " +
        pageName +
        "</a> </li>";
      $("#sidebar ul").append(str);
    } else if (pageActionList[i].page.url == "transaction.html") {
      pageName = "Quản lý giao dịch";
      var str =
        "<li> <a href='" +
        pageActionList[i].page.url +
        "'><i class='fas fa-file-invoice-dollar'></i>" +
        pageName +
        "</a> </li>";
      $("#sidebar ul").append(str);
    }
  }

  // var str = "<li> <a href='index.html'><i class='fas fa-home'></i> Trang chủ</a> </li>";
  // $("#sidebar ul").append(str);
}
