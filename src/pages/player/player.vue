<template>
  <div class="player" v-show="playList.length>0">
  <!--<div class="player" v-if="playList.length>0">-->
    <!--全屏播放器-->
    <transition name="normal"
                @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen" ref="bigPlay">
        <div class="background">
          <img width="100%" height="100%" v-lazy="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="showMiniPlay">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
        <div class="middle"
             @touchstart="touchStartLyric" @touchmove="touchMoveLyric" @touchend="touchEndLyric">
          <div class="middle-l" >
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="changeImgrotate" >
                <img class="image" v-lazy="currentSong.image" >
              </div>
            </div>
            <!--显示部分歌词-->
            <div class="playing-lyric-wrapper" ref="buFenLyric">
              <div class="playing-lyric">
                {{showBuFenPlayingLyric}}
              </div>
            </div>
          </div>
          <!--全屏显示歌词,可滚动用scroll组件-->
          <Scroll class="middle-r" :data="currentLyric && currentLyric.lines" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text" ref="lyricLine" :class="{'current': currentLyricLineNum === index}"
                   v-for="(lineLyric, index) in currentLyric.lines" :key="index">
                  {{lineLyric.txt}}
                </p>
              </div>
            </div>
          </Scroll>
        </div>
        <div class="bottom">
          <!--界面的2个小点，显示当前的界面-->
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <!--ProgressBar组件-->
              <ProgressBar :prossBarBaiFenBi="prossBarBaiFenBi" @progressTouchEnd="progressTouchEnd" />
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="choosePlayMode">
              <i :class="changePalyMode"></i>
            </div>
            <div class="icon i-left" :class="disableClass">
              <i class="icon-prev" @click="prevSongs"></i>
            </div>
            <div class="icon i-center" >
              <!--icon-play icon-pause-->
              <i :class="changePalyImg" @click="togglePlayStatue"></i>
            </div>
            <div class="icon i-right" :class="disableClass">
              <i class="icon-next" @click="nextSongs"></i>
            </div>
            <div class="icon i-right">
              <i class="icon" ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!--迷你播放器-->
    <transition name="mini">
      <div class="mini-player"  v-show="!fullScreen" @click="showFullScreenPlay">
        <div class="icon">
          <img  width="40" height="40" v-lazy="currentSong.image" :class="changeImgrotate">
        </div>
        <div class="text">
          <div class="mini-progressbar">
            <!--ProgressBar组件-->
            <ProgressBar :prossBarBaiFenBi="prossBarBaiFenBi" @progressTouchEnd="progressTouchEnd" />
          </div>
          <h2 class="name" >{{currentSong.name}}</h2>
          <p class="desc" >{{currentSong.singer}}</p>
        </div>
        <div class="control">
          <!--迷你播放器的进度条-->
          <miniProgressBar :prossBarBaiFenBi="prossBarBaiFenBi">
            <i class="icon-mini" :class="changeMiniPalyImg" @click.stop="togglePlayStatue" ></i>
          </miniProgressBar>
        </div>
        <div class="control" >
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!--playlist组件-->
    <!--<playlist></playlist>-->
    <!--播放器按钮-->
    <audio :src="currentSong.url" ref="audio"
           @canplay="audioCanPlay"
           @error="audioError"
           @timeupdate="timeupdate" @ended="ended"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapState, mapGetters, mapActions} from 'vuex'
import createKeyframeAnimation from 'create-keyframe-animation'
import {Base64} from 'js-base64'
import Lyric from 'lyric-parser'

import ProgressBar from '../../components/progress-bar/progress-bar'
import miniProgressBar from '../../components/mini-progress-bar/mini-progress-bar'
import {playMode} from '../../common/js/playModeConfig'
import {songsRandomPaiXu} from '../../common/js/songsRandomPaiXu'
import {getLyric} from '../../api/allAPI'
import Scroll from '../../components/scroll/scroll'

export default {
  components: {
    ProgressBar,
    miniProgressBar,
    Scroll
  },
  data() {
    return {
      songReady: false,
      currentTime: 0,
      // radius: 32,
      currentLyric: null,
      currentLyricLineNum: 0,
      currentShow: 'cd',
      touch: {}, // 歌词左右滑动的时候，滑动的默认参数
      showBuFenPlayingLyric: '' // 显示部分歌词
    }
  },
  computed: {
    ...mapState(['fullScreen', 'playList', 'sequenceList', 'playing', 'currentIndex', 'mode']),
    ...mapGetters(['currentSong']),
    // 改变播放模式
    changePalyMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    // 改变大播放按钮的样式
    changePalyImg () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    // 改变mini播放按钮的样式
    changeMiniPalyImg () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    // 图片的旋转与暂停
    changeImgrotate() {
      return this.playing ? 'play' : 'play pause'
    },
    disableClass () {
      return this.songReady ? '' : 'disable'
    },
    // 进度条的显示进度
    prossBarBaiFenBi () {
      return this.currentTime / this.currentSong.duration
    }
  },
  methods: {
    ...mapActions(['setFullscreen', 'setPlaying', 'setCurrentindex', 'setMode', 'setPlaylist']),
    // 显示模拟播放器
    showMiniPlay() {
      this.setFullscreen(false)
      this.$refs.bigPlay.style.display = 'none'
    },
    // 显示全屏播放器
    showFullScreenPlay() {
      console.log('点击了')
      this.setFullscreen(true)
    },
    // 全屏播放器的css动画
    enter(el, done) {
      const {x, y, scale} = this.myGetPositionAndScale()
      console.log('显示全屏时候的xy：', x, y)
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        70: {
          transform: `translate3d(0, 0, 0) scale(${1.1})`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
          // transform: `translate(${x}px, ${y}px) scale(1)`
        }
      }
      // 注册动画
      createKeyframeAnimation.registerAnimation({
        name: 'move', // 动画名字
        animation, // 动画样式
        presets: { // 配置动画的其他样式，第三方库中规定好的样式
          duration: 400,
          easing: 'linear'
        }
      })
      // 运行动画
      createKeyframeAnimation.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    // 全屏播放器的css动画
    afterEnter() {
      // 结束动画
      createKeyframeAnimation.unregisterAnimation('move')
      this.$refs.cdWrapper.style.transform = ''
    },
    // 全屏播放器的css动画
    leave(el, done) {
      const {x, y, scale} = this.myGetPositionAndScale()
      console.log('显示小屏时候的xy：', x, y)
      this.$refs.cdWrapper.style.transaction = 'all 0.4s'
      this.$refs.cdWrapper.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    // 全屏播放器的css动画
    afterLeave() {
      this.$refs.cdWrapper.style.transaction = ''
      this.$refs.cdWrapper.style.transform = ''
    },
    // 获取全屏播放器的css动画的起始位置
    myGetPositionAndScale() {
      const targetWidth = 40 // mini播放器的图片宽度,目标宽度
      const left = 40 // mini播放器的图片的中心距离左侧屏幕的距离
      const bottom = 30 // mini播放器的图片的中心距离下侧屏幕的距离
      const top = 80 // 大型播放器的图片的中心距离上侧屏幕的距离
      const width = window.innerWidth * 0.8 // 大型播放器的图片的宽度
      const scale = targetWidth / width // 初始缩放比例
      const x = -(window.innerWidth / 2 - left) // 圆心需要移动的x轴的距离 大图移动到小图
      const y = window.innerHeight - top - width / 2 - bottom
      return {x, y, scale}
    },
    // 点击播放按钮的时候，改变vuex中的playing的值
    togglePlayStatue () {
      if (!this.currentSong) {
        return
      }
      this.setPlaying(!this.playing)
      // 暂停按钮、播放按钮，对应歌词暂停和滚动
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    // 点击播放上一首歌曲
    prevSongs () {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.setMode(playMode.loop)
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index < 0) {
          index = this.playList.length - 1
        }
        this.setCurrentindex(index)
        this.setPlaying(true)
        this.songReady = false
      }
    },
    // 点击播放下一首歌曲
    nextSongs () {
      if (!this.songReady) {
        return
      }
      // 歌曲数组只有一首歌的情况,调用循环播放loop()函数,同时把播放模式变成单曲循环实现，单曲循环
      if (this.playList.length === 1) {
        this.setMode(playMode.loop)
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index >= this.playList.length) {
          index = 0
        }
        this.setCurrentindex(index)
        this.setPlaying(true)
        this.songReady = false // 解决快速点击上一首下一首，出现的报错问题，songReady是一个标识位
      }
    },
    // 歌曲播放完成后，根据播放模式，自动播放下一首歌曲或者循环播放或者随机播放下一首歌曲
    ended () {
      // 循环播放
      this.loop()
    },
    // 循环播放 ended()函数调用
    loop () {
      if (this.mode === playMode.loop) {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        // 循环播放，播放完后，歌词位置变成0
        this.currentLyric.seek(0)
      } else {
        this.nextSongs()
      }
    },
    audioCanPlay () {
      this.songReady = true
    },
    audioError () {
      // 歌曲加载失败的时候
      this.songReady = true
    },
    // audio标签自带的事件，
    timeupdate (e) {
      this.currentTime = e.target.currentTime
    },
    formatTime (currentTime) {
      currentTime = Math.floor(currentTime)
      let second = currentTime % 60
      let minute = Math.floor(currentTime / 60)
      if (second < 10) {
        second = '0' + second
      }
      if (minute < 10) {
        minute = '0' + minute
      }
      return `${minute}:${second}`
    },
    // 手指拖动小圆点接结束的时候，显示进度条所在位置的播放时间和歌曲开始播放
    progressTouchEnd (showTuoDongAfterTime) {
      this.currentTime = showTuoDongAfterTime * this.currentSong.duration
      if (!this.playing) {
        this.togglePlayStatue() // 调用点击播放按钮的时候，改变vuex中的playing的值
      }
      this.$refs.audio.currentTime = this.currentTime // 设置歌曲的播放时间
      // 拖动结束后，显示对应位置的歌词 // 点击进度条，显示点击位置的歌词
      this.currentLyric.seek(this.currentTime * 1000)
    },
    // 点击图标选择播放模式
    choosePlayMode () {
      this.$nextTick(() => {
        const newMode = (this.mode + 1) % 3
        // 改变vuex中的mode值
        this.setMode(newMode)
        // 如果点击的是随机播放，对playList数组里面的歌曲进行随机排序
        let songsRandomPaiXuArr = []
        if (this.mode === playMode.random) {
          songsRandomPaiXuArr = songsRandomPaiXu(this.sequenceList)
        } else {
          songsRandomPaiXuArr = this.sequenceList
        }
        // 歌曲位置改变，但是当前正在播放的歌曲的id是不变的，根据id找到排序后的对应的歌曲的index
        let index = songsRandomPaiXuArr.findIndex((song) => {
          return song.id === this.currentSong.id
        })
        this.setPlaylist(songsRandomPaiXuArr) // 修改vuex中的playList 值为 songsRandomPaiXuArr
        this.setCurrentindex(index)
      })
    },
    // 处理歌词
    handlerLyric ({lineNum, txt}) {
      // 是第三方库lyric-parser中，new Lyric后的回调函数，lineNum是歌词的所在行, txt是歌词文本，是默认的2个参数
      this.currentLyricLineNum = lineNum
      this.showBuFenPlayingLyric = txt
      // 当前的歌词的行数大于6行，需要进行滚动，保证当前歌词在屏幕的中心
      if (lineNum > 6) {
        // 需要滚动到第几行的p标签
        let scrollToDOM = this.$refs.lyricLine[lineNum - 6]
        this.$refs.lyricList.scrollToElement(scrollToDOM, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
    },
    // 手指左右滑动歌词开始
    touchStartLyric (e) {
      this.touch.lyricFlag = true
      this.touch.clickX = e.touches[0].pageX
      this.touch.clickY = e.touches[0].pageY
    },
    // 手指左右滑动歌词移动
    touchMoveLyric (e) {
      if (!this.touch.lyricFlag) {
        return
      }
      this.touch.moveLenX = e.touches[0].pageX - this.touch.clickX
      this.touch.moveLenY = e.touches[0].pageY - this.touch.clickY
      if (Math.abs(this.touch.moveLenY) > Math.abs(this.touch.moveLenX)) {
        return
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const minMoveLen = Math.min(0, Math.max(-window.innerWidth, left + this.touch.moveLenX))
      this.touch.huaDongBaiFenBi = minMoveLen / window.innerWidth
      this.touch.opacity = 1 - Math.abs(this.touch.huaDongBaiFenBi)
      this.$refs.lyricList.$el.style.transform = `translate3d(${minMoveLen}px, 0, 0)`
      this.$refs.lyricList.$el.style.transition = `all 0s linear`
      this.$refs.cdWrapper.style.opacity = this.touch.opacity
      this.$refs.cdWrapper.style.transition = `all 0s linear`
      this.$refs.buFenLyric.style.opacity = this.touch.opacity
      this.$refs.buFenLyric.style.transition = `all 0s linear`
    },
    // 手指左右滑动歌词结束
    touchEndLyric () {
      let finalWidth
      let opacity
      // 从右向左滑动
      if (this.currentShow === 'cd') {
        if (Math.abs(this.touch.huaDongBaiFenBi) > 0.2) {
          finalWidth = -window.innerWidth
          this.currentShow = 'lyric'
          opacity = 0
        } else {
          finalWidth = 0
          opacity = 1
        }
      } else {
        // 从左向右滑动
        if (Math.abs(this.touch.huaDongBaiFenBi) < 0.8) {
          finalWidth = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          finalWidth = -window.innerWidth
          opacity = 0
        }
      }
      this.$refs.lyricList.$el.style.transform = `translate3d(${finalWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style.transition = `all .3s linear`
      this.$refs.cdWrapper.style.opacity = opacity
      this.$refs.cdWrapper.style.transition = `all .3s linear`
      this.$refs.buFenLyric.style.opacity = opacity
      this.$refs.buFenLyric.style.transition = `all .3s linear`
    }
  },
  watch: {
    // 歌曲改变的时候，调用audio标签自带的play()方法
    currentSong(newSong, oldSong) {
      // newSong, oldSong 是watch对象里面的方法中，自带的2个默认值，第一个值是newValue 第二个值是oldValue
      if (newSong.id === oldSong.id) {
        return
      }
      console.log('歌曲改变了')
      // 解决连续点击下一首歌曲，出现的歌词回跳的问题
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      // 确保dom加载完成，在调用歌词播放器，否则报错
      setTimeout(() => {
        // 获取对应的歌曲的歌词,必须传入歌曲的mid
        getLyric(this.currentSong.mid)
          .then((response) => {
            if (response.data.code === 0) {
              // 得到的歌词是base64格式的字符串，需要用第三方库js-base64先解码,在用第三方库lyric-parser,格式化歌词
              let formatLyric = Base64.decode(response.data.lyric)
              this.currentLyric = new Lyric(formatLyric, this.handlerLyric)
              if (this.playing) {
                this.currentLyric.play() // play()是第三方库lyric-parser提供的方法,播放歌词用的
              }
            }
          })
          .catch((err) => {
            // 没有获取到歌词的一些处理
            console.log(err)
            this.currentLyric = null
            this.currentLyricLineNum = 0
            this.showBuFenPlayingLyric = ''
          })
        // 播放器开始播放
        this.$refs.audio.play()
      }, 500)
    },
    // 播放状态改变的时候，按钮变换图片，同时歌曲暂停或播放
    playing() {
      this.$nextTick(() => {
        console.log('歌曲改变了')
        this.playing ? this.$refs.audio.play() : this.$refs.audio.pause()
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .player
    position :relative
    z-index: 80
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $lyric-color-text
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $lyric-color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
          margin-top :-8px
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
        .mini-progressbar
          margin-top :-7px
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
