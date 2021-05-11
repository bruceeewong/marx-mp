const getImageInfo = (filePath) => {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: filePath,
      success(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      },
    });
  });
};

module.exports = {
  getImageInfo,
};
