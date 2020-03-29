// miniprogram/pages/home/childCpns/s-card-category/s-card-category.js
Component({
  properties: {
    categories: {
      type: Array,
      value: []
    }
  },


  /**
   * 页面的初始数据
   */
  data: {

  },

  methods: {
    itemClick: function(event) {
      //获取index
      const index = event.currentTarget.dataset.index;

      wx.navigateTo({
        url: '/pages/cardlist/cardlist?type=' + index,
      })
    }
  }

})