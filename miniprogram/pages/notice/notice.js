"use strict";

import Wechat from "../../util/wechat";
import Message from "../../util/message";

Page({
  data: {},

  /**
   * 获取用户微信信息 (昵称, 性别, 国家)
   * @param {*} userInfoRes
   */
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
