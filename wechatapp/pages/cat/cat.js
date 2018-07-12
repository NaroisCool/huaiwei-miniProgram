// pages/cat/cat.js
var api = require('../../api.js');
var app = getApp();
var is_loading_more = false;
var is_no_more = false;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cat_list: [],
        sub_cat_list_scroll_top: 0,
        toView:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        app.pageOnLoad(this);
        this.setData({
            store: wx.getStorageSync("store"),
        });
        
        var page = this;
        is_no_more = false;
        page.setData({
          page: 1,
          goods_list: [],
          show_no_data_tip: false,
        });
       
        var cat_id = page.data.cat_id || "";
        var p = page.data.page || 1;
        //wx.showNavigationBarLoading();
        
        app.request({
          url: api.default.goods_list,
          data: {
            cat_id: cat_id,
            page: p,
            sort: page.data.sort,
            sort_type: page.data.sort_type,
          },
          success: function (res) {
         
              page.setData({ page: (p + 1) });
              page.setData({ goods_list: res.data.list });
             
            
           
          },
         
          loadMoreGoodsList: function () {
            var page = this;
            if (is_loading_more)
              return;
            page.setData({
              show_loading_bar: true,
            });
            is_loading_more = true;
            var cat_id = page.data.cat_id || "";
            var p = page.data.page || 2;
            app.request({
              url: api.default.goods_list,
              data: {
                page: p,
                cat_id: cat_id,
                sort: page.data.sort,
                sort_type: page.data.sort_type,
              },
              success: function (res) {
                if (res.data.list.length == 0)
                  is_no_more = true;
                var goods_list = page.data.goods_list.concat(res.data.list);
                page.setData({
                  goods_list: goods_list,
                  page: (p + 1),
                });                          
              },
              complete: function () {
                is_loading_more = false;
                page.setData({
                  show_loading_bar: false,
                });
              }
            });
          }
        });
      
    },

    onShow: function () {
        app.pageOnShow(this);
        this.loadData();
    },

    loadData: function (options) {
      var page = this;
      var pages_index_index = wx.getStorageSync('pages_index_index');
      if (pages_index_index) {
        page.setData(pages_index_index);
      }
      app.request({
        url: api.default.index,
        success: function (res) {
          if (res.code == 0) {
            page.setData(res.data);
            wx.setStorageSync('pages_index_index', res.data);
            wx.setStorageSync('store', res.data.store);
            
          }
        },
        complete: function () {
          wx.stopPullDownRefresh();
        }
      });



        var page = this;
        var cat_list = wx.getStorageSync("cat_list");
        if (cat_list) {
            page.setData({
                cat_list: cat_list,
                current_cat: null,
            });
        }
        app.request({
            url: api.default.cat_list,
            success: function (res) {
                if (res.code == 0) {
                    page.setData({
                        cat_list: res.data.list,
                        current_cat: null,
                    });
                    wx.setStorageSync("cat_list", res.data.list);
                }
            },
            complete: function () {
                wx.stopPullDownRefresh();
            }
        });
    },

    catItemClick: function (e) {
        var page = this;
        var index = e.currentTarget.dataset.index;
        var cat_list = page.data.cat_list;
        var scroll_top = 0;
        var add_scroll_top = true;
        var current_cat = null;
        for (var i in cat_list) {
            if (i == index) {
                cat_list[i].active = true;
                add_scroll_top = false;
                current_cat = cat_list[i];
            } else {
                cat_list[i].active = false;
                if (add_scroll_top) {
                    //scroll_top += 62;
                    //scroll_top += 45;
                    //var row_count = Math.ceil(cat_list[i].list.length / 3);
                    //scroll_top += row_count * (79 + 2);

                    //scroll_top += cat_list[i].list.length * 76;
                }
            }
        }      
        page.setData({
            cat_list: cat_list,
            sub_cat_list_scroll_top: scroll_top,
            current_cat: current_cat,
        });
    },
    jumpTo:function(e){
      let target=e.currentTarget.dataset.opt;
      console.log(target);
      this.setData({
        toView:target
      })
    }
});