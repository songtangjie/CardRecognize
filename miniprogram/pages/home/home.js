// miniprogram/pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [
      { title: "身份证", icon: "/assets/zhengjian.png" },
      { title: "银行卡", icon: "/assets/yhk.png" }
    ],
    categoriesNames: [
    ],
  },
  pickValueChange: function(event) {
    //获取选中类型
    const type = event.detail.value;
    //跳转下个页面识别
    wx.navigateTo({
      url: `/pages/recognize/recognize?type=${type}`,
    })
  }
})