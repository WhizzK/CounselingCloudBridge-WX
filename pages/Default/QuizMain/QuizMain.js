// pages/QuizMain/QuizMain.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionnaires: [
      {
        id: 1,
        title: "焦虑自测",
        description: "通过10个问题评估你的焦虑水平。",
        icon: "/images/用户.png"
      },
      {
        id: 2,
        title: "抑郁自测",
        description: "通过10个问题评估你的抑郁水平。",
        icon: "/images/用户.png"
      },
      {
        id: 3,
        title: "压力自测",
        description: "通过10个问题评估你的压力水平。",
        icon: "/images/用户.png"
      },
      {
        id: 4,
        title: "孤独自测",
        description: "通过10个问题评估你的孤独水平。",
        icon: "/images/用户.png"
      }
    ]
  },

  // 处理问卷点击事件
  handleQuestionnaireTap: function (event) {
    const questionnaireId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/Default/Quiz/Quiz?id=${questionnaireId}`
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