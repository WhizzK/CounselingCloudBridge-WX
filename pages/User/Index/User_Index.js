Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoggedIn: false,
    UserName: "测试用户"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  handleTapLogin() {
    wx.navigateTo({
      url: '/pages/User/Login/Login'
    })
  },
  handleTapInformation() {
    wx.navigateTo({
      url: '/pages/User/Information/Information'
    })
  },
  handleTapSetting() {
    if (this.data.isLoggedIn) { //后续可能需要换成缓存的
      wx.navigateTo({
        url: '/pages/User/AccountSetting/AccountSetting'
      })
    } else {
      wx.showModal({
        title: '未登录',
        content: '需要登录后才能继续操作',
        confirmText: '去登录',
        success(res) {
          if (res.confirm) {
            // 用户点击了"去登录"
            wx.navigateTo({
              url: '/pages/User/Login/Login' // 替换为你的登录页面路径
            })
          }
        }
      })
    }
  },
  handleTapRecord() {
    if (this.data.isLoggedIn) { //后续可能需要换成缓存的
      wx.navigateTo({
        url: '/pages/User/CounselingRecord/CounselingRecord'
      })
    } else {
      wx.showModal({
        title: '未登录',
        content: '需要登录后才能继续操作',
        confirmText: '去登录',
        success(res) {
          if (res.confirm) {
            // 用户点击了"去登录"
            wx.navigateTo({
              url: '/pages/User/Login/Login' // 替换为你的登录页面路径
            })
          }
        }
      })
    }
  }
})