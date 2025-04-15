// pages/Default/Quiz2/Quiz2.js
const questions = [
  { id: 1, text: "我感到比往常更加神经过敏和焦虑", reverse: false },
  { id: 2, text: "我无缘无故感到担心", reverse: false },
  { id: 3, text: "我容易心烦意乱或感到恐慌", reverse: false },
  { id: 4, text: "我感到我的身体好像被分成几块，支离破碎", reverse: false },
  { id: 5, text: "我感到事事都很顺利，不会有倒霉的事情发生", reverse: true },
  { id: 6, text: "我的四肢抖动和震颤", reverse: false },
  { id: 7, text: "我因头痛、颈痛、背痛而烦恼", reverse: false },
  { id: 8, text: "我感到无力且容易疲劳", reverse: false },
  { id: 9, text: "我感到很平静，能安静坐下来", reverse: true },
  { id: 10, text: "我感到我的心跳较快", reverse: false },
  { id: 11, text: "我因阵阵的眩晕而不舒服", reverse: false },
  { id: 12, text: "我有阵阵要昏倒的感觉", reverse: false },
  { id: 13, text: "我呼吸时进气和出气都不费力", reverse: true },
  { id: 14, text: "我的手指和脚趾感到麻木和刺痛", reverse: false },
  { id: 15, text: "我因胃痛和消化不良而苦恼", reverse: false },
  { id: 16, text: "我必须时常排尿", reverse: false },
  { id: 17, text: "我的手总是很温暖而干燥", reverse: true },
  { id: 18, text: "我觉得脸发烧发红", reverse: false },
  { id: 19, text: "我容易入睡，晚上休息很好", reverse: true },
  { id: 20, text: "我做恶梦", reverse: false }
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
    if (standardScore < 50) result = '无焦虑倾向';
    else if (standardScore < 59) result = '轻度焦虑';
    else if (standardScore < 69) result = '中度焦虑';
    else result = '重度焦虑';
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