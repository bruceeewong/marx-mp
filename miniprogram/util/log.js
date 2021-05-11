const log = (detail, level = "ERROR", logTime = new Date()) => {
  return wx.cloud.callFunction({
    name: "log",
    data: {
      level,
      detail,
      logTime,
    },
  });
};

export default log;
