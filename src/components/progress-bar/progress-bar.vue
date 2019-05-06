<template>
  <div class="progress-bar" ref="wrapProgressDiv" @click="clickProgressPossiTion">
    <div class="bar-inner">
      <div class="progress" ref="progressDiv" ></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
      @touchstart="progressTouchStart"
      @touchmove="progressTouchMove"
      @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  props: {
    prossBarBaiFenBi: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      touch: { touchFlag: false, touchpos: 0, progressWidth: 0 } // 进度条上的圆点的默认值
    }
  },
  methods: {
    // 点击进度条
    progressTouchStart (e) {
      this.touch.touchFlag = true
      this.touch.touchpos = e.touches[0].pageX // 手指点击圆点的时候，圆点位于进度条的位置
      this.touch.progressWidth = this.$refs.progressDiv.clientWidth // 手指点击圆点的时候，进度条的滚动长度
    },
    // 拖动进度条
    progressTouchMove (e) {
      if (this.touch.touchFlag === false) {
        return
      }
      let xiaoQiuMoveLen = e.touches[0].pageX - this.touch.touchpos // 小球移动的距离
      const wrapWidth = this.$refs.wrapProgressDiv.clientWidth - 16 // 进度条显示的总长度
      // 进度条需要移动的距离,同时进行了边界的限定
      let progressMoveLen = Math.min(wrapWidth, Math.max(0, this.touch.progressWidth + xiaoQiuMoveLen))
      // 对小球和滚动条位置变换的css设置
      this.$refs.progressDiv.style.width = `${progressMoveLen}px`
      this.$refs.progressBtn.style.transform = `translate3d(${progressMoveLen}px, 0, 0)`
    },
    // 手指移开进度条
    progressTouchEnd (e) {
      this.touch.touchFlag = false // 不变成false，会导致歌曲播放的时候，进度条总是回弹
      // 当前进度条和总进度条的比例
      let showTuoDongAfterTime = this.$refs.progressDiv.clientWidth / (this.$refs.wrapProgressDiv.clientWidth - 16)
      this.$emit('progressTouchEnd', showTuoDongAfterTime)
    },
    // 点击进度条的某一个位置，播放当前位置的歌曲的对应时间
    clickProgressPossiTion (e) {
      // 点击位置和总进度条的比例
      console.log(e)
      let rect = this.$refs.wrapProgressDiv.getBoundingClientRect()
      let offsetX = e.pageX - rect.left
      let showTuoDongAfterTime = offsetX / (this.$refs.wrapProgressDiv.clientWidth - 16)
      this.$emit('progressTouchEnd', showTuoDongAfterTime)
      // 对小球和滚动条位置变换的css设置
      this.$refs.progressDiv.style.width = `${offsetX}px`
      this.$refs.progressBtn.style.transform = `translate3d(${offsetX}px, 0, 0)`
      // 使用e.offsetX，会出现点击不正常的情况，所以使用了this.$refs.wrapProgressDiv.getBoundingClientRect()
      // let showTuoDongAfterTime = e.offsetX / (this.$refs.wrapProgressDiv.clientWidth - 16)
      // this.$emit('progressTouchEnd', showTuoDongAfterTime)
      // 对小球和滚动条位置变换的css设置
      // this.$refs.progressDiv.style.width = `${e.offsetX}px`
      // this.$refs.progressBtn.style.transform = `translate3d(${e.offsetX}px, 0, 0)`
      // 点击进度条，显示点击位置的歌词
    }
  },
  watch: {
    prossBarBaiFenBi () {
      // console.log(this.prossBarBaiFenBi)
      if (this.prossBarBaiFenBi >= 0 && !this.touch.touchFlag) {
        const wrapWidth = this.$refs.wrapProgressDiv.clientWidth - 16 // 16是小圆点的宽度
        let moveLen = Math.floor(this.prossBarBaiFenBi * wrapWidth)
        // console.log(moveLen)
        this.$refs.progressDiv.style.width = `${moveLen}px`
        this.$refs.progressBtn.style.transform = `translate3d(${moveLen}px, 0, 0)`
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
