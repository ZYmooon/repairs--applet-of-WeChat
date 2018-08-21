let app = getApp();
let serverUrl = require('../../../utils/util.js');
Page({
  data: {
    tabbar: {},
    isShowModal: false,
    maxNum: 500,
    contentVal: '',
  },
  onLoad: function() {

  },
  jscontent(e) {
    let content = e.detail.value
    this.setData({
      contentVal: content
    })
  },
  submitTab: function(e) {
    let that = this;
    if (!this.data.contentVal || this.data.contentVal.length <= 6) {
      wx.showModal({
        title: '提示',
        content: '您反馈的内容过少，请重新输入',
      })
    } else {
      app.ajax({
        url: serverUrl.feedback,
        data: {
          key: wx.getStorageSync('key'),
          content: that.data.contentVal
        },
        success: function success(res) {
          console.log(res)
        },
        fail: function fail(err) {
          console.log(err)
        }
      })
      that.setData({
        isShowModal: true
      })
      setTimeout(function() {
        that.setData({
          isShowModal: false
        })
      }, 1000)
      setTimeout(function() {
        wx.switchTab({
          url: '/pages/personalCenter/personalCenter',
        })
      }, 2000)
    }
  }
})