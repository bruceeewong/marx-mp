// pages/facefusion/facefusion.js

const app = getApp();
const BiMap = require("../../utils/bimap");
const Message = require("../../utils/message");
const Wechat = require("../../utils/wechat");
const EnumGender = require("../../enums/user-info");
const has = require("../../utils/has");

const faceTemplateParamMap = new BiMap({
  count: "Count",
  faceTemplates: "MaterialInfos",
  id: "MaterialId",
  url: "Url",
});

const TEMPLATE_KEY = "faceTemplates";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    gender: EnumGender.MALE,
    faceTemplates: [],
    activeSuit: {
      id: "",
      url: "",
    },
    userImageUrl: "",
    retry: false,
  },

  // 有两种情况：
  // 1. 身份页跳来, 先选宇航服, 再拍照, 此时不带参数
  // 2. 拍照裁剪完回来, 会带imgUrl与选择好的 suitId 参数
  onLoad(options) {
    const {
      imgUrl,
      suitId
    } = options;
    if (!imgUrl || !suitId) return;

    this.setData({
      userImageUrl: imgUrl,
      "activeSuit.id": suitId,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let gender = EnumGender.MALE;
    if (app.globalData.userInfo) {
      gender = app.globalData.userInfo.gender;
    }

    const result = wx.getStorageSync(TEMPLATE_KEY);
    // 如果缓存不存在，重新获取
    if (!result.value) {
      this.fetchTemplates(gender); // 缓存不存在, 即第一次加载
    } else if (Date.now() > result.expires) {
      // 如果缓存失效, 清除缓存, 重新获取
      wx.removeStorageSync(TEMPLATE_KEY);
      this.fetchTemplates(gender);
    } else {
      const faceTemplates = result.value;
      let activeSuit = {}
      // 检测是否有从路由带来的模板id
      if (!this.data.activeSuit.id) {
        activeSuit = faceTemplates[0] // 默认选中第一个
      } else {
        // 从裁剪页回来, 直接拿缓存的值, 并设置选中的值
        const activeId = this.data.activeSuit.id; // 此处的id是在onLoad时获取到的
        const suit = faceTemplates.find((item) => item.id === activeId);
        activeSuit = suit
      }

      this.setData({
        activeSuit: activeSuit,
        faceTemplates: faceTemplates,
      });

      // 为了给图片加载留时间
      this.delaySetData({
        loading: false,
      });
    }
  },

  /**
   * 模板选择响应函数
   * @param {*} event
   */
  bindFaceSelect(event) {
    this.setData({
      activeSuit: event.target.dataset,
    });
  },

  /**
   * 拍摄/选择照片响应函数
   */
  bindChooseImage() {
    Wechat.chooseImage()
      .then((tmpPath) => {
        wx.navigateTo({
          url: `/pages/face-clip/face-clip?imgUrl=${tmpPath}&suitId=${this.data.activeSuit.id}`,
        });
      })
      .catch(() => {
        Message.info("未选择图片");
      });
  },

  bindRetry() {
    Wechat.navigateBack({
      delta: 2,
    });
  },

  /**
   * 开始人脸融合响应函数
   */
  bindFacefusion() {
    if (!this.data.userImageUrl) {
      Message.info("请先拍摄/选择个人照片");
      return;
    }

    // 先清除缓存的图片
    this.removeSavedFile()
      .then(() => {
        wx.showLoading({
          title: "正在上传图像",
        });
        return this.uploadImg();
      })
      .then((res) => {
        wx.hideLoading();

        this.facefusion(this.data.activeSuit.id, res.fileID);
      });
  },

  removeSavedFile() {
    return Wechat.getSavedFileList()
      .then((res) => {
        const promises = res.fileList.map((item) =>
          Wechat.removeSavedFile(item.filePath)
        );
        return Promise.all(promises);
      })
      .catch((error) => {
        Message.error(error, "清空缓存文件失败");
        throw erro;
      });
  },

  uploadImg() {
    const imgUrl = this.data.userImageUrl;
    const dir = "marx/user-faces/";
    const filename = imgUrl.replace(/[\:\/]+/g, "_");

    return wx.cloud
      .uploadFile({
        cloudPath: dir + filename,
        filePath: imgUrl, // 文件路径
      })
      .catch((error) => {
        Message.error(error, "上传图片至云空间失败");
        throw error;
      });
  },

  facefusion(modelId, fileId) {
    Wechat.showLoading({
      title: "开始融合",
    });

    return wx.cloud
      .callFunction({
        name: "facefusion",
        data: {
          fileId: fileId,
          modelId: modelId,
        },
      })
      .then((res) => {
        if (has(res.result, "code") && res.result.code >= 400) {
          this.setData({
            retry: true,
          });
          throw res.result.msg;
        }
        const image = res.result.image;
        Wechat.hideLoading();
        Wechat.navigateTo({
          url: `/pages/facefusion-result/facefusion-result?image=${image}`,
        });
      })
      .catch((err) => {
        wx.hideLoading();
        this.setData({
          retry: true,
        });

        // 云函数报错, 一般就是超时/网络问题，提示重试
        if (has(err, "errCode")) {
          Message.error("图像融合失败, 请重试");
        } else {
          // 否则接收后端返回的报错
          Message.error(err, "图像融合失败");
        }
      });
  },

  /**
   * 获取融合模板
   */
  fetchTemplates(gender) {
    wx.cloud
      .callFunction({
        name: "get-face-list",
        data: {
          gender,
          limit: 2,
        },
      })
      .then((res) => {
        const result = faceTemplateParamMap.reverseConvert(res.result);
        if (result.count === 0) {
          throw new Error("未获取到融合模板数据");
        }
        const faceTemplates = result.faceTemplates.map((item) => {
          const {
            id,
            url
          } = faceTemplateParamMap.reverseConvert(item);
          return {
            id,
            url,
          };
        });
        this.setData({
          activeSuit: faceTemplates[0], // 默认加载第一个
          faceTemplates: faceTemplates,
        });

        // 存入小程序缓存中, 下次进入页面直接从storage拿信息
        // 缓存时限为5min
        wx.setStorageSync(TEMPLATE_KEY, {
          value: faceTemplates,
          expires: Date.now() + 5 * 60 * 1000
        });

        this.delaySetData({
          loading: false,
        });
      })
      .catch((err) => {
        Message.error(err);
      });
  },

  delaySetData(param) {
    setTimeout(() => {
      this.setData(param);
    }, 1000);
  },
});