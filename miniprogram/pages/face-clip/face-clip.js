// pages/face-clip/face-clip.js
const app = getApp();

const Message = require("../../utils/message");
const Wechat = require("../../utils/wechat");

const CLIP_WIDTH = 600;
const FULL_WIDTH = 750;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    dpr: 2,
    // 用户选择的图片的地址
    imageSrc: "",
    suitId: "",
    // movable-area top 的值
    areaTop: 0,
    initialWidth: 0,
    initialHeight: 0,
    initialX: 0,
    initialY: 0,
    initialScale: 1,
    clipSize: 0,

    x: 0,
    y: 0,
    scale: 1,

    canvasSize: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 选照片会导致音频播放中断, 手动再调用一下
    app.bgAudioManager.controlAudio();
    const {
      imgUrl,
      suitId = ""
    } = options; // suitId仅仅在此做中转
    if (!imgUrl) {
      throw new Error("页面初始化失败: 请传入图片地址");
    }
    this.setData({
      suitId: suitId,
      imageSrc: imgUrl,
    });
    this.init(imgUrl);
  },

  init(imageSrc) {
    // 获取屏幕信息
    let {
      windowWidth,
      windowHeight,
      pixelRatio
    } = wx.getSystemInfoSync();

    // 裁剪框是 600rpx，计算出对应的 px 值
    const clipSize = (windowWidth / FULL_WIDTH) * CLIP_WIDTH;

    // 计算出裁剪框应该距离顶部的值，以便定位
    const areaTop = (windowHeight - clipSize) / 2;

    Wechat.getImageInfo(imageSrc)
      .then((res) => {
        const {
          width,
          height
        } = res;

        // 在知道图片本身的宽高后，一开始需要缩放一下图片使得图片的宽或者高等于裁剪框尺寸, 采取短边适应策略
        const scale = Math.max(clipSize / width, clipSize / height);
        const initialWidth = width * scale;
        const initialHeight = height * scale;

        this.setData({
          dpr: pixelRatio,
          areaTop,
          initialWidth,
          initialHeight,
          initialX: (clipSize - initialWidth) / 2,
          initialY: (clipSize - initialHeight) / 2,
          initialScale: scale,
          clipSize,
        });
      })
      .catch((err) => {
        Message.error(err, "读取系统信息失败");
      });
  },

  onChange(e) {
    this.setData({
      x: e.detail.x,
      y: e.detail.y,
    });
  },

  onScale(e) {
    this.setData({
      x: e.detail.x,
      y: e.detail.y,
      scale: e.detail.scale,
    });
  },

  onClickConfirm() {
    const {
      imageSrc,
      x,
      y,
      initialScale,
      scale,
      clipSize
    } = this.data;

    const totalScale = scale * initialScale;
    const sx = -x / totalScale;
    const sy = -y / totalScale;
    const canvasSize = clipSize / totalScale;

    this.setData({
      canvasSize
    });
    const canvasId = "canvas";
    const ctx = wx.createCanvasContext(canvasId);
    ctx.drawImage(
      imageSrc,
      sx,
      sy,
      canvasSize,
      canvasSize,
      0,
      0,
      canvasSize,
      canvasSize
    );
    ctx.draw(false, () => {
      Wechat.canvasToTempFilePath({
          fileType: "jpg",
          quality: 0,
          canvasId,
        })
        .then((res) => {
          // 图像压缩
          return Wechat.compressImage({
            src: res.tempFilePath,
            quality: 0,
          });
        })
        .then((res) => {
          let filePath = res.tempFilePath;
          const suitId = this.data.suitId;
          wx.navigateTo({
            url: `/pages/facefusion/facefusion?imgUrl=${filePath}&suitId=${suitId}`, // 回传裁剪后的图像url与选择的suitId
          });
        })
        .catch((err) => {
          Message.error(err, "裁剪图片失败");
        });
    });
  },
  onClickCancel() {
    wx.navigateBack();
  },
});