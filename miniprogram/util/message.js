import Typecheck from "./typecheck";
import log from "./log";
import has from "./has";

class Message {
  static success(title = "成功", duration = 2000) {
    wx.showToast({
      title,
      icon: "success",
      duration,
    });
  }

  static error(
    error,
    title = "",
    opts = {
      duration: 2000,
    }
  ) {
    let errMsg = "";
    if (Typecheck.isString(error)) {
      errMsg = error;
    } else if (has(error, "message")) {
      errMsg = error.message;
    } else if (has(error, "errMsg")) {
      errMsg = error.errMsg;
    } else {
      errMsg = "滋——发生未知错误";
    }
    if (Typecheck.isString(title) && title.trim() !== "") {
      errMsg = `${title}: ${errMsg}`;
    }
    wx.showToast({
      title: errMsg,
      icon: "none",
      ...opts,
    });

    // 上报错误日志
    log(
      {
        errMsg,
        error,
      },
      "ERROR",
      Date.now()
    );
  }

  static info(msg = "提示", duration = 2000) {
    wx.showToast({
      title: msg,
      icon: "none",
      duration,
    });
  }

  static response(
    res,
    opts = {
      duration: 2000,
    }
  ) {
    const { msg, code } = res;
    wx.showToast({
      title: msg,
      icon: code === 200 ? "success" : "none",
      ...opts,
    });

    if (code >= 400) {
      // 上报错误日志
      log(res, "ERROR", Date.now());
    }
  }
}

export default Message;
