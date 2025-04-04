// pages/Default/Index/Default_Index.js
// pages/index/index.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    therapists: [],
    isLoading: true,
    isEmpty: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadTherapistsData();
  },

  // 从服务器加载咨询师数据
  loadTherapistsData: function() {
    const token = wx.getStorageSync('token');
    
    this.setData({ isLoading: true, isEmpty: false });

    wx.request({
      url: app.globalData.host + '/api/client/home',
      method: 'GET',
      header: { 'token': token },
      success: (res) => {
        console.log('API响应:', res.data);
        
        if (res.data.code === 1) {
          // 处理空数组情况
          if (Array.isArray(res.data.data) && res.data.data.length > 0) {
            const therapists = res.data.data.map(item => ({
              id: item.counselorld || 0,
              avatar: '../../..' + item.avatarUrl || '/images/default-avatar.png',
              name: item.realName || '未知咨询师',
              rating: item.rating || 0,
              expertise: item.expertise ? '擅长：' + item.expertise : '专业领域待补充',
              experience: item.experience || 3, // 默认3年经验
              isFree: Boolean(item.isFree)
            }));
            
            this.setData({ 
              therapists,
              isLoading: false,
              isEmpty: false
            });
          } else {
            this.setData({ 
              therapists: [],
              isLoading: false,
              isEmpty: true
            });
          }
        } else {
          wx.showToast({
            title: res.data.msg || '数据加载失败',
            icon: 'none'
          });
          this.setData({ isLoading: false });
        }
      },
      fail: (err) => {
        console.error('请求失败:', err);
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
        this.setData({ isLoading: false });
      }
    });
  },

  // 导航到心理自测页面
  navToQuiz() {
    wx.navigateTo({
      url: '/pages/Default/QuizMain/QuizMain',
    })
  },
  
  // 导航到AI对话页面
  navToAIChat() {
    wx.navigateTo({
      url: '/pages/Default/AIChat/AIChat',
    })
  },
  
  // 导航到排班查询页面
  navToSchedule() {
    wx.navigateTo({
      url: '/pages/Default/Schedule/Schedule',
    })
  },
  
  // 导航到咨询师详情页面
  navToCounselorDetail(e) {
    const counselorId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/Default/Counselor_Details/Counselor_Details?id=${counselorId}`,
    })
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