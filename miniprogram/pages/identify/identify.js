"use strict";
const app = getApp();
const Wechat = require("../../utils/wechat");
const Message = require("../../utils/message");

Page({
  data: {},
  onGetUserInfo(userInfoRes) {
    Wechat.showLoading();

    Wechat.getSetting().then((settingRes) => {
      Wechat.hideLoading();

      if (!settingRes.authSetting["scope.userInfo"]) {
        Message.info("请允许授权才能继续探索");
        return;
      }
      const { nickName, gender, country } = userInfoRes.detail.userInfo;

      wx.navigateTo({
        url: `/pages/info-form/info-form?nickName=${nickName}&gender=${gender}&country=${country}`,
      });
    });
  },
});
