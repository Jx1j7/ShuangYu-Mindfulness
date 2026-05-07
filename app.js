// 云端主题曲地址（云开发初始化成功后可用）
const THEME_AUDIO_URL = 'cloud://cloud1-2gjorcmtb6d39705.636c-cloud1-2gjorcmtb6d39705-1412250281/audio_theme/bgm.wav';

App({
  _cloudReady: false,

  onLaunch() {
    // ★ 云开发初始化（必须在最前面！）
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'your-env-id-here',
        traceUser: true,
      });
      console.log('[云开发] 初始化成功');
      this._cloudReady = true;
    }

    // 延迟播放主题曲，确保页面渲染完成后再加载音频
    setTimeout(() => { this.playThemeAudio() }, 500);
  },

  // 播放/恢复主题曲（完全容错，不影响任何页面）
  playThemeAudio() {
    if (!this._cloudReady) return;
    try {
      if (!this._bgm) {
        this._bgm = wx.getBackgroundAudioManager();
        this._bgm.title = '双屿正念';
        this._bgm.loop = true;
        this._bgm.onEnded(() => {
          this.playThemeAudio();
        });
        this._bgm.onError((err) => {
          console.warn('[主题曲] 资源不可用，静默处理:', err.errMsg || err);
          this._bgm = null;
        });
      }
      this._bgm.src = THEME_AUDIO_URL;
    } catch (e) {
      console.warn('[主题曲] 播放器异常:', e.message || e);
      this._bgm = null;
    }
  },

  // 停止主题曲（供播放页等页面调用）
  stopMainBgm() {
    try {
      if (this._bgm) {
        this._bgm.stop();
      }
    } catch (e) {}
  }
});
