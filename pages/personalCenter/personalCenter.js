let app = getApp();
let serverUrl = require('../../utils/util.js');
Page({
  data: {
    phone:''
  },
  onPhoneTap:function(e){
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
      success(res){
        console.log('电话拨打成功')
      },
      fail(err){
        console.log('电话拨打失败')
      }
    })
  },
  onLoad: function (options) {
    let that = this
    app.ajax({
      url: serverUrl.phone,
      data: {
        key: wx.getStorageSync('key')
      },
      success: function success(res) {
        console.log(res.data.data.phone)
        let phone = res.data.data.phone
        that.setData({
          phone: phone
        })
      }
    })
  },
  onInstructionsTap: (e) => {
    wx.navigateTo({
      url: 'instructions/instructions',
    })
  },
  onFeedbackTap: (e) => {
    wx.navigateTo({
      url: 'feedback/feedback',
    })
  },
})