Page({
  onLoad() {
    // 复用全局云端主题曲（app.js 已通过 getBackgroundAudioManager 管理）
    try { getApp().playThemeAudio() } catch(e) {}
  },

  goStudy: function () {
    wx.navigateTo({
      url: '/pages/study/study'
    })
  },
  goRelax: function () {
    wx.navigateTo({
      url: '/pages/relax/relax'
    })
  }
})
