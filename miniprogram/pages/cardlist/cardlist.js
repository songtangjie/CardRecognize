// miniprogram/pages/cardlist/cardlist.js
const LIMIT = 10;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    pahe: 0,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取类型
    this.setData({
      type: options.type
    })

    //数据库查询数据
    this.queryDataFromDB()
  },

  //查询数据
  queryDataFromDB: function() {
    const collectionName = this.data.type == 0 ? "idcards" : "bankcards";
    wx.cloud.database().collection(collectionName)
    .skip(this.data.page * LIMIT).limit(LIMIT)
    .get()
    .then(res => {
      //页码+1
      this.setData({
        page: this.data.page + 1
      })

      //添加数据到数组里
      const oldList = this.data.list;
      oldList.push(...res.data);
      this.setData({list: oldList})
    })
  },

  //复制操作
  copyClick: function (event) {
    const index = event.currentTarget.dataset.index;
    wx.setClipboardData({
      data: this.data.list[index].id,
      success: () => {
        wx.showToast({
          title: '信息复制成功',
        })
      }
    })
  },

  //删除操作
  deleteClick: function (event) {
    const index = event.currentTarget.dataset.index;
    //删除数据库信息
    const _id = this.data.list[index]._id;
    wx.cloud.database().collection("idcards")
    .doc(_id)
    .remove()
    .then(res => {
      const oldList = this.data.list;
      oldList.splice(index, 1);
      this.setData({list: oldList});
      wx.showToast({
        title: '删除信息成功',
      })
    })
  }
})