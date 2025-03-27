// pages/User/ResetPassword/ResetPassword.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: '',
    captcha: '', // 用户输入的验证码
    serverCaptcha: '', // 后端返回的验证码
    isSending: false, // 是否正在发送验证码
    newPassword: '',
    confirmPassword: '',
    showNewPassword: false, // 控制新密码显示状态
    showConfirmPassword: false // 控制确认密码显示状态
  },

  // 输入框内容变化事件
  onInputChange(e) {
    const name = e.currentTarget.dataset.name;
    const value = e.detail.value;
    this.setData({ [name]: value });
  },

  // 发送验证码
  sendCaptcha() {
    const { phoneNumber } = this.data;

    // 校验手机号格式
    if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
      wx.showToast({
        title: '请输入有效的手机号',
        icon: 'none',
      });
      return;
    }

    // 模拟发送验证码到后端
    this.setData({ isSending: true });
    setTimeout(() => {
      const serverCaptcha = Math.floor(100000 + Math.random() * 900000).toString(); // 生成6位随机验证码
      this.setData({ serverCaptcha, isSending: false });

      // 模拟短信发送成功提示
      wx.showToast({
        title: '验证码已发送',
        icon: 'success',
      });
    }, 2000); // 模拟2秒延迟
  },

  // 切换密码显示状态
  togglePassword: function (e) {
    const { type } = e.currentTarget.dataset;
    this.setData({
      [`show${type.charAt(0).toUpperCase() + type.slice(1)}`]: !this.data[`show${type.charAt(0).toUpperCase() + type.slice(1)}`]
    });
  },
  
  // 表单提交事件
  onSubmit(e) {
    const { captcha, serverCaptcha, phoneNumber, newPassword, confirmPassword } = this.data;

    // 校验验证码
    if (captcha !== serverCaptcha) {
      wx.showToast({
        title: '验证码错误',
        icon: 'none',
      });
      return;
    }

    // 校验其他字段
    if (!phoneNumber || !newPassword || !confirmPassword) {
      wx.showToast({
        title: '请填写所有字段',
        icon: 'none',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      wx.showToast({
        title: '两次输入的密码不一致',
        icon: 'none',
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