// pages/marx-ticket/marx-ticket.js
const app = getApp();
const Wechat = require("../../utils/wechat");
const Message = require("../../utils/message");
const has = require("../../utils/has");
const shareAppMessage = require('../../utils/share-app-message');

// 画布id
const canvasId = "marx-ticket";

// 画布尺寸
const canvasWidthRpx = 608;
const canvasHeightRpx = 945;

// 用户图像尺寸
const userWidthRpx = 467;
const userHeightRpx = 600;

// 用户名坐标
const nameXrpx = 218;
const nameYrpx = 625;

// 用户地球国家坐标
const countryXrpx = 218;
const countryYrpx = 772;

// 用户火星归属地坐标
const areaXrpx = 218;
const areaYrpx = 898;

// 小程序尺寸、坐标
const mpCodeXrpx = 14;
const mpCodeYrpx = 792;
const mpCodeWidthRpx = 105;
const mpCodeHeightRpx = 105;

const ticketImgWebUrl =
  "https://marx-1257249827.cos.ap-guangzhou.myqcloud.com/images/ticket.png";
const mpCodeImgWebUrl =
  "https://marx-1257249827.cos.ap-guangzhou.myqcloud.com/images/mp-code.jpg";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,

    canvasContext: null,
    userInfo: {
      earthCountry: "",
      gender: "",
      marsArea: "",
      name: "",
    },
    localImgUrl: "",
    localTicketImgUrl: "",
    localMpCodeImgUrl: "",
    rpxRatio: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {
      imgUrl
    } = options;
    if (!imgUrl) {
      throw new Error("路径参数imgUrl必传");
    }
    const ctx = wx.createCanvasContext(canvasId);

    this.setData({
      localImgUrl: imgUrl,
      canvasContext: ctx,
    });
    this.init();
  },
  onShareAppMessage() {
    return shareAppMessage
  },

  bindSaveTicket() {
    Wechat.showLoading({
      title: "保存图片中",
    });

    this.data.canvasContext.draw(
      true,
      setTimeout(function () {
        Wechat.canvasToTempFilePath({
            fileType: "jpg",
            quality: 1,
            canvasId: canvasId,
          })
          .then((res) => {
            return Wechat.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
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
            if (has(e, "errMsg") && e.errMsg.search("deny") !== -1) {
              Message.info("请打开右上角的设置的相册授权");
              return;
            }
            Message.error(e, "保存图片失败");
          });
      }, 1500)
    );
  },

  bindScanCode() {
    Wechat.scanCode()
      .then(res => {
        console.log(res)

        if (!res.path) {
          Message.info('请扫描活动大屏上的二维码')
          return
        }
        Wechat.redirectTo({
          url: res.path
        })
      })
  },

  bindToCenter() {
    Wechat.showModal({
      title: "移民提示",
      content: "请前往 腾讯滨海大厦(深圳) 或 SKPS(北京) 飞船发射中心, 凭通行证开启火星之旅, 祝您好运！",
    });
  },

  init() {
    Wechat.getSystemInfo()
      .then((res) => {
        const {
          windowWidth
        } = res;
        const rpxRatio = 750 / windowWidth;
        this.setData({
          rpxRatio,
        });
        return Wechat.getImageInfo(this.data.localImgUrl);
      })
      .then(({
        width,
        height
      }) => {
        this.drawUserImage(
          this.data.canvasContext,
          this.data.localImgUrl,
          width,
          height
        );
      })
      .then(() => {
        return this.getTicketInfo();
      })
      .then(({
        width,
        height
      }) => {
        this.drawTicket(
          this.data.canvasContext,
          this.data.localTicketImgUrl,
          width,
          height
        );
      })
      .then(() => {
        return this.getMpCodeInfo();
      })
      .then(({
        width,
        height
      }) => {
        this.drawMpCode(
          this.data.canvasContext,
          this.data.localMpCodeImgUrl,
          width,
          height
        );
      })
      .then(() => {
        this.drawUserName(this.data.canvasContext);
        this.drawEarthCountry(this.data.canvasContext);
        this.drawMarsArea(this.data.canvasContext);
      })
      .then(() => {
        this.data.canvasContext.draw();

        this.delaySetData({
          loading: false,
        });
      })
      .catch((err) => {
        Message.error(err, "初始化失败");
      });
  },

  /**
   * 计算rpx对应的px值
   * @param {Number} rpxNum
   * @returns {Number}
   */
  convertToPx(rpxNum) {
    return rpxNum / this.data.rpxRatio;
  },

  getTicketInfo() {
    return Wechat.downloadFile({
        url: ticketImgWebUrl,
      })
      .then((res) => {
        const {
          tempFilePath
        } = res;
        this.setData({
          localTicketImgUrl: tempFilePath,
        });
        return Wechat.getImageInfo(tempFilePath);
      })
      .catch((err) => {
        Message.error(err, "下载卡片图片出错");
        throw err;
      });
  },

  getMpCodeInfo() {
    return Wechat.downloadFile({
        url: mpCodeImgWebUrl,
      })
      .then((res) => {
        const {
          tempFilePath
        } = res;
        this.setData({
          localMpCodeImgUrl: tempFilePath,
        });
        return Wechat.getImageInfo(tempFilePath);
      })
      .catch((err) => {
        Message.error(err, "下载小程序图片出错");
        throw err;
      });
  },

  /**
   * 绘制用户照片
   * @param {canvasContext} ctx
   * @param {String} localImgUrl
   * @param {Number} imgWidthPx
   * @param {Number} imgHeightPx
   */
  drawUserImage(ctx, localImgUrl, imgWidthPx, imgHeightPx) {
    // 不裁剪
    const sliceXpx = 0;
    const sliceYpx = 0;
    const sliceWidthPx = imgWidthPx; // 等于原图的宽度 px
    const sliceHeightPx = imgHeightPx; // 等于原图的高度 px

    // 根据设计稿可知其rpx关系
    const drawXrpx = canvasWidthRpx - userWidthRpx;
    const drawYrpx = 0;
    const drawWidthRpx = userWidthRpx;
    const drawHeightRpx = userHeightRpx;

    // 统一转换为px
    const drawXpx = this.convertToPx(drawXrpx);
    const drawYpx = this.convertToPx(drawYrpx);
    const drawWidthPx = this.convertToPx(drawWidthRpx);
    const drawHeightPx = this.convertToPx(drawHeightRpx);

    ctx.drawImage(
      localImgUrl,
      sliceXpx,
      sliceYpx,
      sliceWidthPx,
      sliceHeightPx,

      drawXpx,
      drawYpx,
      drawWidthPx,
      drawHeightPx
    );
  },

  /**
   * 绘制卡片模板
   * @param {canvasContext} ctx
   * @param {String} localImgUrl
   * @param {Number} imgWidthPx
   * @param {Number} imgHeightPx
   */
  drawTicket(ctx, localImgUrl, imgWidthPx, imgHeightPx) {
    // 不裁剪
    const sliceXpx = 0;
    const sliceYpx = 0;
    const sliceWidthPx = imgWidthPx; // 等于原图的宽度 px
    const sliceHeightPx = imgHeightPx; // 等于原图的高度 px

    // 根据设计稿可知其rpx关系，统一转换为px
    const drawXpx = 0;
    const drawYpx = 0;
    const drawWidthPx = this.convertToPx(canvasWidthRpx);
    const drawHeightPx = this.convertToPx(canvasHeightRpx);

    ctx.drawImage(
      localImgUrl,
      sliceXpx,
      sliceYpx,
      sliceWidthPx,
      sliceHeightPx,

      drawXpx,
      drawYpx,
      drawWidthPx,
      drawHeightPx
    );
  },

  drawMpCode(ctx, localImgUrl, imgWidthPx, imgHeightPx) {
    // 不裁剪
    const sliceXpx = 0;
    const sliceYpx = 0;
    const sliceWidthPx = imgWidthPx; // 等于原图的宽度 px
    const sliceHeightPx = imgHeightPx; // 等于原图的高度 px

    // 根据设计稿可知要绘制的图形rpx值, 统一转换为px
    const drawXpx = this.convertToPx(mpCodeXrpx);
    const drawYpx = this.convertToPx(mpCodeYrpx);
    const drawWidthPx = this.convertToPx(mpCodeWidthRpx);
    const drawHeightPx = this.convertToPx(mpCodeHeightRpx);

    ctx.drawImage(
      localImgUrl,
      sliceXpx,
      sliceYpx,
      sliceWidthPx,
      sliceHeightPx,

      drawXpx,
      drawYpx,
      drawWidthPx,
      drawHeightPx
    );
  },

  drawUserName(ctx) {
    const drawXpx = this.convertToPx(nameXrpx);
    const drawYpx = this.convertToPx(nameYrpx);

    let userName = "你好火星";
    if (app.globalData.userInfo && has(app.globalData.userInfo, "name")) {
      userName = app.globalData.userInfo.name;
    }

    ctx.setFontSize(20);
    ctx.setFillStyle("white");
    ctx.fillText(userName, drawXpx, drawYpx);
  },

  drawEarthCountry(ctx) {
    const drawXpx = this.convertToPx(countryXrpx);
    const drawYpx = this.convertToPx(countryYrpx);

    let earthCountry = "中国";
    if (
      app.globalData.userInfo &&
      has(app.globalData.userInfo, "earthCountry")
    ) {
      earthCountry = app.globalData.userInfo.earthCountry;
    }

    ctx.setFontSize(12);
    ctx.setFillStyle("white");
    ctx.fillText(earthCountry, drawXpx, drawYpx);
  },

  drawMarsArea(ctx) {
    const drawXpx = this.convertToPx(areaXrpx);
    const drawYpx = this.convertToPx(areaYrpx);

    let marsArea = "未传入地点";
    if (app.globalData.userInfo && has(app.globalData.userInfo, "marsArea")) {
      marsArea = app.globalData.userInfo.marsArea;
    }

    ctx.setFontSize(12);
    ctx.setFillStyle("white");
    ctx.fillText(marsArea, drawXpx, drawYpx);
  },

  delaySetData(param) {
    setTimeout(() => {
      this.setData(param);
    }, 1000);
  },
});