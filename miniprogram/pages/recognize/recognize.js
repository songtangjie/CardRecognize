// pages/recognize/recognize.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    categories: ["选择身份证", "选择银行卡"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type
    })
  },


  selectClick: function () {
    //用户拍照选择照片
    wx.chooseImage({
      success: res => {
        const filePath = res.tempFilePaths[0];

        //照片上传到云存储
        this.uploadFileToCloud(filePath);
      }
    })
  },

  
  uploadFileToCloud: function(filePath) {
    const timestamp = new Date().getTime();
    wx.cloud.uploadFile({
      filePath,
      cloudPath: `images/openid_${timestamp}.jpg`
    }).then(res => {
      const fileID = res.fileID;
    })
  },

  saveClick: function () {

  },

  copyClick: function () {

  }
})