// pages/Default/Quiz/Quiz.js
Page({
  data: {
    questions: [
      { question: "我感到紧张或不安" },
      { question: "我感到害怕，好像有什么可怕的事情要发生" },
      { question: "我担心太多的事情" },
      { question: "我很难放松" },
      { question: "我感到坐立不安，难以静坐" },
      { question: "我变得容易烦恼或急躁" },
      { question: "我感到好像有什么危险要发生" },
      { question: "我感到颤抖（例如手抖）" },
      { question: "我感到心慌或心跳加快" },
      { question: "我感到头晕或头重脚轻" }
    ],
    options: [
      { label: "完全没有", value: 0 },
      { label: "有些天", value: 1 },
      { label: "超过一半天数", value: 2 },
      { label: "几乎每天", value: 3 }
    ],
    answers: Array(10).fill(null),
    isAllAnswered: false,
    showResult: false,
    totalScore: 0,
    resultDesc: "",
    suggestion: ""
  },

  // 单选按钮变化事件
  radioChange(e) {
    const index = e.currentTarget.dataset.index;
    const value = parseInt(e.detail.value);
    
    let answers = this.data.answers;
    answers[index] = value;
    
    this.setData({
      answers: answers,
      isAllAnswered: answers.every(item => item !== null)
    });
  },

  // 提交测试
  submitTest() {
    if (!this.data.isAllAnswered) {
      wx.showToast({
        title: '请完成所有问题',
        icon: 'none'
      });
      return;
    }
    
    const totalScore = this.data.answers.reduce((sum, item) => sum + item, 0);
    let resultDesc = "";
    let suggestion = "";
    
    if (totalScore <= 4) {
      resultDesc = "您的焦虑水平在正常范围内。";
      suggestion = "继续保持良好的生活习惯和心态，如有不适可定期进行自我评估。";
    } else if (totalScore <= 9) {
      resultDesc = "您有轻度焦虑倾向。";
      suggestion = "建议关注自己的情绪变化，适当进行放松训练，如深呼吸、冥想等。";
    } else if (totalScore <= 14) {
      resultDesc = "您有中度焦虑症状。";
      suggestion = "建议寻求专业心理咨询或与信任的人交流，学习压力管理技巧。";
    } else {
      resultDesc = "您的焦虑症状较为明显。";
      suggestion = "建议尽快寻求专业心理医生的帮助，早期干预效果更好。";
    }
    
    this.setData({
      showResult: true,
      totalScore: totalScore,
      resultDesc: resultDesc,
      suggestion: suggestion
    });
    
    // 滚动到结果部分
    wx.pageScrollTo({
      selector: '.result-card',
      duration: 300
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