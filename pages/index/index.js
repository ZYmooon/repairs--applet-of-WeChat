//index.js
//获取应用实例
let serverUrl = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    isLogin: false, //登陆态
    imgNum: 0, //显示的照片数量
    imgArr: [], //照片列表
    isimg: 0, //是否有照片
    isUser: false, //有权限
    noUser: false, //无权限
    isAuthority: false, //红色提示
    inputName: '', //输入的名字
    inputPhone: '', //输入的电话
    inputFacility: '', //输入的设备
    inputQuery: '', //输入的问题
    contentVal: '', //报修内容
    queryShow: false, //控制问题下拉列表的显示隐藏，false隐藏、true显示
    facilityShow: false, //控制设备下拉列表的显示隐藏，false隐藏、true显示
    selectFacility: [], //下拉设备列表的数据
    selectQueryList: [], //下拉问题列表的数据
    queryIndex: 0, //选择问题的下拉列表下标,
    facilityIndex: 0, //选择设备的下拉列表下标
    facility_id: 0,
    selectFacilityVal: '',
    selectQueryArr: [],
    hiddenTextarea: true,
    urlArr: [],
    classId: '', //班级id
    queryVal: {},
    checked: false,
    className:''
  },
  scanCode: function () {
    let that = this
    wx.scanCode({
      success: function (res) {
        console.log('res', res)
        let id = res.path.split('=')[1];
        console.log('id', id);
        that.setData({
          classId: id
        })
        that.getFacility()
      } 
    })
  },
  onLoad(options) {
    let that = this;
    if (!options.scene) return
    else {
      this.setData({
        classId: options.scene
      })
    }
    return
    app.Login()
      .then((res) => {
        that.setData({ // 维护登录态
          isLogin: wx.getStorageSync('isLogin')
        })
        that.getFacility()
      })
      .catch((err) => {
        console.log(err)
      })
  },
  bindGetUserInfo: function() { // 维护登录态
    let that = this;
    app.Login()
      .then(function(res) {
        that.setData({
          isLogin: wx.getStorageSync('isLogin')
        })
        that.getFacility(); // 获取数据
      })
      .catch(function(err) {})
  },
  //获取设备
  getFacility: function() {
    let that = this
    app.ajax({
      url: serverUrl.index,
      method: 'GET',
      data: {
        key: wx.getStorageSync('key'),
        class_id: that.data.classId 
      },
      success: function success(res) {
        let facility = res.data.data.facility
        let target = {};
        for (let item of facility) {
          if (item.id == that.data.smID) {
            target = item
          }
        }
        if (!res.data.data.class.name){
          wx.showModal({
            title: '提示',
            content: '未获取到班级信息，请点击"扫码获取班级"，扫码班级二维码',
          })
        }
        that.setData({
          selectFacility: facility,
          className: res.data.data.class ? res.data.data.class.name:''
        })
      },
      fail: function fail(err) {
        console.log(err)
      },
    })
    return
  },
  inputBlur: function(e) {
    let that = this
    app.ajax({
      url: serverUrl.checkName,
      method: 'GET',
      data: {
        key: wx.getStorageSync('key'),
        name: e.detail.value,
      },
      success: function success(res) {
        console.log(res.data)
        if (res.data.msg === 1) {
          that.setData({
            isUser: true,
            isAuthority: false
          })
        }
        if (res.data.msg === 0) {
          that.setData({
            noUser: true, //无权限
            isAuthority: true, //红色提示
            isUser: false
          })
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  formSubmit: function(e) { //表单提交
    let that = this;
    let value = e.detail.value
    let inputName = value.name;
    let inputPhone = value.phone;
    let inputContent = value.content
    let facilityId = this.data.facility_id
    let query = this.data.selectQueryList
    let imgArr = this.data.imgArr
    let inputQuery = value.query
    let class_id = that.data.classId
    if (!inputName) {
      console.log('请输入用户名')
      wx.showModal({
        title: '提示',
        content: '姓名不得为空!',
        cancelText: "取消",
        confirmText: "确认",
      })
      return
    }
    if (!inputPhone || inputPhone.length<11) {
      console.log('请输入用户名')
      wx.showModal({
        title: '提示',
        content: '请输入正确号码',
        cancelText: "取消",
        confirmText: "确认",
      })
      return
    }

    if (!inputContent || inputContent === '') {
      console.log('请输入报修内容')
      wx.showModal({
        title: '提示',
        content: '请输入报修内容!',
        cancelText: "取消",
        confirmText: "确认",
      })
      return
    }
    app.ajax({
      url: serverUrl.mend,
      method: 'POST',
      data: {
        key: wx.getStorageSync('key'),
        name: inputName,
        phone: inputPhone,
        facility_id: facilityId,
        query: inputQuery,
        mend_ps: inputContent,
        pictures: that.data.urlArr,
        class_id
      },
      success: function success(res) {
        if (res.data.msg === 0) {
          wx.showModal({
            title: '提示',
            content: '您的输入有误,请重新输入',
          })
          that.setData({
            noUser: true, //用户无权限
            isAuthority: true, //红色提示
          })
        }
        if (res.data.msg === 1) {
          wx.showToast({
            title: '您已经提交成功',
          })
          //清空表单
          that.setData({
            noUser: false, //无权限
            isAuthority: false, //红色提示
            isUser: false,
            inputName: '',
            inputPhone: '',
            selectFacilityVal: '',
            selectQueryArr: '',
            contentVal: '',
            imgArr: [],
            imgNum: 0,
            checked: false,
            selectQueryArr: [],
            queryVal: {},
            className:''
          })
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/repairs/repairs',
            })
          }, 3000)
        }
        
      },
      fail: function fail(err) {
        console.log(err)
      },
    })
  },
  //清空姓名
  clearName: function(e) {
    this.setData({
      inputName: '',
      isAuthority: false
    })
  },
  // 点击报修设备下拉显示框
  selectFacilityTap(e) {
    let facilityShow = e.currentTarget.dataset.facilityshow;
    if (facilityShow) {
      this.setData({
        facilityShow: false,
        hiddenTextarea: true
      })
    } else {
      this.setData({
        facilityShow: true,
        queryShow: false,
        hiddenTextarea: false
      })
    }
  },
  // 点击设备下拉列表
  optionFacilityTap(e) {
    let id = e.currentTarget.dataset.id
    let facilityIndex = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    let selectFacility = this.data.selectFacility;
    let item = selectFacility[facilityIndex];
    let name = item.name;
    let that = this;
    
    this.setData({
      facility_id: id,
      facilityIndex: facilityIndex,
      selectFacilityVal: name,
      facilityShow: !this.data.facilityShow,
      hiddenTextarea: this.data.facilityShow,
      selectQueryArr: [],
      checked: false,
    });

  },
  // 点击报修问题下拉显示框
  selectQueryTap(e) {
    let that = this
    if (!that.data.selectFacilityVal) {
      wx.showModal({
        title: '提示',
        content: '请先选择报修设备',
      })
    } else {
      app.ajax({
        url: serverUrl.query,
        method: 'GET',
        data: {
          key: wx.getStorageSync('key'),
          facility_id: that.data.facility_id
        },
        success: function success(res) {
          let query = res.data.data
          console.log(query)
          that.setData({
            selectQueryList: query
          })
        }
      })
      this.setData({
        queryShow: !this.data.queryShow,
        hiddenTextarea: this.data.queryShow,
      })
    }
  },
  // 点击问题下拉列表
  optionQueryTap(e) {
    let queryVal = e.detail.value
    let queryArr = []
    queryArr += queryVal
    console.log(queryArr)
    this.setData({
      selectQueryArr: queryArr,
      queryShow: true
    })
  },
  // 添加图片
  addImg(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    wx.chooseImage({
      count: 5 - that.data.imgArr.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: serverUrl.upload,
          filePath: tempFilePaths[0],
          name: 'file[]',
          formData: {
            key: wx.getStorageSync('key'),
          },
          success(res) {
            let urlArr = that.data.urlArr;
            let resImgData = JSON.parse(res.data);
            let imgUrl = resImgData.dat
            console.log(resImgData.data[0])
            urlArr.push(resImgData.data[0])
            let num = that.data.imgNum
            num += tempFilePaths.length
            that.setData({
              urlArr: urlArr,
              imgNum: num
            })
          },
          fail: function fail(err) {
            console.log(err)
          }
        })
        let imgArr = that.data.imgArr;
        imgArr = imgArr.concat(tempFilePaths);
        that.setData({
          imgArr
        })
      }
    })

  },
  // 删除图片
  closeimg(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let imgArr = this.data.imgArr;
    let imgNum = index
    let urlArr = this.data.urlArr;
    urlArr.splice(index, 1)
    imgArr.splice(index, 1)
    this.setData({
      urlArr: urlArr,
      imgNum: imgArr.length,
      imgArr
    })
  },
})