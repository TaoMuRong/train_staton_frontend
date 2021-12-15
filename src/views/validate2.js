export function isTel(tel) {
    var isMobile = /^((1[3,5,8,7,9][0-9])|(14[5,7])|(17[0,6,7,8])|(19[1,7]))\d{8}$/;
    var errorMsg = "";
    if (tel === "") {
      errorMsg = "电话号不能为空"
    } else if (!isMobile.exec(tel)) {
      errorMsg = "你输入的电话号长度或格式错误"
    } 
    return errorMsg;
  }