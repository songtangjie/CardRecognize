// pages/recognize/recognize.js

const idCollection = wx.cloud.database().collection("idcards");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    categories: ["身份证", "银行卡"],
    idInfo: null,
    bankInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type
    })
  },

  //点击选择
  selectClick: function () {
    //用户拍照选择照片
    wx.chooseImage({
      success: res => {
        const filePath = res.tempFilePaths[0];

        wx.showLoading({
          title: this.data.categories[this.data.type] + '识别中',
        })

        //照片上传到云存储
        this.uploadFileToCloud(filePath);
      }
    })
  },

  //上传图片到云端
  uploadFileToCloud: function (filePath) {
    const timestamp = new Date().getTime();
    wx.cloud.uploadFile({
      filePath,
      cloudPath: `images/openid_${timestamp}.jpg`
    }).then(res => {
      const fileID = res.fileID;
      //根据fileID换取临时url
      this.getTempURL(fileID);
    })
  },

  //获取临时url
  getTempURL: function(fileID) {
    wx.cloud.getTempFileURL({
      fileList: [fileID]
    }).then(res => {
      const fileURL = res.fileList[0].tempFileURL;
      //识别url
      thie.recognizeImageURL(fileURL, fileID);
    })
  },

  recognizeImageURL: function (fileURL, fileID) {
    // 服务器地址: 网络请求(将对应的域名在小程序后台进行配置)
    // npm -> wx-js-utils -> 5
    wx.cloud.callFunction({
      name: "recognizeCard",
      data: {
        fileURL,
        type: this.data.type
      }
    }).then(res => {
      this.data.type == 0 ? this.handleIDInfo(res, fileID) : this.handleBankInfo(res)
      wx.hideLoading();
    })
  },

  //处理银行卡信息
  handleBankInfo: function (res) {
    console.log(res)
  },

  //处理id信息
  handleIDInfo: function (res) {
    //调用失败
    if (!res.result.id) {
      this.deletePhoto(fileID);
      wx.showToast({
        title: '卡证识别失败',
        type: this.data.type
      })
      return;
    }

    //获取信息
    const result = res.result;
    const idInfo = {
      id: result.id,
      address: result.address,
      birth: result.birth,
      name: result.name,
      nation: result.nation,
      sex: result.sex,
      fileID: res.fileID
    }

    //展示信息
    this.setData({
      idInfo
    })
  },

  //点击保存信息
  saveClick: function () {
    wx.showLoading({
      title: '保存信息中',
    });


    //查询是否已经保存过信息
    idCollection.where({
      id: this.data.idInfo.id
    }).get().then(res => {
      if (res.data.length > 0) {
        const _id = res.data[0]._id;
        const fileID = res.data[0]._fileID;
        this.coverInfo(_id);
        this.deletePhoto(fileID);
      } else {
        this.saveInfo()
      }
    });

  },

  //删除照片
  deletePhoto: function(fileID) {
    wx.cloud.deleteFile({
      fileList: [fileList]
    })
  },

  //覆盖信息
  coverInfo: function (_id) {
    idCollection.doc(_id).set({
      data: this.data.idInfo
    })
    .then(this.showSuccess)
    .catch(this.showFail)
  },

  //保存信息
  saveInfo: function() {
    idCollection.add({
      data: this.data.idInfo
    })
    .then(this.showSuccess)
    .catch(this.showFail)
  },

  showSuccess: function () { 
    wx.showToast({
      title: '信息保存成功',
    })
  },

  showFail: function () {
    wx.showToast({
      title: '信息保存失败',
    })
  },

  //点击拷贝
  copyClick: function () {
    wx.setClipboardData({
      data: `${this.data.idInfo.id}`,
    })
  }
})