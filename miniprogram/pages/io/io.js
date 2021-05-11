// pages/io/io.js
const app = getApp();
const IO = require('../../lib/socket.io-mp');
const WsStatus = require('../../enums/ws-status');
const Message = require('../../utils/message');
const Wechat = require('../../utils/wechat');
const has = require('../../utils/has');
const Typecheck = require('../../utils/typecheck');
// const WS_URL = 'ws://localhost:3000';
const WS_URL = 'wss://bruski.wang';

Page({
  io: null,
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    clientId: '',
    status: WsStatus.DISCONNECT,
    finished: false,
    userInfo: {
      name: '默认',
      avatarUrl: '',
      marsArea: '希腊平原',
    },
    marxId: '',
    landResult: {
      landed: true,
      landedDate: '',
      rank: 0
    },
    gifts: [{
        img: 'https://marx-1257249827.cos.ap-guangzhou.myqcloud.com/images/gift-1.png'
      },
      {
        img: 'https://marx-1257249827.cos.ap-guangzhou.myqcloud.com/images/gift-2.png'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkUserRegister()
      .then((isRegister) => {
        if (isRegister) {
          try {
            this.initWebsocket();
          } catch (e) {
            Message.error(e, '连接服务器失败')
          }
        }
      });
  },

  checkUserRegister() {
    return wx.cloud.callFunction({
        name: 'get-user-info',
      })
      .then(res => {
        const {
          code,
          data,
          msg
        } = res.result;
        if (Typecheck.isString(code)) throw new Error(`后端返回数据格式异常: ${JSON.stringify(res.result)}`);
        if (code === 404) {
          // 用户未注册, 跳转首页
          Wechat.redirectTo({
            url: '/pages/index/index'
          });
          return false;
        }
        if (code === 200) {
          // 将数据注入全局app中
          app.globalData.userInfo = data;
          if (!has(data, 'fileId')) {
            // 虽注册了但未完成人脸融合，跳转选模板页
            Wechat.redirectTo({
              url: '/pages/facefusion/facefusion'
            });
            return false;
          }
          this.setData({
            loading: false,
            userInfo: data,
          });
          return true;
        } else {
          throw new Error(msg);
        }
      })
      .catch(err => {
        Message.error(err, '获取用户注册信息失败');
        throw err;
      })
  },

  initWebsocket() {
    this.io = new IO(WS_URL, {
      reconnection: false,
      timeout: 1 * 60 * 1000, // 1min
      query: {
        clientType: 'miniprogram',
        userInfo: JSON.stringify(app.globalData.userInfo),
      }
    });
    this.io.on('connect', () => {
      this.setData({
        status: WsStatus.CONNECT,
      });
      console.log(`current status: ${this.data.status}`);
    });

    this.io.on('disconnect', () => {
      this.setData({
        status: WsStatus.DISCONNECT,
      });
      console.log(`current status: ${this.data.status}`);
    });

    this.io.on('biz_error', (err) => {
      console.log(err);
      // 此时服务器会主动断开连接，所以会走到disconnect处
      Message.error(err, '业务错误');
    })

    this.io.on('after_connect', (data) => {
      // 待发射状态
      this.setData({
        clientId: data.clientId,
        status: WsStatus.READY,
      });
      console.log(`current status: ${this.data.status}`);
    });

    this.io.on('finished', (data) => {
      // 流程结束，标记finished，连接断开
      console.log('game finished: ', data);
      const {
        landed
      } = data;
      if (!landed) {
        Message.error(data.errMsg, '发射失败')
        this.io.disconnect()

        setTimeout(() => {
          Wechat.redirectTo({
            url: '/pages/index/index',
          })
        }, 3000)
        return
      }

      // 基于登陆日期生成前端展示的火星ID
      const landedDate = new Date(data.landedDate)
      let year = landedDate.getFullYear()
      let month = landedDate.getMonth() + 1
      let date = landedDate.getDate()
      const rank = data.rank.toString()

      const marxId = `MARX-${year}${month}${date}-${rank}`
      this.setData({
        marxId,
        finished: true,
        landResult: data,
      })
      this.io.disconnect();
    })
  },

  bindLaunch() {
    console.log('shooooo~, rocket is launching!');
    this.setData({
      status: WsStatus.LAUNCHING
    });
  },

  bindLaunchEnd() {
    console.log('rocket has launched!')
    this.io.emit('enter_space');
    this.setData({
      status: WsStatus.LANDING
    });
    console.log(`current status: ${this.data.status}`);
  },
})