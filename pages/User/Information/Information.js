// pages/User/Information/Information.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '/images/用户.png', // 默认头像
    realName: '科比',
    age: '18',
    gender: '男',
    occupation: '肘击侠',
    genders: ['男', '女', '其他']
  },

  // 选择头像
  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          avatarUrl: tempFilePath
        });
      }
    });
  },

  // 输入真实姓名
  inputRealName(e) {
    this.setData({
      realName: e.detail.value
    });
  },

  // 输入年龄
  inputAge(e) {
    this.setData({
      age: e.detail.value
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
      occupation: e.detail.value
    });
  },

  // 保存信息
  saveInfo() {
    const { avatarUrl, realName, age, gender, occupation } = this.data;
    // 这里可以将数据保存到本地存储或发送到服务器
    wx.setStorageSync('userInfo', {
      avatarUrl,
      realName,
      age,
      gender,
      occupation
    });

    wx.showToast({
      title: '保存成功',
      icon: 'success'
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