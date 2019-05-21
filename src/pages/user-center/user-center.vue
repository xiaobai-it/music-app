<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="$router.back()">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <!--2个大按钮组件-->
        <Switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"/>
      </div>
      <div class="play-btn">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper">
        <div class="list-scroll" ref="ilikedivflag">
          <div class="list-inner">
            我喜欢的页面
            <!--<song-list :songs="favoriteList" @select="selectSong"></song-list>-->
          </div>
        </div>
        <Scroll class="list-scroll" :data="savePlaySongsRecently" ref="ilistionrecentlyflag">
          <div class="list-inner">
            <!--我最近听的组件-->
            <!--最近播放的歌曲的组件,歌曲列表组件-->
            <SongList :musicData="savePlaySongsRecently" @clickOneSong="clickOneSong"/>
            <span v-show="!savePlaySongsRecently.length">您还没有播放过任何歌曲</span>
          </div>
        </Scroll>
      </div>
      <div class="no-result-wrapper">
        <!--<no-result :title="noResultDesc"></no-result>-->
      </div>
      <!--顶部弹框组件-->
      <TopAlert ref="topalert">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">一首歌曲已经添加到播放列表</span>
        </div>
      </TopAlert>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapActions, mapState} from 'vuex'
import Switches from '../../components/switches/switches'
import SongList from '../../components/song-list/song-list'
import TopAlert from '../../components/top-alert/top-alert'
import Scroll from '../../components/scroll/scroll'

export default {
  components: {
    Switches,
    SongList,
    TopAlert,
    Scroll
  },
  data() {
    return {
      currentIndex: 0,
      switches: [{name: '我收藏的'}, {name: '最近听的'}]
    }
  },
  computed: {
    ...mapState(['savePlaySongsRecently'])
  },
  methods: {
    ...mapActions(['searchResultClickOneSongInsertAndToPlayPage']),
    // 点击2个大按钮的某一个显示对应的组件
    switchItem(index) {
      this.currentIndex = index
      if (index === 0) {
        this.$refs.ilikedivflag.style.display = 'block'
        this.$refs.ilistionrecentlyflag.$el.style.display = 'none'
      } else {
        this.$refs.ilistionrecentlyflag.$el.style.display = 'block'
        this.$refs.ilikedivflag.style.display = 'none'
        this.$refs.ilistionrecentlyflag.refresh()
      }
    },
    // 点击最近播放页面的一首歌曲，把歌曲添加到当前播放列表中
    clickOneSong(item, index) {
      if (index !== 0) {
        this.searchResultClickOneSongInsertAndToPlayPage(item)
        // topalert组件的方法
        this.$refs.topalert.show()
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
