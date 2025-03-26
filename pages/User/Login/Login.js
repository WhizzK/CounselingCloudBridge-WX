Page({
  data: {
    isLoggedIn: false,        // 控制登录状态
    tempUserInfo: {},         // 临时存储用户信息
    formData: {               // 新增表单数据绑定
      phone: '',
      password: ''
    },
    isLogging: false          // 防止重复提交
  },

  // 手机号输入处理
  handlePhoneInput(e) {
    this.setData({
      'formData.phone': e.detail.value.trim()
    })
  },

  // 密码输入处理
  handlePasswordInput(e) {
    this.setData({
      'formData.password': e.detail.value.trim()
    })
  },

  // 微信登录
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: res => {
        this.setData({
          tempUserInfo: res.userInfo,
          isLoggedIn: true
        })
        // 存储用户信息
        wx.setStorageSync('userInfo', res.userInfo)
        // 1.5秒后自动返回
        setTimeout(() => wx.navigateBack(), 1500)
      }
    })
  },

  // 手机号登录（原有逻辑）
  // 表单验证
  validateForm() {
    const { phone, password } = this.data.formData
    
    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return false
    }
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return false
    }
    
    if (!password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return false
    }
    
    if (password.length < 6) {
      wx.showToast({
        title: '密码长度不能少于6位',
        icon: 'none'
      })
      return false
    }
    
    return true
  },

  // 真实登录逻辑
  async handleLogin() {
    // 防止重复提交
    if (this.data.isLogging) return
    this.setData({ isLogging: true })
    
    // 表单验证
    if (!this.validateForm()) {
      this.setData({ isLogging: false })
      return
    }
    
    const { phone, password } = this.data.formData
    
    try {
      wx.showLoading({
        title: '登录中...',
        mask: true
      })
      
      // 调用登录接口
      const loginRes = await wx.request({
        url: 'https://your-api-domain.com/auth/login',
        method: 'POST',
        data: {
          phone,
          password
        },
        header: {
          'content-type': 'application/json'
        }
      })
      
      wx.hideLoading()
      
      // 处理登录结果
      if (loginRes.statusCode === 200 && loginRes.data.code === 0) {
        // 登录成功
        const { token, userInfo } = loginRes.data.data
        
        // 存储token和用户信息
        wx.setStorageSync('token', token)
        wx.setStorageSync('userInfo', userInfo)
        
        // 更新全局登录状态
        getApp().globalData.isLoggedIn = true
        getApp().globalData.userInfo = userInfo
        
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        })
        
        // 跳转回原页面或首页
        setTimeout(() => {
          const pages = getCurrentPages()
          if (pages.length >= 2) {
            wx.navigateBack()
          } else {
            wx.switchTab({
              url: '/pages/Default/Index'
            })
          }
        }, 1500)
      } else {
        // 登录失败
        const errorMsg = loginRes.data?.message || '登录失败，请稍后重试'
        wx.showToast({
          title: errorMsg,
          icon: 'none'
        })
      }
    } catch (error) {
      wx.hideLoading()
      wx.showToast({
        title: '网络错误，请检查网络连接',
        icon: 'none'
      })
      console.error('登录出错:', error)
    } finally {
      this.setData({ isLogging: false })
    }
  },

  handleRegister(){
    wx.navigateTo({
      url: '/pages/User/Register/Register'
    })
  },

  handleForgetPassword(){
    wx.navigateTo({
      url: '/pages/User/ResetPassword/ResetPassword'
    })
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