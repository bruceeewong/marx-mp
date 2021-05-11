// components/audio-player/index.js
const app = getApp();
const pubsub = require('../../utils/pubsub')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    size: {
      type: String,
      value: 'medium'
    },
    top: {
      type: String,
      value: '20rpx'
    },
    left: {
      type: String,
      value: null
    },
    right: {
      type: String,
      value: '20rpx'
    },
    bottom: {
      type: String,
      value: null
    },
    showControl: {
      type: Boolean,
      value: false
    }
  },

  data: {
    state: '',
    pubsubCallBack: null
  },

  lifetimes: {
    attached() {
      /** 组件初始化要同步全局音频播放状态 */
      this.data.pubsubCallBack = this.updateData.bind(this); // 初始化订阅回调函数

      this.updateData({
        status: app.bgAudioManager.getStatus(),
      });
    },
    ready() {
      // 订阅 change 事件, 实际的状态变更由全局的audioManager的context上下文来控制变化
      pubsub.on('change', this.data.pubsubCallBack);
    },
    detached() {
      // 销毁注册回调
      pubsub.off('change', this.data.pubsubCallBack);
    }
  },

  pageLifetimes: {
    show() {
      /** 组件所在的页面变化了，也要同步全局音频播放状态 */
      this.updateData({
        status: app.bgAudioManager.getStatus()
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    updateData(data) {
      this.setData({
        status: data.status
      });
    },
    bindControlAudio() {
      app.bgAudioManager.controlAudio();
    },
    bindLastSong() {
      app.bgAudioManager.switchLastAudio();
    },
    bindNextSong() {
      app.bgAudioManager.switchNextAudio();
    },
  }
})