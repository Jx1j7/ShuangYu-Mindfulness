const waveMap = {
  '数学、物理': 'alpha.wav',
  '化学、生物': 'beta.wav',
  '语文、英语': 'delta.wav',
  '历史、地理、政治': 'theta.wav',
  '缓解焦虑': 'gamma1.wav',
  '缓解疼痛': 'gamma3.wav'
}

Page({
  data: {
    navBarTop: 0
  },
  onLoad() {
    // 动态计算导航栏 top 值，与胶囊按钮垂直居中对齐
    try {
      const menuRect = wx.getMenuButtonBoundingClientRect()
      const sysInfo = wx.getSystemInfoSync()
      const statusBarHeight = sysInfo.statusBarHeight || 0
      const btnCenterY = menuRect.top + menuRect.height / 2
      this.setData({ navBarTop: btnCenterY - 16 })
    } catch(e) {
      console.warn('计算导航栏位置失败', e)
      try {
        this.setData({ navBarTop: wx.getSystemInfoSync().statusBarHeight + 4 })
      } catch(err) {}
    }

    // 复用全局云端主题曲（app.js 已通过 getBackgroundAudioManager 管理）
    try { getApp().playThemeAudio() } catch(e) {}
  },

  goBack() {
    wx.navigateBack({
      fail() {
        wx.switchTab({ url: '/pages/main/main' })
      }
    })
  },

  goPlayer(e) {
    const title = e.currentTarget.dataset.title || ''
    const waveFile = waveMap[title] || 'gamma1.wav'
    wx.navigateTo({
      url: '/pages/config/config?originWave=' + encodeURIComponent(waveFile)
        + '&sceneTitle=' + encodeURIComponent(title)
    })
  }
})
