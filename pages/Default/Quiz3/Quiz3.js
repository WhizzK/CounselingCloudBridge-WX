// pages/Default/Quiz3/Quiz3.js
const questions = [
  { id: 1, text: "您是否经常头痛？", reverse: false },
  { id: 2, text: "您是否食欲差？", reverse: false },
  { id: 3, text: "您是否睡眠差？", reverse: false },
  { id: 4, text: "您是否易受惊吓？", reverse: false },
  { id: 5, text: "您是否手抖？", reverse: false },
  { id: 6, text: "您是否感觉不安、紧张或担忧？", reverse: false },
  { id: 7, text: "您是否消化不良？", reverse: false },
  { id: 8, text: "您是否思维不清晰？", reverse: false },
  { id: 9, text: "您是否感觉不快乐？", reverse: false },
  { id: 10, text: "您是否比原来哭得多？", reverse: false },
  { id: 11, text: "您是否发现很难从日常活动中得到乐趣？", reverse: false },
  { id: 12, text: "您是否发现自己很难做做决定？", reverse: false },
  { id: 13, text: "日常工作是否令您感到痛苦？", reverse: false },
  { id: 14, text: "您在生活中是否不能起到应起的作用？", reverse: false },
  { id: 15, text: "您是否丧失了对事物的兴趣？", reverse: false },
  { id: 16, text: "您是否感到自己是个无价值的人？", reverse: false },
  { id: 17, text: "您头脑中是否出现过结束自己生命的想法？", reverse: false },
  { id: 18, text: "您是否什么时候都感到累？", reverse: false },
  { id: 19, text: "您是否感到胃部不适？", reverse: false },
  { id: 20, text: "您是否容易疲劳？", reverse: false }
];

Page({
  data: {
    questions: questions.map(q => ({...q, options: [
      "很少或没有", "有时有", "经常有", "总是如此"
    ]})),
    answers: new Array(20).fill(null), // 存储用户选择
    completedCount: 0 // 新增计算属性
  },

  // 选项选择事件
  handleSelect(e) {
    // 确保索引和选项值为数字
    const qIndex = parseInt(e.currentTarget.dataset.index, 10);
    const optionIndex = parseInt(e.currentTarget.dataset.option, 10);
    
    // 添加数据校验
    if (isNaN(qIndex) || isNaN(optionIndex)) {
      console.error('无效的索引:', e.currentTarget.dataset);
      return;
    }
  
    // 计算得分（1-4分）
    const selectedValue = optionIndex + 1; 
    
    // 使用路径更新数组
    this.setData({
      [`answers[${qIndex}]`]: selectedValue,
      completedCount: this.data.answers.filter(a => a !== null).length + 1
    });
  
    // 调试日志（关键）
    console.log('当前题号:', qIndex+1, '选项值:', selectedValue);
    console.log('答案数组:', this.data.answers);
  },

  // 提交计算
  calculateScore() {
    const answers = this.data.answers;
    if (answers.some(a => a === null)) {
      wx.showToast({ title: '请完成所有题目', icon: 'none' });
      return;
    }

    // 处理反向计分（1-4转换为4-1）
    let total = answers.reduce((sum, val, idx) => {
      return sum + (questions[idx].reverse ? (5 - val) : val);
    }, 0);

    // 计算标准分
    const standardScore = Math.round(total * 1.25);
    let result = '';
    if (standardScore < 35) result = '您的心理很健康';
    else result = '存在情感痛苦，建议寻求专业帮助';
    console.log(standardScore);
    console.log(result);
    wx.setStorageSync('standardScore', standardScore);
    wx.setStorageSync('result', result);
    wx.navigateTo({
      url: '/pages/Default/Quiz_Result/Quiz_Result'
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