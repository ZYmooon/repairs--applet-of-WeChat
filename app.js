//app.js
let serverUrl = require('/utils/util.js')
App({
  globalData: {},

  Login: function() {
    let that = this
    return new Promise(function(resolve,reject){
      wx.getUserInfo({
        withCredentials: true,
        lang: 'zh_CN',
        success(res){
          console.log(res)
          let name = res.userInfo.nickName
          let avatar = res.userInfo.avatarUrl
          console.log(name, avatar)
          wx.login({
            success(res) {
              let code = res.code
              that.ajax({
                url: serverUrl.login,
                data: {
                  code: code,
                  username: name,
                  avatar: avatar
                },
                success(res) {
                  let key = res.data.data.key
                  wx.setStorageSync('key', key)
                  wx.setStorageSync('isLogin', true); // 保存登录态
                  resolve(res)
                },
                fail(err){
                  wx.clearStorage();
                  wx.showToast({
                    title: '请重新打开应用',
                  })
                  wx.setStorageSync('isLogin', false); // 保存登录态
                  reject('刷新重试');
                },
                complete: function () {
                  wx.hideLoading();
                }
              })
            }
          })
        },
        fail:function (err){
          console.log(res)
          // 调用微信弹窗授权接口
          getApp().auth_check();
          reject('重新登录');
        }
      })
    })
  },
  ajax: function ajax(obj) {
    var that = this;
    wx.showLoading({
      title: 'loading'
    });
    wx.request({
      url: obj.url || serverUrl.login,
      method: obj.method || 'POST',
      data: obj.data || {},
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': wx.getStorageSync('sessionid')
        //'content-type': obj.header || 'application/json'
      },
      success: obj.success || function() {
        console.log('未传入success回调函数');
      },
      fail: obj.fail || function(err) {
        console.log('未传入fail回调函数,err:' + err.errMsg);
      },
      complete: obj.complete || function (res) {
        // sessionId 失效
        wx.hideLoading();
        if (res.data.code === 404) {
          console.log('error:', res)
        }
      }
    });
  },
  auth_check: function () {
    wx.getSetting({
      success(res) {
        let userScope = wx.getStorageSync('userScope'); // 用户拒绝一次授权后标记已拒绝，同时显示刷新页面重新授权提示
        if (!userScope && res.authSetting["scope.userInfo"] == false) {
          wx.openSetting({
            success: (res) => {
              wx.setStorageSync('userScope', true);
            }
          })
        } else {
          if (wx.getStorageSync('userScope')) { // 二次拒绝 -> 弹窗
            wx.showToast({
              title: '请刷新重试',
            })
          } else {
            // 清除缓存
            wx.clearStorage();
          }
        }
      }
    })
  },
})