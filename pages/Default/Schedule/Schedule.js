// pages/Default/Schedule/Schedule.js
const app = getApp();
Page({
  data: {
    searchKeyword: '',
    sortType: '',
    activeStatus: 'all',
    therapists: [],
    page: 1,
    pagesize: 5,
    loading: false,
    noMoreData: false
  },

  // 导航到咨询师详情页
  navToCounselorDetail(e) {
    const counselorId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/Default/Counselor_Details/Counselor_Details?id=${counselorId}`,
    })
  },

  onLoad(options) {
    this.loadTherapists();
  },

  // 加载咨询师数据
  loadTherapists() {
    if (this.data.loading || this.data.noMoreData) return;
    
    this.setData({ loading: true });
    
    const { searchKeyword, sortType, activeStatus, page, pagesize } = this.data;
    const token = wx.getStorageSync('token');
    
    wx.request({
      url: app.globalData.host + '/api/client/counselor',
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json'
      },
      data: {
        name: searchKeyword || '', // 必填，空字符串代替undefined
        sortord: sortType === '' ? '' : sortType, // 必填，默认传空字符串
        isFree: activeStatus === 'all' ? 2 : 
               (activeStatus === 'free' ? 1 : 0), // 严格按文档映射
        page: page,
        pagesize: pagesize // 修正参数名拼写
      },
      success: (res) => {
        if (res.data.code === 1) {
          const newData = res.data?.data || []; // 注意数据结构变化
          newData.forEach(counselor => {
            wx.setStorageSync(`counselor_${counselor.counselorId}`, counselor);
          });
          const Therapists = page === 1 ? newData : [...this.data.therapists, ...newData];
          console.log(res.data);
          this.setData({
            therapists: Therapists,
            noMoreData: newData.length < pagesize
          });
        } else {
          wx.showToast({
            title: res.data.msg || '加载失败', // 显示后端返回的错误信息
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.showToast({
          title: err.errMsg || '网络错误',
          icon: 'none'
        });
        this.setData({ loading: false });
      },
      complete: () => {
        wx.stopPullDownRefresh();
        this.setData({loading: false});
      }
    });
  },

  // 搜索处理
  handleSearch(e) {
    this.setData({ 
      searchKeyword: e.detail.value,
      page: 1
    }, () => {
      this.loadTherapists();
    });
  },

  // 清空搜索
  clearSearch() {
    this.setData({ 
      searchKeyword: '',
      page: 1
    }, () => {
      this.loadTherapists();
    });
  },

  // 排序处理
  handleSortChange(e) {
    const sortType = ['default', 'rating'][e.detail.value];
    this.setData({ 
      sortType,
      page: 1
    }, () => {
      this.loadTherapists();
    });
  },

  // 状态过滤
  filterByStatus(e) {
    const status = e.currentTarget.dataset.status;
    this.setData({ 
      activeStatus: status,
      page: 1
    });
    console.log('setData');
    this.loadTherapists();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({ page: 1 }, () => {
      this.loadTherapists();
    });
  },

  // 上拉加载更多
  onReachBottom() {
    if (!this.data.noMoreData) {
      this.setData({ page: this.data.page + 1 }, () => {
        this.loadTherapists();
      });
    }
  }
});