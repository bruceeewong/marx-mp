const has = require('./has')
const AudioStatus = require('../enums/audio-status');
const pubsub = require('../utils/pubsub.js');

class AudioManager {
  context = null

  sourceList = []

  status = ''

  currentIndex = 0

  defaultOpts = {
    startTime: 0, // 开始播放的位置(s)
    volume: 1, // 音量
    autoplay: false, // 是否自动开始播放
    loop: false, // 是否循环播放
    playbackRate: 1, // 播放速度 0.5~2.0
    obeyMuteSwitch: true, // 是否遵循系统静音开关
  }

  constructor(sourceList, opts) {
    if (!Array.isArray(sourceList)) {
      throw new Error('init AudioManager failed, sourceList must be array')
    }
    if (sourceList.length === 0) {
      throw new Error('init AudioManager failed, sourceList must contain at least one source')
    }
    this.context = wx.createInnerAudioContext();
    this.sourceList = sourceList;
    this.status = AudioStatus.PAUSE;
    this.currentIndex = 0;
    this.context.src = this.getSrc(this.currentIndex);

    this.initAudioOpts(opts);
    this.initListeners();
  }

  initAudioOpts(opts) {
    this.context.startTime = this.safeGet(opts, 'startTime');
    this.context.volume = this.safeGet(opts, 'volume');
    this.context.autoplay = this.safeGet(opts, 'autoplay');
    this.context.loop = this.safeGet(opts, 'loop');
    this.context.playbackRate = this.safeGet(opts, 'playbackRate');
    this.context.obeyMuteSwitch = this.safeGet(opts, 'obeyMuteSwitch');
  }

  initListeners() {
    this.context.onCanplay(() => {
      // 通过总线发布事件
      pubsub.emit('canplay');
    });
    this.context.onPlay(() => {
      this.status = AudioStatus.PLAY;
      // 通过总线发布事件
      pubsub.emit('change', {
        status: AudioStatus.PLAY
      });
    });
    this.context.onPause(() => {
      this.status = AudioStatus.PAUSE;
      // 通过总线发布事件
      pubsub.emit('change', {
        status: AudioStatus.PAUSE
      });
    });
    this.context.onStop(() => {
      this.status = AudioStatus.STOP;
      // 通过总线发布事件
      pubsub.emit('change', {
        status: AudioStatus.STOP
      });
    });
  }

  // 根据传递的当前状态，做开关操作
  controlAudio() {
    switch (this.status) {
      case AudioStatus.STOP:
      case AudioStatus.PAUSE:
        this.context.play();
        break;
      default:
        this.context.pause();
    }
  }

  switchNextAudio() {
    const len = this.sourceList.length;
    if (this.currentIndex >= len - 1) {
      // 重置为 0
      this.currentIndex = 0;
    } else {
      this.currentIndex += 1; // 下一曲
    }
    this.switchAudio(this.currentIndex);
  }

  switchLastAudio() {
    const len = this.sourceList.length;
    if (this.currentIndex <= 0) {
      // 重置为 末尾第一个
      this.currentIndex = len - 1;
    } else {
      this.currentIndex -= 1; // 上一曲
    }
    this.switchAudio(this.currentIndex);
  }

  switchAudio(index) {
    // 停掉当前播放的歌
    this.context.stop();
    this.context.src = this.getSrc(index);
    this.context.play();
  }

  getStatus() {
    return this.status;
  }

  safeGet(opt, key) {
    return has(opt, key) ? opt[key] : this.defaultOpts[key]
  }

  getSrc(index) {
    const len = this.sourceList.length;
    if (index > len - 1) {
      throw new Error('Index out of sourceList range');
    }
    return this.sourceList[index];
  }
}

module.exports = AudioManager;