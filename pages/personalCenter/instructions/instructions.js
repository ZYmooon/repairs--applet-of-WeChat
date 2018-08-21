let app = getApp();
let serverUrl = require('../../../utils/util.js');
Page({
  data: {
    tabBar: {},
    max: 500,
    instructions:''
  },
  onLoad:function(){
    let that = this
    app.ajax({
      url: serverUrl.instructions,
      method:'GET',
      data:{
        key: wx.getStorageSync('key')
      },
      success: function success(res){
        that.setData({
          instructions: res.data.data.instructions
        })
      }
    })
  }
})
