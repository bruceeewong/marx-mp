const log = (detail, level = 'ERROR', timestamp = Date.now()) => {
  return wx.cloud.callFunction({
    name: 'log',
    data: {
      level,
      detail,
      timestamp
    }
  })
}

module.exports = log