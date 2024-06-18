// pages/player/player.js
var _animation; // 动画实体
var _animationIndex = 0; // 动画执行次数index（当前执行了多少次）
var _animationIntervalId = -1; // 动画定时任务id，通过setInterval来达到无限旋转，记录id，用于结束定时任务
const _ANIMATION_TIME = 5000; // 动画播放一次的时长ms
Page({

  /**
   * 页面的初始数据
   */
  data: {
    innerAudioContext:null,
    animation: '',
    state:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const innerAudioContext = wx.createInnerAudioContext()
    this.setData({
      innerAudioContext:innerAudioContext
    })
    //是否自动播放
    innerAudioContext.autoplay = false 
    //音乐播放地址
    innerAudioContext.src = 'https://ws.stream.qqmusic.qq.com/C4000019sdOL39DJB8.m4a?guid=448800619&vkey=06310DC86024C6BBB230E9AD2B2AD5EE0A19FEC0607617E30BA8B786C08F51AF68AC3414975C99B566636C20974DB3293F5EBFFC84D92047&uin=6973&fromtag=66'
    //是否循环播放
    innerAudioContext.loop = false
    //
    innerAudioContext.onPlay(() => {
      this.setData({
        state:true
      })
    })
    innerAudioContext.onPause(()=>{
      this.setData({
        state:false
      })
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

  },
  play: function(){
    var innerAudioContext = this.data.innerAudioContext
    innerAudioContext.play()
    //开始旋转
    this.startAnimationInterval()
  },
  pause: function(){
    this.data.innerAudioContext.pause()
    this.stopAnimationInterval()
  },

  onReady: function () {
    _animationIndex = 0;
    _animationIntervalId = -1;
    this.data.animation = ''; 
  },

  onShow: function () {
    _animation = wx.createAnimation({
      duration: _ANIMATION_TIME,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0'
    })
   
  },

  /**
   * 实现image旋转动画，每次旋转 120*n度
   */
  rotateAni: function (n) {
    _animation.rotate(120 * (n)).step()
    this.setData({
      animation: _animation.export()
    })
  },

  /**
   * 开始旋转
   */
  startAnimationInterval: function () {
    var that = this;
    that.rotateAni(++_animationIndex); // 进行一次旋转
    _animationIntervalId = setInterval(function () {
      that.rotateAni(++_animationIndex);
    },  _ANIMATION_TIME); // 每间隔_ANIMATION_TIME进行一次旋转
  },

  /**
   * 停止旋转
   */
  stopAnimationInterval: function () {
    if (_animationIntervalId> 0) {
      clearInterval(_animationIntervalId);
      _animationIntervalId = 0;
    }
  }
})