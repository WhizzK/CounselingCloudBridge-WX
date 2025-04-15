// pages/Default/Quiz1/Quiz1.js
const questions = [
  { id: 1, text: "我感到情绪沮丧，郁闷", reverse: false },
  { id: 2, text: "我感到早晨心情最好", reverse: true },
  { id: 3, text: "我要哭或想哭", reverse: false },
  { id: 4, text: "我夜间睡眠不好", reverse: false },
  { id: 5, text: "我吃饭像平常一样多", reverse: true },
  { id: 6, text: "我的性功能正常", reverse: true },
  { id: 7, text: "我感到体重减轻", reverse: false },
  { id: 8, text: "我为便秘烦恼", reverse: false },
  { id: 9, text: "我的心跳比平时快", reverse: false },
  { id: 10, text: "我无故感到疲乏", reverse: false },
  { id: 11, text: "我的头脑像平常一样清楚", reverse: true },
  { id: 12, text: "我做事情像平常一样不感到困难", reverse: true },
  { id: 13, text: "我坐卧难安，难以保持平静", reverse: false },
  { id: 14, text: "我对未来感到有希望", reverse: true },
  { id: 15, text: "我比平时更容易激怒", reverse: false },
  { id: 16, text: "我觉得决定什么事很容易", reverse: true },
  { id: 17, text: "我感到自己是有用的和不可缺少的人", reverse: true },
  { id: 18, text: "我的生活很有意思", reverse: true },
  { id: 19, text: "假若我死了，别人会过得更好", reverse: false },
  { id: 20, text: "我仍旧喜爱自己喜爱的东西", reverse: true }
];

Page({
  data: {
    questions: questions.map(q => ({...q, options: [
      "很少或没有", "有时有", "经常有", "持续如此"
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
    if (standardScore < 53) result = '无抑郁倾向';
    else if (standardScore < 63) result = '轻度抑郁';
    else if (standardScore < 73) result = '中度抑郁';
    else result = '重度抑郁';
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