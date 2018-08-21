let baseUrl = 'https://wx.dbcreator.cn/api';

let serverUrl = {
  query: baseUrl + '/index/query',
  login: baseUrl + '/index/login', // 登录
  upload: baseUrl + '/index/upload', // 上传文件
  index: baseUrl + '/index/index', //获取设备
  mend: baseUrl + '/index/mend', //提交报修
  mends: baseUrl + '/index/mends', //报修列表
  phone: baseUrl + '/index/phone', //获取报修电话
  instructions: baseUrl + '/index/instructions', //使用说明
  feedback: baseUrl + '/index/feedback', //反馈意见
  checkName: baseUrl + '/index/checkName', //检测用户名
}

module.exports = serverUrl