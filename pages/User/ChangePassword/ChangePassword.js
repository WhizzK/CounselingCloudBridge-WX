// pages/User/ChangePassword/ChangePassword.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    showOldPassword: false, // 控制旧密码显示状态
    showNewPassword: false, // 控制新密码显示状态
    showConfirmPassword: false // 控制确认密码显示状态
  },

  onInputChange: function (e) {
    const { name } = e.currentTarget.dataset;
    this.setData({
      [name]: e.detail.value
    });
  },

  // 切换密码显示状态
  togglePassword: function (e) {
    const { type } = e.currentTarget.dataset;
    this.setData({
      [`show${type.charAt(0).toUpperCase() + type.slice(1)}`]: !this.data[`show${type.charAt(0).toUpperCase() + type.slice(1)}`]
    });
  },
  
  onSubmit: function (e) {
    const { oldPassword, newPassword, confirmPassword } = e.detail.value;

    if (!oldPassword || !newPassword || !confirmPassword) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      wx.showToast({
        title: '两次输入的新密码不一致',
        icon: 'none'
      });
      return;
    }

    // 这里可以调用后端接口提交修改密码的请求
    wx.request({
      url: '',
      method: 'POST',
      data: {
        oldPassword,
        newPassword
      },
      success: function (res) {
        if (res.data.success) {
          wx.showToast({
            title: '密码修改成功',
            icon: 'success'
          });
          wx.navigateBack();
        } else {
          wx.showToast({
            title: res.data.message || '密码修改失败',
            icon: 'none'
          });
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
      }
    });
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

  }
})