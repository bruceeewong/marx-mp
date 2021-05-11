const Message = require("../../utils/message");
const Wechat = require("../../utils/wechat");
const log = require("../../utils/log");
const has = require("../../utils/has");

// pages/facefusion-result/facefusion-result.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    webImgUrl: "",
    localImgUrl: "",
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad: function (opts) {
    const {
      image
    } = opts;
    if (!image) {
      throw new Error("image路径参数必传");
    }
    this.setData({
      webImgUrl: image,
    });
  },

  bindImgLoad() {
    this.setData({
      loading: false,
    });
  },

  bindSaveImage() {
    Wechat.showLoading({
      title: "保存图片中",
    });
    this.saveWebImage(this.data.webImgUrl)
      .then((filePath) => {
        return Wechat.saveImageToPhotosAlbum({
          filePath,
        });
      })
      .then(() => {
        Wechat.hideLoading();
        Message.success("保存图片成功");
      })
      .catch((e) => {
        Wechat.hideLoading();

        if (has(e, "errMsg") && e.errMsg.search("cancel") !== -1) {
          Message.info("取消保存");
          return;
        }
        Message.error(e, "保存图片失败");
      });
  },

  bindGeneratePassport() {
    if (this.data.localImgUrl === "") {
      // 如果还没下载过图片的话, 先执行下载
      this.saveWebImage(this.data.webImgUrl)
        .then(() => {
          return this.uploadImg(this.data.localImgUrl);
        })
        .then((fileId) => {
          // 将云文件ID加入用户数据中
          return this.updateUserAvatar(fileId);
        })
        .then(() => {
          this.toTicketPage(this.data.localImgUrl);
        })
        .catch((error) => {
          Message.error(error, "下载网络图片出错");
        });
    } else {
      this.toTicketPage(this.data.localImgUrl);
    }
  },

  uploadImg(tempFilePath = "") {
    const dir = "marx/facefusion/";
    const filename = tempFilePath.replace(/[\:\/]+/g, "_");

    return wx.cloud
      .uploadFile({
        cloudPath: dir + filename,
        filePath: tempFilePath, // 文件路径
      })
      .then((res) => {
        return res.fileID;
      })
      .catch((error) => {
        Message.error(error, "上传融合和图片失败");
        throw error;
      });
  },

  updateUserAvatar(fileId) {
    return wx.cloud
      .callFunction({
        name: "update-avatar",
        data: {
          fileId,
        },
      })
      .then((res) => {
        const {
          code
        } = res.result;
        if (code === 200) {
          return res;
        } else {
          throw new Error(res.result.msg);
        }
      });
  },

  toTicketPage(tempFilePath) {
    Wechat.showLoading({
      title: "数据传输中",
    });
    Wechat.navigateTo({
        url: `/pages/marx-ticket/marx-ticket?imgUrl=${tempFilePath}`,
      })
      .then(() => {
        Wechat.hideLoading();
      })
      .catch(() => {
        Wechat.hideLoading();
      });
  },

  saveWebImage(url) {
    return Wechat.downloadFile({
      url,
    }).then((res) => {
      if (res.statusCode >= 400) {
        log({
          errMsg: "下载网络图片状态码出错",
          error: res,
        });
        throw res;
      }

      // 只要下载了一次, 就保存本地图片路径
      this.setData({
        localImgUrl: res.tempFilePath,
      });

      return res.tempFilePath;
    });
  },
});