// pages/Default/Counselor_Details/Counselor_Details.js
// pages/consultant-detail/consultant-detail.js
Page({
  data: {
    showAgreement: false,  // 控制弹窗显示
    hasAgreed: false,      // 是否同意协议
    consultant: {
      id: 1,
      name: "张心理咨询师",
      title: "国家二级心理咨询师",
      avatarUrl: "/images/咨询师1.jpg",
      rating: 4.9,
      reviewCount: 128,
      experienceYears: 8,
      sessionCount: 1200,
      successRate: 98,
      expertiseAreas: ["情绪管理","亲密关系"],
      consultMethods: [
        {
          type: "咨询",
          icon: "/images/咨询.png",
          duration: 50
        }
      ],
      bio: "心理学硕士，国家二级心理咨询师，8年心理咨询经验。擅长认知行为疗法(CBT)和接纳承诺疗法(ACT)，帮助来访者解决情绪困扰、人际关系问题和自我成长困惑。相信每个人都有自我成长和改变的能力，咨询风格温暖而有力，注重建立信任的咨询关系。"
    }
  },

  onLoad: function(options) {
    // 这里可以通过options.id获取咨询师ID，然后从服务器获取数据
    // this.loadConsultantData(options.id);
  },

  loadConsultantData: function(id) {
    // 实际项目中这里应该是从服务器获取数据
    wx.request({
      url: 'https://your-api.com/consultants/' + id,
      success: (res) => {
        this.setData({
          consultant: res.data
        });
      }
    });
  },

  startConsultation: function() {
    this.setData({
      showAgreement: true,
      hasAgreed: false
    });
  },
   // 关闭弹窗
   closeAgreement: function() {
    this.setData({ showAgreement: false });
  },

  // 切换同意状态
  toggleAgreement: function() {
    this.setData({ hasAgreed: !this.data.hasAgreed });
  },

  // 确认继续咨询
  handleConfirm: function() {
    if (!this.data.hasAgreed) return;
    
    this.setData({ showAgreement: false });
    
    // 这里可以跳转到后续流程
    wx.showToast({
      title: '开始咨询流程',
      icon: 'none'
    
    // 实际应该跳转到咨询页面
    // wx.navigateTo({
    //   url: '/pages/consultation/consultation'
    // });
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