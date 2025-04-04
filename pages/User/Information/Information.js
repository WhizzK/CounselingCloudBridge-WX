// pages/User/Information/Information.js
const app = getApp();

Page({
  data: {
    avatarUrl: '/images/用户.png', // 默认头像
    realName: '',
    age: 0, // 接口要求必填，默认设为0
    gender: '',
    occupation: '',
    genders: ['male', 'female', 'other'],
    isSaving: false,
    userInfo: null,
    tempAvatarPath: null // 临时存储选择的头像文件路径
  },

  onLoad() {
    this.checkTokenAndLoad();
  },

  // 检查token并加载数据
  checkTokenAndLoad() {
    try {
      const token = wx.getStorageSync('token');
      if (!token) {
        this.showLoginModal();
        return;
      }
      this.loadUserInfo();
    } catch (e) {
      console.error('获取token失败', e);
      this.showLoginModal();
    }
  },

  // 显示登录提示模态框
  showLoginModal() {
    wx.showModal({
      title: '未登录',
      content: '需要登录后才能查看个人信息',
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/User/Login/Login'
          });
        } else {
          wx.navigateBack();
        }
      }
    });
  },

  // 从服务器加载用户信息
  loadUserInfo() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    const token = wx.getStorageSync('token');
    wx.request({
      url: app.globalData.host + '/api/user/info',
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 1) {
          const userInfo = res.data.data;
          this.setData({
            avatarUrl: userInfo.avatarUrl || this.data.avatarUrl,
            realName: userInfo.realName || '',
            age: userInfo.age || 0,
            gender: userInfo.gender,
            occupation: userInfo.occupation || '',
            userInfo: userInfo
          });
        } else {
          wx.showToast({
            title: res.data.msg || '获取信息失败',
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
      }
    });
  },

  // 选择头像
  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          tempAvatarPath: res.tempFilePaths[0], // 存储临时文件路径
          avatarUrl: res.tempFilePaths[0] // 本地预览
        });
      }
    });
  },

  // 输入处理函数
  inputRealName(e) {
    this.setData({ realName: e.detail.value.trim() });
  },

  inputAge(e) {
    const value = e.detail.value.replace(/[^0-9]/g, '');
    this.setData({ age: value ? parseInt(value) : 0 });
  },

  changeGender(e) {
    this.setData({ gender: this.data.genders[e.detail.value] });
  },

  inputOccupation(e) {
    this.setData({ occupation: e.detail.value.trim() });
  },

  // 表单验证
  validateForm() {
    const { realName, age } = this.data;
    
    if (!realName) {
      wx.showToast({ title: '请输入真实姓名', icon: 'none' });
      return false;
    }
    
    if (realName.length < 2 || realName.length > 20) {
      wx.showToast({ title: '姓名长度2-20个字符', icon: 'none' });
      return false;
    }
    
    if (age < 0 || age > 120) {
      wx.showToast({ title: '请输入有效年龄(0-120)', icon: 'none' });
      return false;
    }
    
    return true;
  },

  // 保存所有信息（使用FormData一次性提交）
  saveInfo() {
    if (this.data.isSaving || !this.validateForm()) return;
    
    this.setData({ isSaving: true });
    wx.showLoading({ title: '保存中...', mask: true });

    const { tempAvatarPath, avatarUrl, realName, age, gender, occupation } = this.data;

    const token = wx.getStorageSync('token');
    
    if (tempAvatarPath) {
      // 有新头像时，使用wx.uploadFile提交FormData
      const formData = {
        realName,
        age,
        gender,
        occupation
      };
      
      // 如果已有远程头像URL且没有新选择头像，则传原URL
      if (!tempAvatarPath && avatarUrl && avatarUrl.startsWith('http')) {
        formData.avatarUrl = avatarUrl;
      }

      wx.uploadFile({
        url: app.globalData.host + '/api/user/info',
        filePath: tempAvatarPath,
        name: 'avatar', // 文件字段名，需与后端一致
        formData: formData,
        header: {
          'token': token
        },
        success: (res) => {
          this.handleSaveResponse(res);
        },
        fail: (err) => {
          wx.showToast({ title: '网络错误，请重试', icon: 'none' });
        },
        complete: () => {
          wx.hideLoading();
          this.setData({ isSaving: false, tempAvatarPath: null });
        }
      });
    } else {
      // 没有新头像时，使用wx.request提交普通JSON
      wx.request({
        url: app.globalData.host + '/api/user/info',
        method: 'PUT',
        header: {
          'Content-Type': 'application/json',
          'token': token
        },
        data: {
          avatarUrl: avatarUrl.startsWith('http') ? avatarUrl : '', // 确保有值
          realName,
          age,
          gender,
          occupation
        },
        success: (res) => {
          this.handleSaveResponse(res);
        },
        fail: (err) => {
          wx.showToast({ title: '网络错误，请重试', icon: 'none' });
        },
        complete: () => {
          wx.hideLoading();
          this.setData({ isSaving: false });
        }
      });
    }
  },

  // 处理保存响应
  handleSaveResponse(res) {
    let resData = res.data;
    // 处理uploadFile返回的字符串数据
    if (typeof resData === 'string') {
      try {
        resData = JSON.parse(resData);
      } catch (e) {
        console.error('解析响应数据失败', e);
        wx.showToast({ title: '数据处理失败', icon: 'none' });
        return;
      }
    }

    if (res.statusCode === 200 && resData.code === 1) {
      wx.showToast({ title: '保存成功', icon: 'success' });
      
      // 更新本地数据
      const updatedInfo = {
        ...this.data.userInfo,
        ...resData.data,
        avatarUrl: resData.data.avatarUrl || this.data.avatarUrl
      };
      
      this.setData({
        userInfo: updatedInfo,
        avatarUrl: updatedInfo.avatarUrl
      });
      
      // 更新存储
      wx.setStorageSync('userInfo', updatedInfo);
      getApp().globalData.userInfo = updatedInfo;
    } else {
      wx.showToast({
        title: resData.msg || '保存失败',
        icon: 'none'
      });
    }
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