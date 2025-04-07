const app = getApp();
const ChatService = require("../../../utils/ChatService");
Page({
  data: {
    currentConsultant: null,
    counselorId: 0,
    messages: [],
    inputValue: '',
    scrollTop: 0,
    showConfirmDialog: false,
    rating: 0,
    connected: false,
    sessionId: null,
    userId: null,
    chatService: null
  },

  onLoad(options) {
    // 从路由参数或本地存储获取会话信息
    console.log('onLoad');
    const sessionId = options.sessionId || wx.getStorageSync('currentSessionId');
    console.log('Initial sessionId:', sessionId); // 验证存储值
    const userId = wx.getStorageSync('userInfo').userId;
    const counselorId = options.counselorId || wx.getStorageSync('currentCounselorId');

    // 初始化ChatService
    this.chatService = new ChatService(userId);
    console.log(this.chatService);
    this.chatService.subscribe('message', (msg) => {
      this.handleIncomingMessage(msg);
    });
    this.chatService.subscribe('connected', this.handleConnectionSuccess.bind(this));
    this.chatService.subscribe('disconnected', this.handleDisconnect.bind(this));
    this.chatService.subscribe('error', this.handleError.bind(this));

    this.setData({
      counselorId,
      sessionId,
      userId,
      ChatService
    }, () => {
      this.loadConsultantInfo();
    });
  },

  onShow() {

  },

  // 加载咨询师信息
  loadConsultantInfo() {
    // 从本地缓存
    //   const currentCounselorId = wx.getStorageSync('currentCounselorId');
    //   console.log(currentCounselorId);
    //   const currentConsultant = wx.getStorageSync(`counselor_${currentCounselorId}`);
    //   console.log(currentConsultant);
    //  this.setData({
    //    currentConsultant: currentConsultant
    //  });

    const token = wx.getStorageSync('token');
    // 从后端获取
    wx.request({
      url: app.globalData.host + '/api/client/session',
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.data.code === 1) {
          this.setData({
            currentConsultant: {
              counselorId: res.data.data.counselorId,
              realName: res.data.data.realName,
              avatarUrl: res.data.data.avatarUrl,
              sessionId: res.data.data.sessionId
            }
          });
        } else {
          wx.showToast({ title: res.data.msg, icon: 'none' });
        }
      },
      fail: (err) => {
        wx.showToast({ title: '网络异常，请重试', icon: 'none' });
      }
    });
  },

  // 处理收到的消息
  handleIncomingMessage(msg) {
    //  严格检查字段存在性
  if (!msg.sessionId || !msg.senderId || !msg.content) return;

  //  过滤其他会话消息（接口文档要求 sessionId 匹配）
  if (msg.sessionId !== this.data.sessionId) return;

  //  处理时间戳格式容错
  let displayTime;
  try {
    displayTime = this.formatTime(new Date(msg.time));
  } catch (e) {
    displayTime = this.formatTime(new Date());
  }

  const newMessage = {
    id: msg.id || Date.now().toString(), //  保证 ID 为字符串
    content: msg.content,
    isUser: msg.senderId === this.data.userId,
    time: displayTime
  };

  //  使用 concat 避免直接修改原数组
  this.setData({
    messages: this.data.messages.concat(newMessage)
  });
    this.scrollToBottom();
  },

  // 发送消息
  sendMessage() {
    const { inputValue, sessionId, counselorId, chatService } = this.data;
    if (!inputValue.trim() || !chatService) return;

    chatService.send(sessionId, counselorId, inputValue.trim());
    
    this.setData({
      inputValue: '',
      messages: [...this.data.messages, {
        id: Date.now(),
        content: inputValue.trim(),
        isUser: true,
        time: this.formatTime(new Date())
      }]
    });
    
    this.scrollToBottom();
  },

  handleConnectionSuccess() {
    console.log("连接成功");
    this.setData({ connected: true });
  },

  handleDisconnect() {
    console.log("连接断开");
    this.setData({ connected: false });
  },

  // 处理错误
  handleError(error) {
    console.error('Chat error:', error);
    wx.showToast({
      title: error.message || '聊天错误',
      icon: 'none'
    });
  },

  // 滚动到底部
  scrollToBottom() {
    this.createSelectorQuery()
      .select('#messages-container')
      .boundingClientRect(rect => {
        if (rect) {
          this.setData({ scrollTop: rect.height });
        }
      })
      .exec();
  },

  // 格式化时间
  formatTime(date) {
    const d = date instanceof Date ? date : new Date(date);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  },

  onUnload() {
    // 页面卸载时取消订阅
    if (this.data.chatService) {
      this.data.chatService.destroy();
    }
    // 可选：完全关闭WebSocket连接
    // if(this.data.client) {
    //   this.data.client.disconnect();
    // }
  },

  // 保持其他原有方法不变...
  // ... handleEndConsult, handleRatingSelect, handleConfirmEnd, handleCancel 等方法 ...
});