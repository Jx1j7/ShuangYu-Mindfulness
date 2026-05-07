Page({
  data: {
    navBarTop: 0,
    originWave: '',
    sceneTitle: '',
    imageList: [
      { name: '森林', value: 'senlin.jpg' },
      { name: '湖畔', value: 'hupan.jpg' },
      { name: '草地', value: 'caodi.jpg' },
      { name: '沙滩', value: 'shatan.jpg' },
      { name: '雪山', value: 'xueshan.jpg' }
    ],
    bgmList: [
      { name: '火焰', value: 'fire.mp3' },
      { name: '森林', value: 'forest.mp3' },
      { name: '海浪', value: 'sea_waves.mp3' },
      { name: '蒸汽', value: 'stream.mp3' },
      { name: '行走', value: 'walking.mp3' },
      { name: '清风', value: 'wind.mp3' }
    ],
    selectedBgIndex: 0,
    selectedBgmIndex: 0,

    // 自定义选择器状态
    showPicker: false,
    pickerType: '',     // 'bg' | 'bgm'
    pickerTitle: '',
    pickerOptions: [],
    pickerCurrentIndex: 0,

    // 排行榜推荐位
    recommendBg: '',
    recommendBgm: '',

    // 调试信息（页面直接展示）
    debugInfo: ''
  },

  onLoad(options) {
    // 动态计算导航栏 top 值，与胶囊按钮垂直居中对齐
    try {
      const menuRect = wx.getMenuButtonBoundingClientRect()
      const btnCenterY = menuRect.top + menuRect.height / 2
      this.setData({ navBarTop: btnCenterY - 16 })
    } catch(e) {
      console.warn('计算导航栏位置失败', e)
      try {
        this.setData({ navBarTop: wx.getSystemInfoSync().statusBarHeight + 4 })
      } catch(err) {}
    }

    // 确保主题曲正在播放
    try {
      getApp().playThemeAudio()
    } catch (e) {}

    this.setData({
      originWave: options.originWave || '',
      sceneTitle: options.sceneTitle || ''
    })

    // 查询排行榜数据
    this.loadRecommendations()
  },

  // 查询点赞数最多的背景和音乐
  loadRecommendations() {
    console.log('[推荐] 开始查询排行榜...')
    this.setData({ debugInfo: '正在查询...' })

    try {
      const db = wx.cloud.database()
      console.log('[推荐] db 初始化成功')

      db.collection('interaction_stats')
        .where({ type: 'bg' })
        .orderBy('count', 'desc')
        .limit(1)
        .get()
        .then(res => {
          console.log('[推荐] bg 原始查询结果:', JSON.stringify(res.data))
          if (res.data && res.data.length > 0) {
            const rawName = res.data[0].name
            const displayName = this._mapDisplayName(rawName, 'bg')
            console.log('[推荐] bg 映射后:', rawName, '→', displayName)
            this.setData({ recommendBg: displayName || rawName, debugInfo: 'bg=' + (displayName || rawName) })
          } else {
            this.setData({ debugInfo: 'bg 无记录' })
          }
        })
        .catch(err => {
          console.error('查询推荐背景失败:', err)
          this.setData({ debugInfo: 'bg 查询出错: ' + err.message })
        })

      db.collection('interaction_stats')
        .where({ type: 'bgm' })
        .orderBy('count', 'desc')
        .limit(1)
        .get()
        .then(res => {
          console.log('[推荐] bgm 原始查询结果:', JSON.stringify(res.data))
          if (res.data && res.data.length > 0) {
            const rawName = res.data[0].name
            const displayName = this._mapDisplayName(rawName, 'bgm')
            console.log('[推荐] bgm 映射后:', rawName, '→', displayName)
            this.setData({ recommendBgm: displayName || rawName, debugInfo: (this.data.debugInfo || '') + ' | bgm=' + (displayName || rawName) })
          } else {
            this.setData({ debugInfo: (this.data.debugInfo || '') + ' | bgm 无记录' })
          }
        })
        .catch(err => {
          console.error('查询推荐音乐失败:', err)
          this.setData({ debugInfo: (this.data.debugInfo || '') + ' | bgm 出错' })
        })
    } catch (e) {
      console.error('[推荐] db 初始化异常:', e)
      this.setData({ debugInfo: 'db 初始化异常: ' + e.message })
    }
  },

  // 原始名 → 可显示名（解码 + 映射）
  _mapDisplayName(rawName, type) {
    if (!rawName) return ''
    let name = rawName
    // 尝试解码（处理 %E6%A3%AE%E6%9E%97 这类 URL 编码）
    try {
      const decoded = decodeURIComponent(name)
      if (decoded !== name) {
        console.log('[推荐] URL解码:', name, '→', decoded)
        name = decoded
      }
    } catch (e) { /* 不是编码字符串，跳过 */ }
    // 如果是中文，直接返回
    if (/[\u4e00-\u9fa5]/.test(name)) return name
    // 英文名映射表
    const bgMap = { 'senlin': '森林', 'hupan': '湖畔', 'caodi': '草地', 'shatan': '沙滩', 'xueshan': '雪山' }
    const bgmMap = { 'fire': '火焰', 'forest': '森林', 'sea_waves': '海浪', 'stream': '蒸汽', 'walking': '行走', 'wind': '清风' }
    const map = type === 'bg' ? bgMap : bgmMap
    return map[name] || name
  },

  goBack() {
    wx.navigateBack()
  },

  selectRecommendBg() {
    const { recommendBg } = this.data
    if (!recommendBg) return
    const idx = this.data.imageList.findIndex(item => item.name === recommendBg || item.value === recommendBg)
    if (idx !== -1) {
      this.setData({ selectedBgIndex: idx })
    }
  },

  selectRecommendBgm() {
    const { recommendBgm } = this.data
    if (!recommendBgm) return
    const idx = this.data.bgmList.findIndex(item => item.name === recommendBgm || item.value === recommendBgm)
    if (idx !== -1) {
      this.setData({ selectedBgmIndex: idx })
    }
  },

  // 打开自定义选择器
  openPicker(e) {
    const type = e.currentTarget.dataset.type
    const isBg = type === 'bg'
    const list = isBg ? this.data.imageList : this.data.bgmList
    const currentIndex = isBg ? this.data.selectedBgIndex : this.data.selectedBgmIndex

    this.setData({
      showPicker: true,
      pickerType: type,
      pickerTitle: isBg ? '选择背景' : '选择音乐',
      pickerOptions: list,
      pickerCurrentIndex: currentIndex
    })
  },

  // 关闭选择器
  closePicker() {
    this.setData({ showPicker: false })
  },

  // 选择某一项
  selectItem(e) {
    const index = parseInt(e.currentTarget.dataset.index)
    const { pickerType } = this.data

    if (pickerType === 'bg') {
      this.setData({ selectedBgIndex: index, pickerCurrentIndex: index })
    } else {
      this.setData({ selectedBgmIndex: index, pickerCurrentIndex: index })
    }

    setTimeout(() => this.closePicker(), 200)
  },

  goPlayer() {
    const { originWave, sceneTitle, imageList, bgmList, selectedBgIndex, selectedBgmIndex } = this.data
    wx.navigateTo({
      url: '/pages/player/player'
        + '?wave=' + encodeURIComponent(originWave)
        + '&title=' + encodeURIComponent(sceneTitle)
        + '&selectedBg=' + encodeURIComponent(imageList[selectedBgIndex].value)
        + '&bgmFile=' + encodeURIComponent(bgmList[selectedBgmIndex].value)
        + '&bgName=' + encodeURIComponent(imageList[selectedBgIndex].name)
        + '&bgmName=' + encodeURIComponent(bgmList[selectedBgmIndex].name)
    })
  }
})
