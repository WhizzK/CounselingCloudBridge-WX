Page({
  data: {
    currentConsultant: null,
    messages: [],
    inputValue: '',
    scrollTop: 0,
    showConfirmDialog: false,
    rating: 0,
    // 新增调试模式开关
    debugMode: true
  },

  onLoad() {
    this.initMockData();
  },

  // 初始化模拟数据
  initMockData() {
    // 尝试从本地存储加载
    const localData = wx.getStorageSync('consultData');
    if (localData) {
      this.setData({
        currentConsultant: localData.consultant,
        messages: localData.messages
      });
    } else {
      // 默认模拟数据
      this.setData({
        currentConsultant: {
          avatar: '/images/咨询师1.jpg',
          name: '王咨询师',
          title: '国家二级心理咨询师'
        },
        messages: [
          {
            content: '您好，有什么可以帮您？',
            isUser: false,
            time: this.formatTime(new Date())
          }
        ]
      });
    }
    this.scrollToBottom();
  },

  // 输入处理
  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  // 发送消息（纯前端模拟）
  sendMessage() {
    const message = this.data.inputValue.trim();
    if (!message) return;

    // 生成用户消息
    const userMsg = {
      content: message,
      isUser: true,
      time: this.formatTime(new Date())
    };

    // 更新消息列表
    this.setData({
      messages: [...this.data.messages, userMsg],
      inputValue: ''
    });

    // 模拟咨询师回复（1秒延迟）
    setTimeout(() => {
      const replyMsg = {
        content: this.generateMockReply(message),
        isUser: false,
        time: this.formatTime(new Date())
      };
      this.setData({ messages: [...this.data.messages, replyMsg] });
      this.saveToLocal();
      this.scrollToBottom();
    }, 1000);

    this.saveToLocal();
    this.scrollToBottom();
  },

  // 生成模拟回复
  generateMockReply(input) {
    const replies = [
      '希腊奶'
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  },

  // 保存到本地存储
  saveToLocal() {
    wx.setStorageSync('consultData', {
      consultant: this.data.currentConsultant,
      messages: this.data.messages
    });
  },

  // 点击结束按钮
  handleEndConsult() {
    this.setData({ showConfirmDialog: true });
  },

  // 评分选择
  handleRatingSelect(e) {
    const rating = e.currentTarget.dataset.rating;
    this.setData({ rating });
  },

  // 确认结束
  handleConfirmEnd() {
    if (this.data.rating === 0) {
      wx.showToast({ title: '请先进行评分', icon: 'none' });
      return;
    }

    // 发送请求到后端
    wx.request({
      url: '你的后端接口地址',
      method: 'POST',
      data: {
        rating: this.data.rating,
        sessionId: '当前会话ID' // 需要根据实际情况获取
      },
      success: (res) => {
        if (res.data.success) {
          // 清除本地会话数据
          wx.removeStorageSync('consultData');
          wx.showToast({ title: '咨询已结束' });
          // 返回上一页或其他操作
          wx.navigateBack();
        }
      },
      fail: () => {
        wx.showToast({ title: '提交失败，请重试', icon: 'none' });
      }
    });

    this.setData({ showConfirmDialog: false });
  },

  // 取消操作
  handleCancel() {
    this.setData({ 
      showConfirmDialog: false,
      rating: 0 
    });
  },

  // 滚动到底部
  scrollToBottom() {
    setTimeout(() => {
      this.setData({ scrollTop: 99999 });
    }, 100);
  },

  // 格式化时间
  formatTime(date) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  },

  // 调试用方法：重置会话
  resetSession() {
    wx.removeStorageSync('consultData');
    this.initMockData();
  }
});