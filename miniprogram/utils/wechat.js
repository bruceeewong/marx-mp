class Wechat {
  static showLoading(opts) {
    return new Promise((resolve, reject) => {
      wx.showLoading({
        ...opts,
        title: (opts && opts.title) || "加载中",
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }

  static hideLoading() {
    return new Promise((resolve, reject) => {
      wx.hideLoading({
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }

  static getSetting() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: (res) => resolve(res),
        fail: (err) => reject(err),
      });
    });
  }

  static navigateTo(opts) {
    return new Promise((resolve, reject) => {
      wx.navigateTo({
        ...opts,
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }

  static redirectTo(opts) {
    return new Promise((resolve, reject) => {
      wx.redirectTo({
        ...opts,
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }

  static removeSavedFile(filePath) {
    return new Promise((resolve, reject) => {
      wx.removeSavedFile({
        filePath: filePath,
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }

  static readFile(filePath, encoding = "base64") {
    return new Promise((resolve, reject) => {
      const manager = wx.getFileSystemManager();
      manager.readFile({
        filePath,
        encoding,
        success(res) {
          resolve(res.data);
        },
        fail(e) {
          reject(e);
        },
      });
    });
  }

  static chooseImage() {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["camera", "album"],
        success(res) {
          resolve(res.tempFilePaths[0]);
        },
        fail(e) {
          reject(e);
        },
      });
    });
  }

  static getImageInfo(filePath) {
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
  }

  static saveFile(tempFilePath) {
    return new Promise((resolve, reject) => {
      wx.saveFile({
        tempFilePath,
        success(res) {
          resolve(res.savedFilePath);
        },
        fail(e) {
          reject(e);
        },
      });
    });
  }

  static canvasToTempFilePath(opts, context) {
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath({
          ...opts,
          success(res) {
            resolve(res);
          },
          fail(err) {
            reject(err);
          },
        },
        context
      );
    });
  }

  static getSavedFileList() {
    return new Promise((resolve, reject) => {
      wx.getSavedFileList({
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }

  static compressImage(opts) {
    return new Promise((resolve, reject) => {
      wx.compressImage({
        ...opts,
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }

  static downloadFile(opts) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        ...opts,
        success: (res) => {
          resolve(res);
        },
        fail: (res) => {
          reject(res);
        },
      });
    });
  }

  static saveImageToPhotosAlbum(opts) {
    return new Promise((resolve, reject) => {
      wx.saveImageToPhotosAlbum({
        ...opts,
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }

  static getSystemInfo(opts) {
    return new Promise((resolve, reject) => {
      wx.getSystemInfo({
        ...opts,
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }

  static showModal(opts) {
    return new Promise((resolve, reject) => {
      wx.showModal({
        ...opts,
        title: opts.title || "对话框",
        content: opts.content || "这是一个模态弹窗",
        success(res) {
          if (res.confirm) {
            resolve();
          } else if (res.cancel) {
            reject();
          }
        },
      });
    });
  }

  static navigateBack(opts) {
    return new Promise((resolve, reject) => {
      wx.navigateBack({
        ...opts,
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }

  static getBackgroundAudioPlayerState() {
    return new Promise((resolve, reject) => {
      wx.getBackgroundAudioPlayerState({
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }

  static scanCode(opts) {
    return new Promise((resolve, reject) => {
      wx.scanCode({
        ...opts,
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }
}

module.exports = Wechat;