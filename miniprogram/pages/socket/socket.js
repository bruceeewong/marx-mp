// pages/socket/socket.js
const app = getApp();
const Wechat = require('../../utils/wechat');
const Message = require('../../utils/message');

const Method = {
  CONNECT: "CONNECT",
  USER_INFO: "USER_INFO",
  READY: "READY",
  REQ_LAUNCH: "REQ_LAUNCH",
  ERROR: "ERROR",
};

const dataSchema = (method, clientId, payload) => {
  return JSON.stringify({
    method,
    clientId,
    payload
  })
}

Page({
  // 设置为自定义属性, 全局维护一个
  socketTask: null,

  /**
   * 页面的初始数据
   */
  data: {
    socketTaskId: -1,
    connected: false,
    ready: false,
    clientId: '',
    userInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getUserInfo()
      .then(() => {
        if (!this.data.userInfo) return
        this.setupWebsocket()
      })
  },

  getUserInfo() {
    return wx.cloud.callFunction({
        name: 'get-user-info'
      })
      .then(res => {
        const {
          code,
          data,
          msg
        } = res.result
        if (code >= 400) {
          Message.error(data, msg)
          return
        }
        this.setData({
          userInfo: data
        })
      })
      .catch(err => {
        Message.error(err, '调用云函数: get-user-info 失败')
        throw err
      })
  },

  setupWebsocket() {
    const that = this
    this.socketTask = wx.connectSocket({
      url: "ws://localhost:9090",
      header: {
        mode: 'miniprogram'
      },
      success(res) {
        console.log("create socketTask success", res);
        that.setData({
          socketTaskId: res.socketTaskId
        })
      },
      fail(err) {
        console.log("create socketTask failed", err);
      }
    })

    // socketTask打开成功
    this.socketTask.onMessage(this.handleSocketMessage)
    this.socketTask.onClose(this.handleSocketClose)
    this.socketTask.onError(this.handleSocketError)
  },

  handleSocketMessage(res) {
    const resData = JSON.parse(res.data)

    switch (resData.method) {
      case Method.CONNECT:
        this.handleConnected(resData)
        break
      case Method.READY:
        this.handleReady(resData)
        break
      case Method.ERROR:
        this.handleError(resData)
        break
      default:
        Message.info('不识别的方法')
        console.log('不识别的方法', resData.method)
    }
  },

  handleConnected(resData) {
    console.log('连接成功', resData)
    const {
      clientId
    } = resData.data

    this.setData({
      connected: true,
      clientId: clientId
    })

    this.sendUserInfo()
  },

  handleReady(resData) {
    this.setData({
      ready: true
    })
    Message.info('总部说可以发射了')
    console.log('总部说可以发射了', resData)
  },

  sendUserInfo() {
    this.socketTask.send({
      data: dataSchema(Method.USER_INFO, this.data.clientId, this.data.userInfo)
    })
  },

  sendLaunchRequest() {
    this.socketTask.send({
      data: dataSchema(Method.REQ_LAUNCH, this.data.clientId)
    })
  },

  handleError(res) {
    Message.error('服务器返回错误', res)
    console.error('服务器返回错误', res)
  },

  handleSocketClose(res) {
    console.log('connect closed', res)
    this.setData({
      connected: false,
      socketTask: null
    })
  },

  handleSocketError(res) {
    console.log('connect error', res)
    this.setData({
      connected: false,
      socketTask: null
    })
  }
});