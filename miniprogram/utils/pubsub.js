class PubSub {
  constructor() {
    this.handlers = {};
    this.instance = null;
  }
  // 单例模式
  static getInstance() {
    if (!this.instance) {
      this.instance = new PubSub();
    }
    return this.instance;
  }

  /** 订阅事件 */
  on(eventType, handler) {
    // 判断事件名称是否在handler中，放置重复添加
    if (!(eventType in this.handlers)) {
      this.handlers[eventType] = [];
    }

    // 将回调放到处理队列中
    this.handlers[eventType].push(handler);
    return this;
  }

  /** 发布事件 */
  emit(eventType, ...args) {
    // 遍历执行该事件注册的回调函数
    if (this.handlers[eventType]) {
      this.handlers[eventType].forEach(callback => {
        callback(...args);
      });
      return this;
    }
  }

  /** 删除订阅事件 */
  off(eventType, handler) {
    const currentEventQueue = this.handlers[eventType];
    this.handlers[eventType] = currentEventQueue.filter(item => item !== handler);
    return this;
  }
}

module.exports = PubSub.getInstance();