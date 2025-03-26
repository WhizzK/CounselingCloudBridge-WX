// pages/User/Information/Information.js
Page({
  data: {
    avatarUrl: '/images/用户.png', // 默认头像
    realName: '',
    age: '',
    gender: '男',
    occupation: '',
    genders: ['男', '女', '其他'],
    isSaving: false, // 防止重复提交
    userInfo: null // 存储从服务器获取的用户信息
  },

  onLoad() {
    this.loadUserInfo();
  },

  // 从服务器加载用户信息
  loadUserInfo() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });

    wx.request({
      url: 'https://your-api-domain.com/api/user/info',
      method: 'GET',
      header: {
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      success: (res) => {
        if (res.data.code === 0 && res.data.data) {
          const userInfo = res.data.data;
          this.setData({
            avatarUrl: userInfo.avatarUrl || this.data.avatarUrl,
            realName: userInfo.realName || '',
            age: userInfo.age || '',
            gender: userInfo.gender || '男',
            occupation: userInfo.occupation || '',
            userInfo: userInfo
          });
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  // 选择头像并上传
  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        wx.showLoading({
          title: '上传中...',
          mask: true
        });
        
        // 上传图片到服务器
        wx.uploadFile({
          url: 'https://your-api-domain.com/api/upload/avatar',
          filePath: tempFilePath,
          name: 'file',
          header: {
            'Authorization': `Bearer ${wx.getStorageSync('token')}`
          },
          success: (uploadRes) => {
            const resData = JSON.parse(uploadRes.data);
            if (resData.code === 0) {
              this.setData({
                avatarUrl: resData.data.url
              });
              wx.showToast({
                title: '头像上传成功',
                icon: 'success'
              });
            } else {
              wx.showToast({
                title: resData.message || '头像上传失败',
                icon: 'none'
              });
            }
          },
          fail: (err) => {
            wx.showToast({
              title: '上传失败，请重试',
              icon: 'none'
            });
          },
          complete: () => {
            wx.hideLoading();
          }
        });
      }
    });
  },

  // 输入真实姓名
  inputRealName(e) {
    this.setData({
      realName: e.detail.value.trim()
    });
  },

  // 输入年龄
  inputAge(e) {
    const value = e.detail.value.replace(/[^0-9]/g, '');
    this.setData({
      age: value
    });
  },

  // 选择性别
  changeGender(e) {
    const index = e.detail.value;
    this.setData({
      gender: this.data.genders[index]
    });
  },

  // 输入职业
  inputOccupation(e) {
    this.setData({
      occupation: e.detail.value.trim()
    });
  },

  // 验证表单数据
  validateForm() {
    const { realName, age, occupation } = this.data;
    
    if (!realName) {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'none'
      });
      return false;
    }
    
    if (realName.length < 2 || realName.length > 20) {
      wx.showToast({
        title: '姓名长度2-20个字符',
        icon: 'none'
      });
      return false;
    }
    
    if (age && (age < 1 || age > 120)) {
      wx.showToast({
        title: '请输入有效年龄(1-120)',
        icon: 'none'
      });
      return false;
    }
    
    if (occupation && occupation.length > 50) {
      wx.showToast({
        title: '职业长度不能超过50个字符',
        icon: 'none'
      });
      return false;
    }
    
    return true;
  },

  // 保存信息到服务器
  saveInfo() {
    if (this.data.isSaving) return;
    if (!this.validateForm()) return;
    
    this.setData({ isSaving: true });
    
    const { avatarUrl, realName, age, gender, occupation } = this.data;
    const data = {
      avatarUrl,
      realName,
      gender,
      occupation
    };
    
    if (age) data.age = parseInt(age);
    
    wx.showLoading({
      title: '保存中...',
      mask: true
    });
    
    wx.request({
      url: 'https://your-api-domain.com/api/user/info',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      data: data,
      success: (res) => {
        if (res.data.code === 0) {
          wx.showToast({
            title: '保存成功',
            icon: 'success'
          });
          // 更新本地存储
          wx.setStorageSync('userInfo', data);
          // 更新全局用户信息
          getApp().globalData.userInfo = data;
        } else {
          wx.showToast({
            title: res.data.message || '保存失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
      },
      complete: () => {
        wx.hideLoading();
        this.setData({ isSaving: false });
      }
    });
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