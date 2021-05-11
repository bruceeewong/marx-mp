// pages/choose-image/choose-image.js
const Wechat = require("../../utils/wechat");

Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 拍摄/选择照片响应函数
   */
  bindChooseImage() {
    Wechat.chooseImage()
      .then((tmpPath) => {
        wx.navigateTo({
          url: `/pages/face-clip/face-clip?imgUrl=${tmpPath}`,
        });
      })
      .catch(() => {
        Message.info("未选择图片");
      });
  },
});