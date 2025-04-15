// pages/QuizMain/QuizMain.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionnaires: [
      {
        id: 1,
        title: "抑郁自评量表（SDS）",
        description: "通过20个问题评估你的抑郁程度。",
        icon: "/icons/问卷.png"
      },
      {
        id: 2,
        title: "焦虑自评量表（SAS）",
        description: "通过20个问题评估你的焦虑水平。",
        icon: "/icons/问卷.png"
      },
      {
        id: 3,
        title: "心理健康自评问卷（SRQ-20）",
        description: "通过20个问题评估你的心理状态。",
        icon: "/icons/问卷.png"
      }
    ]
  },

  // 处理问卷点击事件
  handleQuestionnaireTap: function (event) {
    const questionnaireId = event.currentTarget.dataset.id;
    const quizType = `Quiz${questionnaireId}`;
    console.log(questionnaireId);
    console.log(quizType);
    console.log(`/pages/Default/${quizType}/${quizType}`);
    wx.navigateTo({
      url: `/pages/Default/${quizType}/${quizType}`
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