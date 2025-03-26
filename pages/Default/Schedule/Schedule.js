// pages/Default/Schedule/Schedule.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKeyword: '',
    sortType: '',
    activeStatus: 'all',
    // ...其他原有数据
    therapists: [
      {
        id: 1,
        avatar: '/images/咨询师1.jpg',
        name: '王心理咨询师',
        rating: 4.9,
        expertise: '擅长：情绪管理、亲密关系',
        experience: 8,
        isFree: true
      },
      {
        id: 2,
        avatar: '/images/咨询师2.png',
        name: '李心理专家',
        rating: 4.8,
        expertise: '擅长：职场压力、焦虑缓解',
        experience: 10,
        isFree: true
      }
    ]
  },

  navToCounselorDetail(e) {
    const counselorId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/Default/Counselor_Details/Counselor_Details?id=${counselorId}`,
    })
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

  },

  // 搜索处理
  handleSearch(e) {
    this.setData({ searchKeyword: e.detail.value });
    this.filterTherapists();
  },

  // 清空搜索
  clearSearch() {
    this.setData({ searchKeyword: '' });
    this.filterTherapists();
  },

  // 排序处理
  handleSortChange(e) {
    const sortType = ['default', 'rating', 'experience'][e.detail.value];
    this.setData({ sortType });
    this.filterTherapists();
  },

  // 状态过滤
  filterByStatus(e) {
    const status = e.currentTarget.dataset.status;
    this.setData({ activeStatus: status });
    this.filterTherapists();
  },

  // 综合过滤方法
  filterTherapists() {
    // 这里需要实现具体的过滤逻辑
    // 根据searchKeyword、sortType、activeStatus过滤原始数据
    // 更新therapists数据
  }
})