const app = getApp();
import TypeCheck from "../../util/typecheck";
import Message from "../../util/message";
import Wechat from "../../util/wechat";
import WxValidate from "../../assets/plugins/wx-validate/WxValidate";
import { genders, earthCountries, terranInfo, rules, messages } from "./data";
import { EnumWechatGender } from "../../enum/user-info";

// key是微信的性别值, value是性别选择项的下标
const genderValueIndexMap = {
  [EnumWechatGender.UNKNOWN]: 0,
  [EnumWechatGender.MALE]: 0,
  [EnumWechatGender.FEMALE]: 1,
};

Page({
  data: {
    loading: true,

    form: {
      name: "",
      genderIndex: 0,
      earthCountryIndex: 0,
    },

    // 火星目的地下标
    activeAreaIndex: 0,
    // 火星目的地选择列
    swiperList: terranInfo,

    genders, // 性别下拉数据
    earthCountries: earthCountries.map((item) => item.label), // 地球国家下拉数据
  },

  /**
   * 页面加载时，接收上一页获取到的微信身份信息
   * @param {*} userInfo
   */
  onLoad(userInfo) {
    this.setFormData(userInfo);
    this.delaySetData({
      loading: false,
    });
  },

  /** 提交身份信息 */
  bindFormSubmit() {
    const form = this.createSubmitParam(this.data.form);

    // 表单验证
    const validator = new WxValidate(rules, messages);
    if (!validator.checkForm(form)) {
      const error = validator.errorList[0];
      Message.info(error.msg);
      return;
    }

    Wechat.showLoading({
      title: "数据传送中",
    });
    wx.cloud
      .callFunction({
        name: "signup",
        data: form,
      })
      .then((res) => {
        const { msg, code } = res.result;

        /**
         * 将结果保存到全局
         * type
         * earthCountry: "中国"
         * gender: "男" / "女"
         * marsArea: "xxx平原"
         * name: string
         */
        app.globalData.userInfo = form;

        Wechat.hideLoading();

        if (code === 200 || code === 302) {
          Wechat.navigateTo({
            url: `/pages/facefusion/facefusion`,
          });
        } else {
          throw new Error(msg);
        }
      })
      .catch((err) => {
        Message.error(err, "提交身份信息失败");
      });
  },

  bindNameInput(event) {
    this.setData({
      "form.name": event.detail.value,
    });
  },

  bindGenderChange(event) {
    this.setData({
      "form.genderIndex": event.detail.value,
    });
  },

  bindEarthCountryChange(event) {
    this.setData({
      "form.earthCountryIndex": event.detail.value,
    });
  },

  bindMarsAreaChange(event) {
    this.setData({
      activeAreaIndex: event.detail.current,
    });
  },

  /**
   * 根据表单 + 火星目的地选择，生成要提交的数据
   * @param {*} form
   */
  createSubmitParam(form) {
    const gender = this.getGender(form.genderIndex);
    const earthCountry = this.getEarthCountry(form.earthCountryIndex);
    const marsArea = this.getMarsArea();
    return {
      name: form.name,
      gender,
      earthCountry,
      marsArea,
    };
  },

  /** 根据下标, 获取对应值 */
  getGender(index) {
    return this.data.genders[index];
  },

  /** 根据下标, 获取对应值 */
  getEarthCountry(index) {
    return this.data.earthCountries[index];
  },

  /** 根据下标, 获取对应值 */
  getMarsArea() {
    const index = this.data.activeAreaIndex;
    return this.data.swiperList[index].nameZh;
  },

  /** 根据微信的用户数据, 初始化生成本业务所需的数据 */
  setFormData(opts) {
    if (!TypeCheck.isObject(opts)) return;

    const setterMap = {
      nickName: "name",
      gender: "genderIndex",
      country: "earthCountry",
    };

    const newForm = {};

    for (const key of Object.keys(setterMap)) {
      let value = opts[key];

      if (!value) continue;

      // 对性别做单独处理
      if (key === "gender") {
        value = genderValueIndexMap[value]; // 对微信定义的性别值做一层映射
      }
      // 对微信传来的城市做处理
      if (key === "country") {
        // 找到城市列表的英文或中文，返回其下标
        value = earthCountries.findIndex((item) => {
          return item.label === value || item.value === value;
        });
      }
      const convertKey = setterMap[key];
      newForm[convertKey] = value;
    }

    if (Object.keys(newForm).length === 0) return;

    this.setData({
      form: Object.assign({}, this.data.form, newForm),
    });
  },

  delaySetData(param, delay = 1000) {
    setTimeout(() => {
      this.setData(param);
    }, delay);
  },
});
