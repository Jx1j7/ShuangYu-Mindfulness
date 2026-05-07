const CLOUD_BGM_BASE = 'cloud://cloud1-2gjorcmtb6d39705.636c-cloud1-2gjorcmtb6d39705-1412250281/audio_bgm/';
const CLOUD_WAVE_BASE = 'cloud://cloud1-2gjorcmtb6d39705.636c-cloud1-2gjorcmtb6d39705-1412250281/audio_waves/';

// 当前页面使用的背景名和音乐名（用于点赞上报）
let currentBgName = '';
let currentBgmName = '';

Page({
  data: {
    CLOUD_IMG_BASE: 'cloud://cloud1-2gjorcmtb6d39705.636c-cloud1-2gjorcmtb6d39705-1412250281/images/',
    bgSrc: '',
    bgmVolume: 70,
    waveVolume: 80,
    isPlaying: true,
    bgLiked: false,
    bgmLiked: false,
    navBarTop: 0
  },

  waveAudio: null,
  bgmContext: null,

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

    const wave = options.wave || 'alpha.wav'
    const selectedBg = options.selectedBg || 'senlin.jpg'
    const bgmFile = options.bgmFile || 'fire.mp3'

    // 记录当前中文名称用于点赞上报（优先使用 config 传入的中文名）
    currentBgName = options.bgName || selectedBg.replace(/\.[^.]+$/, '')
    currentBgmName = options.bgmName || bgmFile.replace(/\.[^.]+$/, '')
    console.log('[player] 上报名称: bg=', currentBgName, 'bgm=', currentBgmName)

    // 云端路径拼接 - 背景图
    this.setData({
      bgSrc: this.data.CLOUD_IMG_BASE + selectedBg
    })

    // 强制全局静音释放：确保静音模式下也能发声
    wx.setInnerAudioOption({
      manageEnforcedAudioCommand: false,
      obliqueMuteQueries: false
    })

    // 停止主页全局背景音乐
    try {
      getApp().stopMainBgm()
    } catch (e) {}

    // ========== 第一音轨：波形音频（Wave）- 云端路径 ==========
    try {
      this.waveAudio = wx.createInnerAudioContext()
      this.waveAudio.src = CLOUD_WAVE_BASE + wave
      console.log('[player] 波形路径(云端):', this.waveAudio.src)
      this.waveAudio.loop = true
      this.waveAudio.obeyMuteSwitch = true
      this.waveAudio.volume = this.data.waveVolume / 100

      this.waveAudio.onCanplay(() => {
        console.log('[player] 波形音频已就绪')
        this.waveAudio.play()
      })
      this.waveAudio.onError((res) => {
        console.warn('[player] 波形播放失败(非致命):', res.errMsg)
      })
    } catch (e) {
      console.warn('[player] 波形音频创建异常(非致命):', e.message || e)
      this.waveAudio = null
    }

    // ========== 第二音轨：背景音乐（BGM）- 云端路径 ==========
    if (bgmFile) {
      try {
        this.bgmContext = wx.createInnerAudioContext()
        this.bgmContext.src = CLOUD_BGM_BASE + bgmFile
        console.log('[player] BGM路径:', this.bgmContext.src)
        this.bgmContext.loop = true
        this.bgmContext.autoplay = true
        this.bgmContext.obeyMuteSwitch = true
        this.bgmContext.volume = this.data.bgmVolume / 100

        this.bgmContext.onCanplay(() => {
          console.log('[player] 背景音乐已就绪')
          this.bgmContext.play()
        })
        this.bgmContext.onError((res) => {
          console.warn('[player] BGM播放失败(非致命):', res.errMsg)
        })
      } catch (e) {
        console.warn('[player] BGM创建异常(非致命):', e.message || e)
        this.bgmContext = null
      }
    }
  },

  goBack() {
    wx.navigateBack()
  },

  onBgmVolumeChange(e) {
    const val = parseInt(e.detail.value)
    this.setData({ bgmVolume: val })
    try { if (this.bgmContext) this.bgmContext.volume = val / 100 } catch(e) {}
  },

  onWaveVolumeChange(e) {
    const val = parseInt(e.detail.value)
    this.setData({ waveVolume: val })
    try { if (this.waveAudio) this.waveAudio.volume = val / 100 } catch(e) {}
  },

  togglePlay() {
    if (this.data.isPlaying) {
      try { if (this.waveAudio) this.waveAudio.pause() } catch(e) {}
      try { if (this.bgmContext) this.bgmContext.pause() } catch(e) {}
      this.setData({ isPlaying: false })
    } else {
      try { if (this.waveAudio) this.waveAudio.play() } catch(e) {}
      try { if (this.bgmContext) this.bgmContext.play() } catch(e) {}
      this.setData({ isPlaying: true })
    }
  },

  // ========== 点赞逻辑（强制变色） ==========

  handleLikeBg() {
    console.log('=== 触发点赞 bg ===')
    const newVal = !this.data.bgLiked
    // ★ 先立即变色（不管数据库结果）
    this.setData({ bgLiked: newVal }, () => {
      console.log('★ 状态已更新 bgLiked=', this.data.bgLiked)
    })
    // 再异步上报数据库
    this._incStat(currentBgName, 'bg', newVal ? 1 : -1)
  },

  handleLikeBgm() {
    console.log('=== 触发点赞 bgm ===')
    const newVal = !this.data.bgmLiked
    // ★ 先立即变色（不管数据库结果）
    this.setData({ bgmLiked: newVal }, () => {
      console.log('★ 状态已更新 bgmLiked=', this.data.bgmLiked)
    })
    // 再异步上报数据库
    this._incStat(currentBgmName, 'bgm', newVal ? 1 : -1)
  },

  _incStat(name, type, delta) {
    if (!name || !delta) return
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('interaction_stats').where({
      name: name,
      type: type
    }).get().then(res => {
      if (res.data && res.data.length > 0) {
        // 记录已存在：count +1 或 -1
        db.collection('interaction_stats').doc(res.data[0]._id).update({
          data: { count: _.inc(delta), date: db.serverDate() }
        }).then(() => {
          console.log(`点赞${type}(${name}) ${delta > 0 ? '+1' : '-1'} 成功`)
        }).catch(err => console.error('更新点赞失败:', err))
      } else if (delta > 0) {
        // 不存在且是点赞操作才新增
        db.collection('interaction_stats').add({
          data: { name: name, type: type, count: 1, date: db.serverDate() }
        }).then(() => {
          console.log(`新增点赞记录: ${type}(${name})`)
        }).catch(err => console.error('新增点赞失败:', err))
      }
    }).catch(err => console.error('查询点赞记录失败:', err))
  },

  onUnload() {
    // 销毁播放页音频实例
    if (this.waveAudio) {
      this.waveAudio.destroy()
      this.waveAudio = null
    }
    if (this.bgmContext) {
      this.bgmContext.destroy()
      this.bgmContext = null
    }

    // 恢复全局主题曲
    try {
      getApp().playThemeAudio()
    } catch (e) {}
  }
})
