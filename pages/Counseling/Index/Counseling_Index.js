const WxChatService = require('../../../utils/ChatService');
//const { getUserId, getToken } = require('../../utils/auth');

Page({
  data: {
    currentConsultant: null,
    messages: [],
    inputValue: '',
    scrollTop: 0,
    showConfirmDialog: false,
    rating: 0,
    connected: false,
    sessionId: null,
    userId: null
  },

  onLoad(options) {
    // 从路由参数或本地存储获取会话信息
    const sessionId = options.sessionId || wx.getStorageSync('currentSessionId');
    const userId = getUserId();
    
    this.setData({
      sessionId,
      userId
    });

    // 初始化聊天服务
    this.initChatService();
    this.loadConsultantInfo();
  },

  // 初始化聊天服务
  initChatService() {
    this.chatService = new WxChatService({
      sessionId: this.data.sessionId,
      userId: this.data.userId,
      brokerURL: 'wss://your-domain.com/ws',
      reconnectDelay: 3000,
      messageHandlers: {
        onSessionMessage: this.handleSessionMessage.bind(this),
        onErrorMessage: this.handleError.bind(this)
      }
    });

    // 设置事件监听
    this.chatService.on('connection_error', this.handleConnectionError.bind(this));
    this.chatService.on('sent', this.handleMessageSent.bind(this));
    this.chatService.on('parse_error', this.handleError.bind(this));

    // 连接WebSocket
    this.connect();
  },

  // 加载咨询师信息
  loadConsultantInfo() {
    wx.request({
      url: app.globalData.host + '/api/client/session',
      method: 'GET',
      data: { sessionId: this.data.sessionId },
      success: (res) => {
        if (res.data.success) {
          this.setData({
            currentConsultant: res.data.consultant
          });
        }
      }
    });
  },

  // 连接WebSocket
  connect() {
    wx.showLoading({ title: '连接中...' });
    this.chatService.connect();
  },

  // 处理收到的消息
  handleSessionMessage(message) {
    const newMessage = {
      content: message.content,
      isUser: message.meta.user_id === this.data.userId,
      time: this.formatTime(new Date())
    };

    this.setData({
      messages: [...this.data.messages, newMessage],
      connected: true
    });

    wx.hideLoading();
    this.scrollToBottom();
  },

  // 处理错误
  handleError(error) {
    console.error('Chat error:', error);
    wx.showToast({
      title: error.message || '聊天错误',
      icon: 'none'
    });
  },

  // 处理连接错误
  handleConnectionError(error) {
    console.error('Connection error:', error);
    wx.showToast({
      title: '连接失败，正在重试...',
      icon: 'none'
    });
    setTimeout(() => this.connect(), 5000);
  },

  // 处理消息发送成功
  handleMessageSent(meta) {
    console.log('Message sent:', meta.id);
  },

  // 输入处理
  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  // 发送消息
  sendMessage() {
    const message = this.data.inputValue.trim();
    if (!message) return;

    this.chatService.sendMessage(message)
      .then(() => {
        this.setData({ inputValue: '' });
      })
      .catch(err => {
        wx.showToast({
          title: '发送失败: ' + err.message,
          icon: 'none'
        });
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

    // 发送结束咨询请求
    wx.request({
      url: 'https://your-api.com/api/consult/end',
      method: 'POST',
      data: {
        rating: this.data.rating,
        sessionId: this.data.sessionId
      },
      success: (res) => {
        if (res.data.success) {
          // 断开WebSocket连接
          this.chatService.disconnect();
          // 清除会话数据
          wx.removeStorageSync('currentSessionId');
          wx.showToast({ title: '咨询已结束' });
          // 返回上一页
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

  onUnload() {
    // 页面卸载时断开连接
    if (this.chatService) {
      this.chatService.disconnect();
    }
  }
});