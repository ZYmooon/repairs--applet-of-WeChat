let serverUrl = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    winHeight: 0, //窗口高度,用变量来决定高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    submitTime: '', //提交时间
    responseTime: '', //响应时间
    completeTime: '', //完成时间
    facilityName: '', //设备名称
    loadNum: 0, // 加载次数
    repairs: '',
    list1:[],
    list2: [],
    list3: [],
    pageAdd:0

  },
  onShow(){
   this.setData({
     currentTab:0
   })
  },
  onLoad: function(options) {
    let that = this;
    app.ajax({
      url: serverUrl.mends,
      method: 'GET',
      data: {
        key: wx.getStorageSync('key'),
        status: 1,
        page: 1,
      },
      success(res) {
        let item = res.data.data.total
        let data = res.data.data.data
        let page = res.data.data.per_page
        that.setData({
          repairs: '报修设备',
          list1: data,       
        })
        console.log('startlist1', that.data.list1)
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  clickTabA(e){
    let that = this;
    app.ajax({
      url: serverUrl.mends,
      method: 'GET',
      data: {
        key: wx.getStorageSync('key'),
        status: 1,
        page: 1,
      },
      success(res) {
        console.log(res.data)
        let item = res.data.data.total
        let data = res.data.data.data
        let page = res.data.data.per_page
        console.log(res.data)
        that.setData({
          repairs: '报修设备',
          list1: data,
          currentTab: 0
        })
        console.log('list1', that.data.list1)
      },
      fail(err) {
        console.log(err)
      }
    })
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })     
    }
  },
  clickTabB(e) {
    let that = this;
    app.ajax({
      url: serverUrl.mends,
      method: 'GET',
      data: {
        key: wx.getStorageSync('key'),
        status: 2,
        page: 1,
      },
      success(res2) {
        console.log(res2)
        let item2 = res2.data.data.data
        console.log(item2)
        let page2 = res2.data.data.per_page
        that.setData({
          repairs: '报修设备',
          list2: item2,
          currentTab: 1
        })
      },
      fail(err) {
        console.log(err)
      }
    })
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  clickTabC(e) {
    let that = this;
    app.ajax({
      url: serverUrl.mends,
      method: 'GET',
      data: {
        key: wx.getStorageSync('key'),
        status: 3,
        page: 1,
      },
      success(res3) {
        let item3 = res3.data.data.data
        let data3 = res3.data.data.data
        let page3 = res3.data.data.per_page
        that.setData({
          repairs: '报修设备',
          list3: item3,
          currentTab: 2
        })
      },
      fail(err) {
        console.log(err)
      }
    })
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  // clickTab: function(e) {
  //   var that = this;
  //   if (this.data.currentTab === e.target.dataset.current) {
  //     return false;
  //   } else {
  //     that.setData({
  //       currentTab: e.target.dataset.current
  //     })
  //   }
  // },
  onReachBottom:function(){
    var that = this;
    console.log(111)
    if (this.data.currentTab === 0){
      app.ajax({
        url: serverUrl.mends,
        method: 'GET',
        data: {
          key: wx.getStorageSync('key'),
          status: 1,
          page: that.data.pageAdd+=1,
        },
        success(res) {
          console.log(res.data)
          let item = res.data.data.total
          let data = res.data.data.data
          let page = res.data.data.per_page
          console.log(res.data)
          that.setData({
            repairs: '报修设备',
            list1: res.data.data.data.concat(that.data.list1),
            list2: data,
            list3: data,
          })
          console.log('list1', that.data.list1)
        },
        fail(err) {
          console.log(err)
        }
      })
    }
  }
})