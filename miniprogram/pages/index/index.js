"use strict";

const app = getApp();
import Message from "../../util/message";
import Wechat from "../../util/wechat";
import has from "../../util/has";
import shareAppMessage from "../../util/share-app-message";

const totalImgCount = 4;

Page({
  data: {
    loading: true,
    loadedImageCount: 0, // 记录已加载的图片数
  },

  /**
   * 设置分享
   */
  onShareAppMessage() {
    return shareAppMessage;
  },

  /**
   * 页面图片都加载完了，关闭loading，完成首屏加载
   */
  bindImgLoad() {
    // 图片加载就触发一次, 等于对应页面上图片的数量时, loading 结束
    let loadedCount = this.data.loadedImageCount;
    if (loadedCount < totalImgCount) {
      loadedCount += 1;
    }
    const updateParam = {
      loadedImageCount: loadedCount,
    };

    if (loadedCount === totalImgCount) {
      Object.assign(updateParam, {
        loading: false,
      });
      this.delaySetData(updateParam);
    } else {
      this.setData(updateParam);
    }
  },

  bindImgError(e) {
    Message.error(e, "图片加载失败");
  },

  handleRouteToNotice() {
    Wechat.showLoading({
      title: "数据加载中",
    });
    // 先做一层用户注册检测
    this.checkUserRegister()
      .then((result) => {
        Wechat.hideLoading();

        if (result === "no-fileid") {
          // 虽注册了但未完成人脸融合，跳转选模板页
          Wechat.redirectTo({
            url: "/pages/facefusion/facefusion",
          });
        } else if (result === "registered") {
          // 完成了所有注册, 调到结果页
          wx.cloud
            .downloadFile({
              fileID: app.globalData.userInfo.fileId,
            })
            .then((res) => {
              if (res.statusCode >= 400) {
                log({
                  errMsg: "下载网络图片状态码出错",
                  error: res,
                });
                throw res;
              }
              Wechat.redirectTo({
                url: `/pages/marx-ticket/marx-ticket?imgUrl=${res.tempFilePath}`,
              });
            });
        } else {
          // 用户未注册, 继续流程
          Wechat.navigateTo({
            url: "/pages/notice/notice",
          });
        }
      })
      .catch((err) => {
        Wechat.hideLoading();
        Message.error(err, "获取用户注册信息失败");
      });
  },

  delaySetData(updateParam, timeout = 1000) {
    setTimeout(() => {
      this.setData(updateParam);
    }, timeout);
  },

  /**
   * 检查用户的注册状态
   * @returns {Promise}
   */
  checkUserRegister() {
    return wx.cloud
      .callFunction({
        name: "get-user-info",
      })
      .then((res) => {
        const {
          code,
          data,
          msg
        } = res.result;

        if (code === 404) {
          return "no-user";
        }

        if (code === 200) {
          // 将数据注入全局app中
          app.globalData.userInfo = data;

          if (!data.fileId) {
            return "no-fileid";
          }
          return "registered";
        } else {
          throw new Error(msg);
        }
      });
  },
});