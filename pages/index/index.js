Page({
  onLoad() {
    // 复用全局云端主题曲（app.js 已通过 getBackgroundAudioManager 管理）
    try { getApp().playThemeAudio() } catch(e) {}
  },

  handleStart: function () {
    wx.navigateTo({
      url: '/pages/main/main',
      fail: function () {
        wx.showToast({ title: '页面开发中...', icon: 'none' })
      }
    })
  }
})
